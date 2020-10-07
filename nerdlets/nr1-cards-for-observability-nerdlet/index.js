import React from 'react';

import { nerdlet, NerdletStateContext, Spinner } from 'nr1';

import Card from '../../library/components/card';
import Help from '../../library/components/help';
import Modal from '../../library/components/modal';
import CardsEditor from '../../library/components/cards-editor';
import QueriesEditor from '../../library/components/queries-editor';
import ScriptsEditor from '../../library/components/scripts-editor';
import FloatingButtons from '../../library/components/floating-buttons';
import DashboardPicker from '../../library/components/dashboard-picker';
import DashboardControl from '../../library/components/dashboard-control';
import DashboardOptions from '../../library/components/dashboard-options';

import engine from '../../library/utils/engine';
import {
  getUser,
  getDashboards,
  getDashboard,
  setDashboard,
  getUrl
} from '../../library/utils/data';
import {
  handleClicks,
  addScripts,
  emptyBoard
} from '../../library/utils/helper';

export default class CardsForObservability extends React.Component {
  state = {
    modal: '',
    data: {},
    fetching: false,
    current: { auth: false },
    showPicker: false
  };

  componentDidMount() {
    window.addEventListener('message', this.handleMessages, false);
    document.addEventListener('click', handleClicks, false);
    this.setup();
  }

  componentWillUnmount() {
    this.fetchTimeout();
    document.removeEventListener('click', handleClicks, false);
    window.removeEventListener('message', this.handleMessages, false);
  }

  static contextType = NerdletStateContext;

  handleMessages = e => {
    if (window.origin !== e.origin) return;
    if (e.data === 'refresh-data') this.fetchTimeout(true);
  };

