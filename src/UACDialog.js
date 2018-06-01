import { Checkbox, FormControlLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import { UserContext } from './UserContext';

/*
    UAC LOGIC STATE

    This obivously should not be here.
    Ideally, this state would be kept in a database in a remote server.
 */
let users = [
    { email: "user@example.com", password: "user", rights: "customer" },
    { email: "admin@example.com", password: "admin", rights: "admin" }
]

const validateEmail = (email) => {
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    return pattern.test(email)
}

class UACDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errorText: "",
            errorStatus: false,
            userEmailFieldValue: "",
            userPasswordFieldValue: "",
            userPasswordConfFieldValue: "",
            userWantsAdminChecked: false,
        }
    }

    /*
        CONTROLLED COMPONENT HANDLERS
     */
    handleEmailTextFieldChange(event) {
        this.setState({
            userEmailFieldValue: event.target.value,
        })
    }

    handlePasswordTextFieldChange(event) {
        this.setState({
            userPasswordFieldValue: event.target.value,
        })
    }

    handlePasswordConfTextFieldChange(event) {
        this.setState({
            userPasswordConfFieldValue: event.target.value,
        })
    }

    handleToggleUserWantsAdmin() {
        this.setState(state => ({
            userWantsAdminChecked: !state.userWantsAdminChecked
        }))
    }

    /*
        UAC DIALOG STATE WRAPPERS
     */
    handleSwitchToSignin() {
        this.setState({
            errorStatus: false,
        })
        // Just change mode to "signin"
        this.props.toggleDialog(this.props.open, "signin")
    }

    handleSwitchToSignup() {
        this.setState({
            errorStatus: false,
        })
        // Just change mode to "signup"
        this.props.toggleDialog(this.props.open, "signup")
    }

    handleCloseDialog() {
        this.setState({
            errorStatus: false,
            userEmailFieldValue: "",
            userPasswordFieldValue: "",
            userPasswordConfFieldValue: "",
            userWantsAdminChecked: false,
        })
        // Just set the "dialogOpen" state to false
        this.props.toggleDialog(false, this.props.mode)
    }

    /*
        UAC BUSINESS LOGIC

        This is here for mock purposes only.
        Ideally this business logic should be run on the server.
     */
    handleSigninRequest(state) {
        let stageEmail = this.state.userEmailFieldValue
        let stagePassword = this.state.userPasswordFieldValue

        // """authenticate"""
        let authorization = "visitor"
        for (const user of users) {
            if (user.email === stageEmail && user.password === stagePassword) {
                authorization = user.rights
            }
        }

        if (authorization !== "visitor") {
            // Update user context
            let newState = {
                loggedIn: true,
                userEmail: stageEmail,
                userRights: authorization,
            }
            state.updateUserContext(newState)

            // Close dialog on success
            this.handleCloseDialog()
        } else {
            this.setState({
                errorStatus: true,
                errorText: "Endereço de e-mail não cadastrado"
            })
        }
    }

    handleSignupRequest(state) {
        // TODO Check if passwords match
        // TODO Check if user already exists
        // TODO If the above passes, add info to users

        let stageEmail = this.state.userEmailFieldValue
        let stagePassword = this.state.userPasswordFieldValue
        let stagePasswordConf = this.state.userPasswordConfFieldValue

        if (stagePassword.length < 6) {
            this.setState({
                errorStatus: true,
                errorText: "A senha deve ter no minimo 6 caracteres!"
            })
        } else if (stagePassword !== stagePasswordConf) {
            this.setState({
                errorStatus: true,
                errorText: "A senha de confirmação difere da original"
            })
        } else if (validateEmail(stageEmail) === false) {
            this.setState({
                errorStatus: true,
                errorText: "Por favor forneça um e-mail válido"
            })
        } else {
            // If both above pass, add new user
            let stageRights = this.state.userWantsAdminChecked ? "admin" : "customer"
            let newUser = {
                email: stageEmail,
                password: stagePassword,
                rights: stageRights,
            }
            users = users.concat(newUser)

            // Pass control and log user in
            this.handleSigninRequest(state)
        }
    }

    handleLogoutRequest(state) {
        // Update user context
        let newState = {
            loggedIn: false,
            userEmail: "user@example.com",
            userRights: "visitor",
        }
        state.updateUserContext(newState)
        state.updateViewContext({currentView: "home"}) // DON'T FORGET TO RESET THE VIEW

        // Close dialog on success
        this.handleCloseDialog()
    }

    render() {
        let wantsSignin = (this.props.mode === "signin")
        let wantsSignup = (this.props.mode === "signup")
        let wantsLogout = (this.props.mode === "logout")
        let wantsAdmin = this.state.userWantsAdminChecked ? true : false

        let dialogTitle = null
        let dialogContent = null
        let dialogActions = null

        if (wantsSignin) {
            dialogTitle = "Acesso"

            dialogContent = (
                <DialogContent>
                    <DialogContentText align="center">
                        <Button color="secondary" onClick={() => this.handleSwitchToSignup()}>
                            Fazer cadastro
                        </Button>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="userEmail"
                        label="Endereço de e-mail"
                        type="email"
                        value={this.state.userEmailFieldValue}
                        onChange={e => this.handleEmailTextFieldChange(e)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="userPassword"
                        label="Senha"
                        type="password"
                        value={this.state.userPasswordFieldValue}
                        onChange={e => this.handlePasswordTextFieldChange(e)}
                        fullWidth
                    />
                </DialogContent>
            )

            dialogActions = (
                <UserContext.Consumer>
                    {state => (
                        <Button onClick={() => this.handleSigninRequest(state)} color="primary">
                            Submeter
                        </Button>
                    )}
                </UserContext.Consumer>
            )

        } else if (wantsSignup) {
            dialogTitle = "Cadastro"

            dialogContent = (
                <DialogContent>
                    <DialogContentText align="center">
                        <Button color="secondary" onClick={() => this.handleSwitchToSignin()}>
                            Voltar para login
                        </Button>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="userEmail"
                        label="Endereço de e-mail"
                        type="email"
                        value={this.state.userEmailFieldValue}
                        onChange={e => this.handleEmailTextFieldChange(e)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="userPassword"
                        label="Senha"
                        type="password"
                        value={this.state.userPasswordFieldValue}
                        onChange={e => this.handlePasswordTextFieldChange(e)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="userPasswordConfirm"
                        label="Confirme a senha"
                        type="password"
                        value={this.state.userPasswordConfFieldValue}
                        onChange={e => this.handlePasswordConfTextFieldChange(e)}
                        fullWidth
                    />
                    <div>
                        <br />
                        <FormControlLabel
                            control={<Checkbox checked={wantsAdmin}
                                onChange={() => this.handleToggleUserWantsAdmin()}
                                color="secondary" />}
                            label="Administrador" />
                    </div>
                </DialogContent>
            )

            dialogActions = (
                <UserContext.Consumer>
                    {state => (
                        <Button onClick={() => this.handleSignupRequest(state)} color="primary">
                            Submeter
                        </Button>
                    )}
                </UserContext.Consumer>
            )

        } else if (wantsLogout) {
            dialogTitle = "Sair"

            dialogContent = (
                <DialogContent>
                    <DialogContentText align="center">
                        Tem certeza que deseja sair?
                    </DialogContentText>
                </DialogContent>
            )

            dialogActions = (

                <UserContext.Consumer>
                    {state => (
                        <Button onClick={() => this.handleLogoutRequest(state)} color="primary">
                            Sair
                        </Button>
                    )}
                </UserContext.Consumer>
            )
        }

        /*
            TODO: ORGANIZING DATA FOR THE RENDER METHOD

            I still haven't found the best way to set up conditional rendering.
            What I'm thinkg is: if rendering the element depends only on a boolean
            condition, then use something like a short-circuiting operator (&&),
            a ternary condition or an IIFE. Then, if the logic is a little bit
            more involved, define the items conditionally on the body of the
            "render" function, and plug them in the return statement.

            If the conditional logic is too elaborate or if the components to be
            returned differ too much or are separate things entirely, we should
            consider using Higher Order Components. (A little trickier, the
            only use of it we have so far is material-ui's "withStyles".)

            About the options available:
            https://blog.logrocket.com/conditional-rendering-in-react-c6b0e5af381e

            About using special props for conditions:
            https://github.com/facebook/jsx/issues/65#issuecomment-255484351

            An introduction to use of higher order components:
            https://www.robinwieruch.de/gentle-introduction-higher-order-components/

            About performance regarding conditional rendering in react:
            https://medium.com/@cowi4030/optimizing-conditional-rendering-in-react-3fee6b197a20
         */
        return (
            <div>
                <Dialog open={this.props.open} aria-labelledby="form-dialog-title"
                    onClose={() => this.handleCloseDialog()}>

                    {/* Only the text changes */}
                    <DialogTitle id="form-dialog-title">
                        {dialogTitle}
                    </DialogTitle>

                    {dialogContent}

                    {/* Depends only on errorStatus */}
                    {this.state.errorStatus && <DialogContent>
                        <DialogContentText align="center" color="secondary">
                            {this.state.errorText}
                        </DialogContentText>
                    </DialogContent>}

                    {/* Only main action changes */}
                    <DialogActions>
                        <Button onClick={() => this.handleCloseDialog()} color="primary">
                            Cancelar
                        </Button>
                        {dialogActions}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

// Do typechecking
UACDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    toggleDialog: PropTypes.func.isRequired,
}

export default UACDialog