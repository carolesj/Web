import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ActionBar from './ActionBar'
import {UserContext} from './UserContext'

function AppBody(props) {
    let headtext = null
    let subtext = null

    if (props.loggedIn) {
        headtext = "Você é um " + props.userType
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

        this.handleUpdateContext = (data) => {
            this.setState(state => ({
                loggedIn: data.loggedIn,
                userType: data.userType,
                userEmail: data.userEmail,
            }))
        }

        this.state = {
            loggedIn: false,
            userType: "visitor",
            userEmail: "user@example.com",
            updateContext: this.handleUpdateContext,
        }
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <UserContext.Provider value={this.state}>
                    <ActionBar userType={this.state.userType} loggedIn={this.state.loggedIn} />
                    <AppBody userType={this.state.userType} loggedIn={this.state.loggedIn} />
                </UserContext.Provider>
            </React.Fragment>
        )
    }
}

export default Application