  loadDashboard = async dashboardCode => {
    const accountId = parseInt(dashboardCode.substr(32), 10);
    const dashboardId = dashboardCode
      .substring(0, 32)
      .replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/g, '$1-$2-$3-$4-$5');
    const dashboards = await getDashboards(accountId);
    const dashboard = dashboards.reduce(
      (acc, cur) => (cur.id === dashboardId ? cur : acc),
      null
    );
    if (dashboard) this.pickDashboard(accountId, dashboard);
  };

  pickDashboard = async (accountId, dashboard) => {
    if (!dashboard || !('id' in dashboard)) return;
    document.dispatchEvent(new CustomEvent('dashboardclosed'));
    const { current } = this.state;

    const board = accountId
      ? await getDashboard(accountId, dashboard.id)
      : await await getUrl(`gallery/${dashboard.id}/dashboard.json`, 'json');
    const dashboardData = board || emptyBoard;

    if ('logBoardJSON' in window && window.logBoardJSON) {
      console.log(JSON.stringify(dashboardData)); // eslint-disable-line no-console
      window.logBoardJSON = false;
    }

    if (accountId)
      nerdlet.setUrlState({
        dashboard: `${(dashboard.id || '').replace(/-/g, '')}${accountId}`
      });

    current.auth = false;
    this.setState(
      {
        accountId: accountId || null,
        dashboard,
        dashboardData,
        firstFetch: false,
        current,
        showPicker: true
      },
      () => this.fetchTimeout(true)
    );
  };

  saveQueries = async queries => this.saveData(queries, 'queries');

  saveScripts = async scripts => this.saveData(scripts, 'scripts');

  saveCards = async cards => this.saveData(cards, 'cards');

  saveData = async (data, type) => {
    const { accountId, dashboard, dashboardData } = this.state;
    dashboardData[type] = data;
    setDashboard(accountId, dashboard.id, dashboardData);
    this.setState({ dashboardData }, () => this.fetchTimeout(true));
  };

  startFetch = () => {
    const { fetching } = this.state;
    if (!fetching) this.setState({ fetching: true }, () => this.fetchData());
  };

  fetchData = async () => {
    const { dashboard, dashboardData: { queries } = {}, current } = this.state;

    if (queries && queries.length) {
      const data = {};
      for await (const query of queries) {
        data[query.name] = await engine.runFlow(
          query.flow,
          data,
          query.name,
          current
        );
      }

      this.setState(
        {
          data,
          fetching: false,
          fetchTimeoutId:
            'refresh' in dashboard && dashboard.refresh
              ? setTimeout(this.startFetch, dashboard.refresh * 1000)
              : null
        },
        this.postFetch
      );
    } else {
      this.setState({ fetching: false });
    }
  };

  postFetch = () => {
    const { firstFetch, dashboardData: { scripts } = {}, data } = this.state;

    if (!firstFetch) {
      addScripts(scripts);
      this.setState({ firstFetch: true });
    }
    document.dispatchEvent(new CustomEvent('datarefreshed', { detail: data }));
  };

  fetchTimeout = start => {
    const { fetchTimeoutId } = this.state;
    if (fetchTimeoutId) clearTimeout(fetchTimeoutId);
    if (start) this.startFetch();
  };

  setup = async () => {
    nerdlet.setConfig({ header: false, timePicker: false });

    const { dashboard } = this.context;
    const { current } = this.state;
    const user = await getUser();
    current.user = user;
    this.setState({ current, showPicker: !dashboard }, () =>
      dashboard ? this.loadDashboard(dashboard) : null
    );
  };

  markAuth = () => {
    const { current } = this.state;
    current.auth = true;
    this.setState({ current });
  };

  menuBtnClicked = type => this.setState({ modal: type });

  displayHelp = e => {
    e.preventDefault();
    this.menuBtnClicked('help');
  };

  closeDashboard = () => {
    document.dispatchEvent(new CustomEvent('dashboardclosed'));
    this.fetchTimeout();
    nerdlet.setUrlState({ dashboard: null });
    const { current } = this.state;
    current.auth = false;
    this.setState({
      accountId: null,
      dashboard: null,
      dashboardData: emptyBoard,
      data: null,
      fetchTimeoutId: null,
      current
    });
  };

  copiedDashboard = (accountId, dashboard) => {
    this.closeModal();
    this.pickDashboard(accountId, dashboard);
  };

  dashboardUpdate = dashboard => this.setState({ dashboard });

  dashboardControlClick = type => {
    if (['help', 'settings', 'copy'].indexOf(type) > -1) {
      this.menuBtnClicked(type);
    } else if (type === 'closeDashboard') {
      this.closeDashboard();
    }
  };

  closeModal = () => this.setState({ modal: '' });

  modalContent = type => {
    const {
      accountId,
      dashboard,
      dashboardData: { queries, scripts, cards } = {},
      current: { user }
    } = this.state;

    switch (type) {
      case 'scripts':
        return (
          <ScriptsEditor
            scripts={scripts}
            accountId={accountId}
            onSave={accountId ? this.saveScripts : null}
          />
        );
      case 'queries':
        return (
          <QueriesEditor
            queries={queries}
            accountId={accountId}
            onSave={accountId ? this.saveQueries : null}
          />
        );
      case 'cards':
        return (
          <CardsEditor
            cards={cards}
            accountId={accountId}
            onSave={accountId ? this.saveCards : null}
          />
        );
      case 'settings':
        return (
          <DashboardOptions
            accountId={accountId}
            dashboard={dashboard}
            data={{ queries, scripts, cards }}
            user={user}
            onUpdate={this.dashboardUpdate}
            onAuth={this.markAuth}
            onCopy={this.copiedDashboard}
          />
        );
      case 'help':
        return <Help />;
      default:
        return null;
    }
  };

  render() {
    const {
      modal,
      dashboard,
      dashboardData: { cards } = {},
      data,
      fetching,
      current,
      showPicker
    } = this.state;

    const picker = showPicker ? (
      <div className="container">
        <Modal style={{ width: '90%', height: '90%' }} noClose>
          <DashboardPicker user={current.user} onPick={this.pickDashboard} />
        </Modal>
      </div>
    ) : (
      <Spinner />
    );

    return dashboard ? (
      <div className={`container ${dashboard.layout || ''}`}>
        {cards &&
          data &&
          Object.keys(data).length > 0 &&
          cards.map((card, c) => (
            <Card
              key={c}
              card={card}
              data={data}
              layout={dashboard.layout || 'fluid'}
              index={c}
            />
          ))}
        {['scripts', 'queries', 'cards', 'help'].indexOf(modal) > -1 ? (
          <Modal
            style={{ width: '90%', height: '90%' }}
            onClose={this.closeModal}
          >
            {this.modalContent(modal)}
          </Modal>
        ) : null}
        {modal === 'settings' ? (
          <Modal style={{ height: '500px' }} onClose={this.closeModal}>
            {this.modalContent(modal)}
          </Modal>
        ) : null}
        {dashboard && !('protect' in dashboard && !current.auth) ? (
          <FloatingButtons clicked={this.menuBtnClicked} />
        ) : null}
        <DashboardControl
          name={dashboard.name}
          fetching={fetching}
          onClick={this.dashboardControlClick}
        />
      </div>
    ) : (
      picker
    );
  }
}
