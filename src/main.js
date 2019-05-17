import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import Pram from 'pram';
import { find, isArray } from 'lodash';

import selectionStateBranch from './state/selections';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';

import './style/app.scss';
import { UrlSearchParams } from './utils/urlParam';
import states from './data/states';

const store = configureStore();
const history = createHistory();
const pram = new Pram(history);

const params = pram.getParams();
console.log('params', params);
if (params[UrlSearchParams.refCode]) {
  console.log('setting ref', params[UrlSearchParams.refCode]);
  store.dispatch(selectionStateBranch.actions.setRefCode(params[UrlSearchParams.refCode]));
}

if (params[UrlSearchParams.issueFilter]) {
  let issueFilters = params[UrlSearchParams.issueFilter];
  if (!isArray(issueFilters)) {
    issueFilters = issueFilters.split(',');
  }
  store.dispatch(selectionStateBranch.actions.setIssueTypeFilters(issueFilters));
}

if (params[UrlSearchParams.location]) {
  const location = params[UrlSearchParams.location];
  if (find(states, ele => ele.USPS === location)) {
    store.dispatch(selectionStateBranch.actions.setUsState(location));
  }
}

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

renderApp();
