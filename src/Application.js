import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import ActionBar from './ActionBar';
import { UserContext } from './UserContext';

let siteData = {
    products: [
        // {id: "exampleString", name:"exampleString", description: "exampleString", media: "./product1.jpg"}, {...}, ...
        {id: "biscoitoscaninos", name:"Biscoitos Caninos", description: "Deliciosos agrados de qualidade para cachorros", media: "./product1.jpg"},
        {id: "boladetenis", name:"Bola de Tênis", description: "Bola verde que quica", media: "./product2.jpg"},
        {id: "coleira", name:"Coleira", description: "Coleira de couro sintético", media: "./product3.jpg"},
        {id: "ervadegato", name:"Erva de Gato", description: "Erva recreativa ressequida para gatos", media: "./product4.jpg"},
        {id: "guia", name:"Guia", description: "Guia para coleiras padrão", media: "./product5.JPG"},
        {id: "petiscodegato", name:"Petisco de Gato", description: "Deliciosos agrados de qualidade para gatos", media: "./product6.jpg"},
        {id: "racao", name:"Ração", description: "Ração de primeira qualidade", media: "./product7.jpg"}
    ],
    services: [
        // {service: "exampleString", description: "exampleString", media: "./service1.jpg"}, {...}, ...
        {service: "Banho", description: "Banho com xampu hipoalergênico para gatos e cães", media: "./service1.jpg"},
        {service: "Cortar Unha", description: "Cuidados com a unha de seu gato com segurança e sem machucá-lo", media: "./service2.jpg"},
        {service: "Massagem", description: "Massagem relaxante para seu cão", media: "./service3.jpg"},
        {service: "Tosa", description: "Corte dos pêlos do seu animal", media: "./service4.jpg"}
    ],
    shoppingCart: {
        user: "",
        items: [],
    },
}

let userData = {
    1: {
        user: "",
        animals: [
            // {name: "exampleString", race: "exampleString", media: "./dog1.jpg"}, {...}, ...
            {name: "Felicloper", race: "Bernese", media: "./dog1.jpg"},
            {name: "Glauber", race: "McNab", media: "./dog2.jpg"},
            {name: "Gustavo", race: "Buldogue", media: "./dog3.jpg"},
            {name: "Caramelo", race: "Harrier", media: "./dog4.jpg"},
            {name: "Carolhos", race: "SRD", media: "./dog5.jpg"},
            {name: "Nerso", race: "Labrador", media: "./dog6.jpg"},
            {name: "Sabrino", race: "Pharaoh Hound", media: "./dog7.jpg"},
            {name: "Kik", race: "Chihuahua", media: "./dog8.jpg"},
            {name: "Frederico", race: "Siamês", media: "./cat1.jpg"},
            {name: "Fofinho", race: "Maine Coon", media: "./cat2.jpg"}
        ],
        appointments: [
            // {service: "exampleString", animal: "exampleString", dateUTC:"DD-MM-AAAAZ"}, {...}, ...
            {service: "Banho", animal: "Sabrino", dateUTC:"06-06-2018"},
            {service: "Massagem", animal: "Nerso", dateUTC:"24-06-2019"},
            {service: "Cortar Unha", animal: "Fofinho", dateUTC:"06-08-2018"},
            {service: "Tosa", animal: "Felicloper", dateUTC:"04-06-2018"}
        ],
    }
}

// TODO move this out of here
function MainContent(props) {
    let headtext = null
    let subtext = null

    if (props.loggedIn) {
        headtext = "Você é um " + props.userRights
        subtext = "Explore o painel para mais opções"
    } else {
        headtext = "Seja bem vindo!"
        subtext = "Faça login para mais informações ou compra de produtos e serviços"
    }

    return (
        <div>
            <br />
            <br />
            <Typography align="center" variant="display4" gutterBottom>
                {headtext}
            </Typography>
            <Typography align="center" variant="subheading" gutterBottom>
                {subtext}
            </Typography>
        </div>
    )
}

class Application extends React.Component {
    constructor(props) {
        super(props)

        /*
            CONTEXT MODIFIER

            Change logged in user state.
            Important state to be tracked is:
            - Login status (is any user logged in?)
            - User rights (is the user an admin or customer?)
            - User e-mail (identifies the user univocally)
        */
        this.handleUpdateUserContext = (newState) => {
            this.setState(state => ({  // receives old state as param
                loggedIn: newState.loggedIn,
                userEmail: newState.userEmail,
                userRights: newState.userRights,
            }))
        }

        this.handleUpdateViewContext = (newState) => {
            this.setState(state => ({
                currentView: newState.currentView,
            }))
        }

        /*
            GLOBAL CONTEXT

            This state describes the complete context of the app.
            Any more state to be used deep inside the component hierarchy
            should be initialized HERE, passed down via context provider
            and modified deep down via context consumers.
         */
        this.state = {
            // User context
            loggedIn: false,
            userEmail: "user@example.com",
            userRights: "visitor",

            // Use this to update user context
            updateUserContext: this.handleUpdateUserContext,

            // View context
            currentView: "",

            // Use this to update view context
            updateViewContext: this.handleUpdateViewContext,
        }
    }

    render() {

        /*
            STATE HANDLING ACROSS COMPONENTS

            What we ideally want is the following:
            - If the state passed down is used only in the child component
              and not passed downwards to following children, then just
              use regular properties (props).
            - If the state passed down has to be used in subsequent children
              or if children deeply nested has to use the state, then use
              react context provider. (And operate on it downwards
              with react context consumer.)

            Regarding contexts and manipulation in deeply nested components:
            https://reactjs.org/docs/context.html#updating-context-from-a-nested-component

            Regarding some gotchas when using react context:
            https://css-tricks.com/putting-things-in-context-with-react/
         */
        return (
            <React.Fragment>
                <CssBaseline />
                <UserContext.Provider value={this.state}>
                    <ActionBar loggedIn={this.state.loggedIn} />
                    <MainContent loggedIn={this.state.loggedIn} userRights={this.state.userRights} />
                </UserContext.Provider>
            </React.Fragment>
        )
    }
}

export default Application
