const Root = process.env.REACT_APP_PETSHOP_BACKEND_LOCAL ? "http://localhost:3002" : "https://pet-shop-connector-shiny-reedbuck.mybluemix.net" // eslint-disable-line no-undef

console.log("Requests go to " + Root + "/") // eslint-disable-line no-console

export default Root