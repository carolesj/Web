import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import ActionBar from './ActionBar';
import MainContent from './MainContent';

class Application extends React.Component {
//    constructor(props) {
//        super(props)
//
//        /*
//            CONTEXT MODIFIER
//
//            Change logged in user state.
//            Important state to be tracked is:
//            - Login status (is any user logged in?)
//            - User rights (is the user an admin or customer?)
//            - User e-mail (identifies the user univocally)
//        */
//        this.handleUpdateUserContext = (newState) => {
//            this.setState(state => ({  // receives old state as param
//                loggedIn: newState.loggedIn,
//                userEmail: newState.userEmail,
//                userRights: newState.userRights,
//            }))
//        }
//
//        this.handleUpdateViewContext = (newState) => {
//            this.setState(state => ({
//                currentView: newState.currentView,
//            }))
//        }
//
//        /*
//            GLOBAL CONTEXT
//
//            This state describes the complete context of the app.
//            Any more state to be used deep inside the component hierarchy
//            should be initialized HERE, passed down via context provider
//            and modified deep down via context consumers.
//         */
//        this.state = {
//            // User context
//            loggedIn: false,
//            userEmail: "user@example.com",
//            userRights: "visitor",
//
//            // Use this to update user context
//            updateUserContext: this.handleUpdateUserContext,
//
//            // View context
//            currentView: "home",
//
//            // Use this to update view context
//            updateViewContext: this.handleUpdateViewContext,
//        }
//    }

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
                <ActionBar />
                <MainContent />
            </React.Fragment>
        )
    }
}

export default Application