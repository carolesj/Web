import React from "react"
import ReactDOM from "react-dom"
import { createStore } from "redux"
import Application from "./Application"
import petShopApp from "./StoreReducers"
import registerServiceWorker from "./registerServiceWorker"

import { Provider } from "react-redux"

// Create redux store
const store = createStore(petShopApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById("root")
)

registerServiceWorker()