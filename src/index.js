import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import Application from './Application';
import petShopApp from './StoreReducers';
import registerServiceWorker from './registerServiceWorker';

// Create redux store
const store = createStore(petShopApp)


ReactDOM.render(<Application />, document.getElementById("root"));
registerServiceWorker();