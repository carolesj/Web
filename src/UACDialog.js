import { Checkbox, FormControlLabel } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"
import { logUserOut, signUserIn, signUserUp } from "./StoreActions"
import Root from "./remote"

class UACDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // error
            errorText: "",
            errorStatus: false,

            // form
            userNameFieldValue: "",
            userEmailFieldValue: "",
            userPasswordFieldValue: "",
            userPasswordConfFieldValue: "",
            userWantsAdminChecked: false,

            // remote
            doingRemoteRequest: false,
        }
    }


    /*
        CONTROLLED COMPONENT HANDLERS
     */
    handleNameTextFieldChange(event) {
        this.setState({
            userNameFieldValue: event.target.value,
        })
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
        this.props.toggleDialog(this.props.dialogOpen, "signin")
    }

    handleSwitchToSignup() {
        this.setState({
            errorStatus: false,
        })
        // Just change mode to "signup"
        this.props.toggleDialog(this.props.dialogOpen, "signup")
    }

    handleCloseDialog() {
        this.setState({
            errorText: "",
            errorStatus: false,
            userEmailFieldValue: "",
            userPasswordFieldValue: "",
            userPasswordConfFieldValue: "",
            userWantsAdminChecked: false,
            doingRemoteRequest: false,
        })
        // Just set the "dialogOpen" state to false
        this.props.toggleDialog(false, this.props.dialogMode)
    }

    /*
        UAC BUSINESS LOGIC

        This component is too big and too tightly bound together to change now.
        It will serve as not only presenter but also as a container component,
        connected with the redux store. A way to change this is turn the
        current state into props and delegate all business logic
        to sateToProps and dispatchToProps mappers.
     */
    handleSigninRequest() {
        // Remotely request access
        this.setState({
            doingRemoteRequest: true,
        })
        const requestData = {
            user: this.state.userEmailFieldValue,
            pass: this.state.userPasswordFieldValue
        }
        const requestConfig = {
            // responseType is already application/json
            headers: {
                "Content-Type": "application/json"
            }
        }

        Axios.post(Root + "/UAC", requestData, requestConfig)
            .then(response => {  // Request succeeded
                // User was logged in
                if (response.data.ok) {
                    this.props.onSigninClick({
                        nextView: "home",
                        userName: response.data.name,
                        userEmail: response.data.email,
                        userRights: response.data.rights,
                    })
                    this.handleCloseDialog()

                    // User was rejected
                } else {
                    this.setState({
                        errorText: response.data.error,
                        errorStatus: true,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => { // Request failed
                this.setState({
                    errorText: error.message,
                    errorStatus: true,
                    doingRemoteRequest: false,
                })
            })
    }

    handleSignupRequest() {
        let stageName = this.state.userNameFieldValue
        let stageEmail = this.state.userEmailFieldValue
        let stagePassword = this.state.userPasswordFieldValue
        let stagePasswordConf = this.state.userPasswordConfFieldValue
        let validateEmail = (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/).test(stageEmail)

        // Do client-side checks
        if (stagePassword.length < 4) {
            this.setState({
                errorStatus: true,
                errorText: "A senha deve ter no minimo 4 caracteres"
            })
            return
        }
        if (stagePassword !== stagePasswordConf) {
            this.setState({
                errorStatus: true,
                errorText: "A senha de confirmação difere da original"
            })
            return
        }
        if (validateEmail === false) {
            this.setState({
                errorStatus: true,
                errorText: "Por favor forneça um e-mail válido"
            })
            return
        }

        // Remotely request signup
        this.setState({
            doingRemoteRequest: true,
        })
        const requestData = {
            name: stageName,
            user: stageEmail,
            pass: stagePassword
        }
        const requestConfig = {
            // responseType is already application/json
            headers: {
                "Content-Type": "application/json",
            }
        }

        Axios.put(Root + "/UAC", requestData, requestConfig)
            .then(response => {
                if (response.data.ok) {
                    // Request succeeded
                    this.props.onSignupClick({
                        nextView: "home",
                        userName: response.data.name,
                        userEmail: response.data.email,
                        userRights: response.data.rights,
                    })
                    this.handleCloseDialog()
                } else {
                    this.setState({
                        errorText: response.data.error,
                        errorStatus: true,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorText: error.message,
                    errorStatus: true,
                    doingRemoteRequest: false,
                })
            })
    }

    handleLogoutRequest() {
        // Dispatch user log out action
        this.props.onLogoutClick({
            nextView: "home",
            userEmail: "none",
            userRights: "visitor",
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    render() {
        let wantsSignin = (this.props.dialogMode === "signin")
        let wantsSignup = (this.props.dialogMode === "signup")
        let wantsLogout = (this.props.dialogMode === "logout")
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
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button disabled={this.state.doingRemoteRequest}
                        onClick={() => this.handleSigninRequest()} color="primary"
                    >
                    Submeter
                    </Button>
                </div>
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
                        id="userName"
                        label="Nome completo"
                        type="text"
                        value={this.state.userNameFieldValue}
                        onChange={e => this.handleNameTextFieldChange(e)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="userEmail"
                        label="Endereço de email"
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
                    {(this.props.userRights === "admin") && <div>
                        <br />
                        <FormControlLabel
                            control={<Checkbox checked={wantsAdmin}
                                onChange={() => this.handleToggleUserWantsAdmin()}
                                color="secondary" />}
                            label="Administrador" />
                    </div>}
                </DialogContent>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button disabled={this.state.doingRemoteRequest}
                        onClick={() => this.handleSignupRequest()} color="primary"
                    >
                        Submeter
                    </Button>
                </div>
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
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.handleLogoutRequest()} color="primary">
                        Sair
                    </Button>
                </div>
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
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                isLoading={this.state.doingRemoteRequest}
                ariaLabel="user-account-control-dialog"
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                errorStatus={this.state.errorStatus}
                errorText={this.state.errorText}
            />
        )
    }
}

UACDialog.propTypes = {
    // From parent
    dialogOpen: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired,
    toggleDialog: PropTypes.func.isRequired,

    // From store state
    userLoggedIn: PropTypes.bool.isRequired,
    userRights: PropTypes.string.isRequired,

    // From store actions
    onSigninClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        userRights: state.currentUserRights,
        userLoggedIn: state.currentUserLoggedIn,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onSigninClick: userData => {
            dispatch(signUserIn(userData))
        },
        onSignupClick: userData => {
            dispatch(signUserUp(userData))
        },
        onLogoutClick: userData => {
            dispatch(logUserOut(userData))
        }
    }
}

// Connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(UACDialog)