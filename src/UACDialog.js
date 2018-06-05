import { Checkbox, FormControlLabel } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { logUserOut, signUserIn, signUserUp } from "./StoreActions"


class UACDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errorText: "",
            errorStatus: false,
            userNameFieldValue: "",
            userEmailFieldValue: "",
            userPasswordFieldValue: "",
            userPasswordConfFieldValue: "",
            userWantsAdminChecked: false,
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

        This component is too big and too tightly bound together to change now.
        It will serve as not only presenter but also as a container component,
        connected with the redux store. A way to change this is turn the
        current state into props and delegate all business logic
        to sateToProps and dispatchToProps mappers.
     */
    handleSigninRequest() {
        let stageEmail = this.state.userEmailFieldValue
        let stagePassword = this.state.userPasswordFieldValue

        // """authenticate"""
        let authorization = "visitor"
        for (const user of this.props.UACData) {
            if (user.email === stageEmail && user.password === stagePassword) {
                authorization = user.rights
            }
        }

        if (authorization !== "visitor") {
            // Dispatch user sign in action
            this.props.onSigninClick({
                nextView: "home",
                userEmail: stageEmail,
                userRights: authorization,
            })

            // Close dialog on success
            this.handleCloseDialog()
        } else {
            this.setState({
                errorStatus: true,
                errorText: "Endereço de e-mail não cadastrado"
            })
        }
    }

    handleSignupRequest() {
        let stageName = this.state.userNameFieldValue
        let stageEmail = this.state.userEmailFieldValue
        let stagePassword = this.state.userPasswordFieldValue
        let stagePasswordConf = this.state.userPasswordConfFieldValue
        let validateEmail = (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/).test(stageEmail)

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
        } else if (validateEmail === false) {
            this.setState({
                errorStatus: true,
                errorText: "Por favor forneça um e-mail válido"
            })
        } else {
            // Dispatch user sign up action
            this.props.onSignupClick({
                nextView: "home",
                userName: stageName,
                userEmail: stageEmail,
                userRights: "customer",
                userPassword: stagePassword,
            })

            // Pass control and log in
            this.handleCloseDialog()
        }
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
                    {/*
                    <DialogContentText align="center">
                        <Button color="secondary" onClick={() => this.handleSwitchToSignup()}>
                            Fazer cadastro
                        </Button>
                    </DialogContentText>
                    */}
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
                <Button onClick={() => this.handleSigninRequest()} color="primary">
                    Submeter
                </Button>
            )

        } else if (wantsSignup) {
            dialogTitle = "Cadastro"

            dialogContent = (
                <DialogContent>
                    {/*
                    <DialogContentText align="center">
                        <Button color="secondary" onClick={() => this.handleSwitchToSignin()}>
                            Voltar para login
                        </Button>
                    </DialogContentText>
                    */}
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
                <Button onClick={() => this.handleSignupRequest()} color="primary">
                    Submeter
                </Button>
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
                <Button onClick={() => this.handleLogoutRequest()} color="primary">
                    Sair
                </Button>
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
        )
    }
}

UACDialog.propTypes = {
    // From parent
    open: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    toggleDialog: PropTypes.func.isRequired,

    // From store state
    userLoggedIn: PropTypes.bool.isRequired,
    userRights: PropTypes.string.isRequired,
    UACData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            password: PropTypes.string.isRequired,
            rights: PropTypes.string.isRequired
        })
    ).isRequired,

    // From store actions
    onSigninClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        userLoggedIn: state.currentUserLoggedIn,
        userRights: state.currentUserRights,
        UACData: state.UACData,
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