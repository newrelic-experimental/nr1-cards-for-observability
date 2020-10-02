import {
  AccountStorageMutation,
  AccountStorageQuery,
  NerdGraphQuery,
  UserQuery,
  UserStorageMutation,
  UserStorageQuery,
} from 'nr1';

import uuid from '../utils/uuid';

const rootUrl = 'https://raw.githubusercontent.com/amit-y/cfo-docs/master/';

const getUser = async () => {
  const user = await UserQuery.query();
  const {
    data: { name, email },
  } = user;
  return { name, email };
};

const getDashboards = async accountId => {
  const dashboards = await AccountStorageQuery.query({
    accountId: accountId,
    collection: 'observability-cards',
    documentId: 'dashboards',
  });
  return ((dashboards || {}).data || {}).dashboards || [];
};

const setDashboards = async (accountId, dashboards) => {
  const saveOperation =
    dashboards && dashboards.length
      ? await AccountStorageMutation.mutate({
          accountId: accountId,
          actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
          collection: 'observability-cards',
          documentId: 'dashboards',
          document: { dashboards },
        })
      : await AccountStorageMutation.mutate({
          accountId: accountId,
          actionType: AccountStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
          collection: 'observability-cards',
          documentId: 'dashboards',
        });
};

const getDashboard = async (accountId, dashboardId) => {
  const dashboard = await AccountStorageQuery.query({
    accountId: accountId,
    collection: 'observability-cards',
    documentId: dashboardId,
  });

  return (dashboard || {}).data;
};

const setDashboard = async (accountId, dashboardId, dashboard) => {
  const saveOperation = await AccountStorageMutation.mutate({
    accountId: accountId,
    actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
    collection: 'observability-cards',
    documentId: dashboardId,
    document: dashboard,
  });
};

const getUrl = async (path, type = 'text', root = rootUrl) => {
  const data = await fetch(`${root}${path}`);
  const resp = await data[type]();
  return resp;
};

const getUserDoc = async docId => {
  const doc = await UserStorageQuery.query({
    collection: 'observability-cards',
    documentId: docId,
  });
  return ((doc || {}).data || {}).doc;
};

const setUserDoc = async (docId, doc) => {
  const saveOperation = doc
    ? await UserStorageMutation.mutate({
        actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'observability-cards',
        documentId: docId,
        document: { doc },
      })
    : await UserStorageMutation.mutate({
        actionType: UserStorageMutation.ACTION_TYPE.DELETE_DOCUMENT,
        collection: 'observability-cards',
        documentId: docId,
      });
  return saveOperation;
};

const getFavorites = async () => {
  const favorites = await getUserDoc('favorites');
  return favorites || [];
};

const setFavotites = async favorites => {
  const saveOperation =
    favorites && favorites.length
      ? await setUserDoc('favorites', favorites)
      : await setUserDoc('favorites');
};

const getSettings = async type => {
  const settings = await getUserDoc(`settings-${type}`);
  return settings;
};

const setSettings = async (type, settings) => {
  const saveOperation = settings
    ? await setUserDoc(`settings-${type}`, settings)
    : await setUserDoc(`settings-${type}`);
};

const dashboardObject = (obj = {}) => {
  const { name, id, refresh, created: { user } = {}, ...more } = obj;
  const dashboard = {
    name: name || 'untitled',
    id: id || uuid.generate(),
    refresh: refresh || 30,
    created: {
      user: user || {},
      timestamp: Date.now(),
    },
  };

  return { ...dashboard, ...more };
};

export {
  getUser,
  getDashboards,
  setDashboards,
  getDashboard,
  setDashboard,
  getUrl,
  getFavorites,
  setFavotites,
  getSettings,
  setSettings,
  dashboardObject,
};
