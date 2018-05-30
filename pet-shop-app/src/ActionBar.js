import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';

import LoginDialog from './LoginDialog'
import {UserContext} from './UserContext'

const styles = {
    root: {
        flexGrow: 1,
    },

    flex: {
        flex: 1,
    },

    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}

function ActionList(props) {
    let defaultOptions = [
        { pt: "Produtos", st: "Catálogo de produtos em oferta" },
        { pt: "Serviços", st: "Listagem de serviços prestados" },
    ]

    let customerOptions = []
    if (props.userType === "customer") {
        customerOptions = [
            { pt: "Carrinho", st: "Estado do carrinho de compras" },
            { pt: "Agendamentos", st: "Informações de serviços agendados" },
        ]
    }

    let adminOptions = []
    if (props.userType === "admin") {
        adminOptions = [
            { pt: "Estoque", st: "Controle de produtos em estoque" },
            { pt: "Agendamentos", st: "Informações sobre todos agendamentos" },
        ]
    }

    let allOptions = defaultOptions.concat(customerOptions).concat(adminOptions)
    return (
        <List component="nav">
            {
                allOptions.map((item, index) => (
                    <ListItem button divider key={index}>
                        <ListItemText
                            primary={item.pt}
                            secondary={item.st}
                        />
                    </ListItem>
                ))
            }
        </List>
    )
}

class ActionBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: false,
            dialogOpen: false,
            dialogMode: "login",
        }
    }

    handleToggleDrawer(status) {
        return (() => {
            this.setState({
                drawerOpen: status,
            })
        })
    }

    handleLoginRequest(status) {
        let mode = status ? "login" : this.state.dialogMode
        return (() => {
            this.setState({
                dialogOpen: status,
                dialogMode: mode,
            })
        })
    }

    handleChangeDialogMode(which) {
        return (() => {
            this.setState({
                dialogMode: which,
            })
        })
    }

    handleLogoutRequest(state) {
        let newState = {
            loggedIn: false,
            userType: "visitor",
            userEmail: "user@example.com",
        }
        state.updateContext(newState)
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                {/**/}
                <LoginDialog
                    open={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    switchToLogin={this.handleChangeDialogMode("login")}
                    switchToSignup={this.handleChangeDialogMode("signup")}
                    onClose={this.handleLoginRequest(false)} />
                {/**/}
                <Drawer open={this.state.drawerOpen} onClose={this.handleToggleDrawer(false)}>
                    <div tabIndex={0} role="button"
                        onClick={this.handleToggleDrawer(false)}
                        onKeyDown={this.handleToggleDrawer(false)}>
                        <ActionList userType={this.props.userType} />
                    </div>
                </Drawer>
                {/**/}
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
                            onClick={this.handleToggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.flex} align="center" variant="title" color="inherit">
                            Pet Shop App
                        </Typography>
                        {!this.props.loggedIn &&
                            <Button color="inherit" onClick={this.handleLoginRequest(true)}>Login</Button>}
                        {this.props.loggedIn &&
                            <UserContext.Consumer>
                                {HOState => (
                                    <Button color="inherit" onClick={() => this.handleLogoutRequest(HOState)}>Logout</Button>
                                )}
                            </UserContext.Consumer>}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(ActionBar)