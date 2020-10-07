/* eslint-disable no-return-await, no-new-func, no-console */
import { NerdGraphQuery } from 'nr1';

import template from './template';

const runFlow = async (flow, prevResults, name, meta) => {
  if (flow && flow.length) {
    const res = await flow.reduce(async (acc, cur, idx) => {
      const promisedAcc = await acc;
      if (!promisedAcc && idx !== 0) return promisedAcc;
      const sId = `${name} - step ${idx + 1}`;
      if (['nrql', 'gql'].indexOf(cur.type) > -1) {
        if (Array.isArray(promisedAcc)) {
          return Promise.all(
            promisedAcc.map(accIter =>
              runQuery(cur, accIter, prevResults, sId, meta)
            )
          );
        } else {
          return await runQuery(cur, promisedAcc, prevResults, sId, meta);
        }
      }
      if (['map', 'reduce', 'vars', 'api'].indexOf(cur.type) > -1)
        return runCode(cur, promisedAcc, prevResults, sId, meta);
    }, null);
    return res;
  }

  return null;
};

const runQuery = async (step, curResult, prevResults, name, meta) => {
  let result;
  let err;
  const queryString = template.compile(
    step.text,
    { currentResult: curResult, previousResults: prevResults, meta },
    'query'
  );

  const gql = `{
      actor {
        ${
          step.type === 'nrql'
            ? `account(id: ${step.accountId}) {
           nrql(query: "${queryString}") { results }
        }`
            : ''
        }
        ${step.type === 'gql' ? queryString : ''}
      }
    }`;

  const resp = await NerdGraphQuery.query({ query: gql });

  err = resp.errors;
  if (err) {
    report.error(`ERROR in ${name}`, err);
  } else {
    try {
      const actor = (resp.data || {}).actor || {};
      const { account: nrqlResults, ...gqlResults } = actor;
      result =
        step.type === 'nrql'
          ? ((nrqlResults || {}).nrql || {}).results
          : gqlResults;
      report.log(name, `QUERY: ${queryString}`, result);
    } catch (e) {
      err = e;
      report.error(`ERROR in ${name}`, e);
    }
  }

  return err ? null : result;
};

const runCode = async (step, curResult, prevResults, name, meta) => {
  let fn;
  let result;
  let err;

  if (step.type === 'map' && curResult && Array.isArray(curResult)) {
    try {
      fn = new Function('currentValue', 'index', 'array', step.text);
      result = curResult.map(fn);
      report.log(name, fn, result);
    } catch (e) {
      err = e;
      report.error(`ERROR in ${name}`, e);
    }

    return err ? null : result;
  }

  if (step.type === 'reduce' && curResult && Array.isArray(curResult)) {
    try {
      fn = new Function(
        'accumulator',
        'currentValue',
        'index',
        'array',
        step.text
      );
      result = curResult.reduce(fn, null);
      report.log(name, fn, result);
    } catch (e) {
      err = e;
      report.error(`ERROR in ${name}`, e);
    }

    return err ? null : result;
  }

  if (step.type === 'vars' || step.type === 'api') {
    try {
      fn = new Function(
        'currentResult',
        'previousResults',
        'meta',
        `return ${step.text}`
      );
      result = fn(curResult, prevResults, meta);
      if (step.type === 'api') result = await runFetch(result);
      report.log(name, fn, result);
    } catch (e) {
      err = e;
      report.error(`ERROR in ${name}`, e);
    }

    return err ? null : result;
  }

  return null;
};

const runFetch = async args => {
  const { url, responseType, ...requestOptions } = args;
  const response = await fetch(url, requestOptions);
  const data = await response[responseType]();
  return data;
};

function report(type, name, args) {
  if ('logQueryFlowSteps' in window && window.logQueryFlowSteps) {
    if ('groupCollapsed' in console) console.groupCollapsed(name);
    args.map(arg => console[type](arg));
    if ('groupEnd' in console) console.groupEnd();
  }
}

report.log = (name, ...args) => report('log', name, args);
report.error = (name, ...args) => report('error', name, args);

const engine = { runFlow };

export default engine;
