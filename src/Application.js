import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import ActionBar from './ActionBar';
import {UserContext} from './UserContext';

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

        /*
            GLOBAL CONTEXT

            This state describes the complete context of the app.
            Any more state to be used deep inside the component hierarchy
            should be initialized HERE, passed down via context provider
            and modified deep down via context consumers.
         */
        this.state = {
            loggedIn: false,
            userEmail: "user@example.com",
            userRights: "visitor",

            // Use this to update user context
            updateUserContext: this.handleUpdateUserContext,
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