import React from 'react';

export const UserContext = React.createContext({
    loggedIn: false,
    userType: "visitor",
    userEmail: "user@example.com",
    updateContext: (data) => { },
})