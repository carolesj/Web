import React from 'react';

/*
    GLOBAL CONTEXT DECLARATOR

    Any more context to be operated on by any consumer in the
    component hierarchy should be included here, as well as
    the handler functions to modify the plain data.

    The initial value does not matter here, all variables MUST
    be declared with the same NAMES and have their VALUES
    overriden in the Application parent component state.
 */
export const UserContext = React.createContext({
    // User context data
    loggedIn: false,
    userEmail: "",
    userRights: "",

    // Updates user context data
    updateUserContext: (newState) => { },
})