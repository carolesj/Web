import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';

import {UserContext} from './UserContext'

const users = [
    {username:"user", email:"user@example.com", password:"user", type:"customer"},
    {username:"admin", email:"admin@example.com", password:"admin", type:"admin"}
]

class LoginDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loginFailed: false,
            userEmailFieldValue: "",
            userPasswordFieldValue: "",
            userPasswordConfFieldValue: "",
            userTypeOptionChecked: false,
        }
    }

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

    handleToggleLoginType() {
        this.setState({
            userTypeOptionChecked: !this.state.userTypeOptionChecked
        })
    }

    handleSingupRequest(state) {
        // TODO something happens here
    }

    handleLoginRequest(state) {
        let stageUserEmail = this.state.userEmailFieldValue
        let stageUserPassword = this.state.userPasswordFieldValue

        // """authenticate"""
        let auth = "visitor"
        for (const user of users) {
            if (user.email === stageUserEmail && user.password === stageUserPassword) {
                auth = user.type
            }
        }

        if (auth !== "visitor") {
            // Update user state
            let newState = {
                loggedIn: true,
                userType: auth,
                userEmail: stageUserEmail,
            }
            state.updateContext(newState)

            // Update login state
            this.setState({
                loginFailed: false,
            })

            // Close dialog on success
            this.props.onClose()
        } else {
            this.setState({
                loginFailed: true,
            })
        }
    }

    render() {

        let wantsSignup = (this.props.dialogMode === "signup") ? true : false
        let wantsAdmin = this.userTypeOptionChecked ? true : false

        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                    {!wantsSignup && <DialogTitle id="form-dialog-title">Login</DialogTitle>}
                    {wantsSignup && <DialogTitle id="form-dialog-title">Cadastro</DialogTitle>}
                    <DialogContent>
                        <DialogContentText align="center">
                            {!wantsSignup && <Button color="secondary"
                                onClick={this.props.switchToSignup}>Fazer cadastro</Button>}
                            {wantsSignup && <Button color="secondary"
                                onClick={this.props.switchToLogin}>Voltar para login</Button>}
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
                        {wantsSignup && <TextField
                            margin="dense"
                            id="userPasswordConfirm"
                            label="Confirme a senha"
                            type="password"
                            value={this.state.userPasswordConfFieldValue}
                            onChange={e => this.handlePasswordConfTextFieldChange(e)}
                            fullWidth
                        />}
                        {wantsSignup && <div>
                            <br />
                            <FormControlLabel
                                control={<Checkbox checked={wantsAdmin}
                                    onChange={() => this.handleToggleLoginType()}
                                    color="secondary" />}
                                label="Administrador" />
                        </div>}
                    </DialogContent>
                    {this.state.loginFailed && <DialogContentText align="center">
                            CUSTOMIZE THIS MESSAGE
                    </DialogContentText>}
                    <DialogActions>
                        <Button onClick={this.props.onClose} color="primary">
                            Cancelar
                        </Button>
                        <UserContext.Consumer>
                            {HOState => (
                            <Button onClick={() => this.handleLoginRequest(HOState)} color="primary">
                                Submeter
                            </Button>
                            )}
                        </UserContext.Consumer>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default LoginDialog