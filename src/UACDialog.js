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
const users = [
    { username: "user", email: "user@example.com", password: "user", rights: "customer" },
    { username: "admin", email: "admin@example.com", password: "admin", rights: "admin" }
]

class UACDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            signinFailed: false,
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
            signinFailed: false,
        })
        // Just change mode to "signin"
        this.props.toggleDialog(this.props.open, "signin")
    }

    handleSwitchToSignup() {
        this.setState({
            signinFailed: false,
        })
        // Just change mode to "signup"
        this.props.toggleDialog(this.props.open, "signup")
    }

    handleCloseDialog() {
        this.setState({
            signinFailed: false,
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
                signinFailed: true,
            })
        }
    }

    handleSignupRequest(state) {
        // TODO Check if passwords match
        // TODO Check if user already exists
        // TODO If the above passes, add info to users
    }

    handleLogoutRequest(state) {
        // Update user context
        let newState = {
            loggedIn: false,
            userEmail: "user@example.com",
            userRights: "visitor",
        }
        state.updateUserContext(newState)

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

        return (
            <div>
                <Dialog open={this.props.open} aria-labelledby="form-dialog-title"
                    onClose={() => this.handleCloseDialog()}>

                    {/* Only the text changes */}
                    <DialogTitle id="form-dialog-title">
                        {dialogTitle}
                    </DialogTitle>

                    {dialogContent}

                    {/* Depends only on signinFailed */}
                    {this.state.signinFailed && <DialogContent>
                        <DialogContentText align="center" color="secondary">
                            LOGIN FAILED
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