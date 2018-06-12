import { Checkbox, FormControlLabel } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import TextField from "@material-ui/core/TextField"
import { withStyles } from "@material-ui/core/styles"
import { PropTypes } from "prop-types"
import React from "react"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"

const styles = theme => ({
    // visuals
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },

    // inputs
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    input: {
        display: "none",
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        //width: 200,
    },

    // images
    avatar: {
        margin: 10,
    },
    bigAvatar: { // Customize AVATAR SIZE through this class
        width: 150,
        height: 150,
    },
})


class SupervisorUserControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // error reporting
            errorStatus: false,
            errorMessage: "",

            // state controllers
            userName: "",
            userEmail: "",
            userPassword: "",
            userPasswordConfirm: "",
            userWantsAdminRights: false,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleChangeFieldValue(prop) {
        if (prop === "userWantsAdminRights") {
            return event => { this.setState({ [prop]: event.target.checked }) }
        } else {
            return event => { this.setState({ [prop]: event.target.value }) }
        }
    }

    handleCloseDialog() {
        this.setState({
            // error
            errorStatus: false,
            errorMessage: "",

            // state
            userName: "",
            userEmail: "",
            userPassword: "",
            userPasswordConfirm: "",
            userWantsAdminRights: false,
        })
        this.props.onLaunchDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS

        TODO These handlers need better names
        TODO Check handlers on other files as well
     */
    handleAddUser() {
        let stageName = this.state.userName
        let stageEmail = this.state.userEmail
        let stagePassword = this.state.userPassword
        let stagePasswordConf = this.state.userPasswordConfirm

        if (stagePassword.length < 6) {
            this.setState({
                errorStatus: true,
                errorMessage: "A senha deve ter no minimo 6 caracteres"
            })
            return
        }

        if (stagePassword !== stagePasswordConf) {
            this.setState({
                errorStatus: true,
                errorMessage: "A senha de confirmação difere da original"
            })
            return
        }

        let validateEmail = (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/).test(stageEmail)
        if (validateEmail === false) {
            this.setState({
                errorStatus: true,
                errorMessage: "Por favor forneça um e-mail válido"
            })
            return
        }

        let existingEmail = this.props.UACData.find(user => (user.email === stageEmail))
        if (typeof (existingEmail) !== "undefined") {
            this.setState({
                errorStatus: true,
                errorMessage: "Usuário com o mesmo e-mail já cadastrado"
            })
            return
        }

        // Dispatch add user action
        this.props.onConfirmAddUser({
            name: stageName,
            email: stageEmail,
            rights: this.state.userWantsAdminRights ? "supervisor" : "customer",
            password: stagePassword,
        })
        // Close dialog on success
        this.handleCloseDialog()
    }

    handleEditUser(currentEmail) {
        let stageName = this.state.userName
        let stageEmail = this.state.userEmail

        let validateEmail = (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/).test(stageEmail)
        if (validateEmail === false) {
            this.setState({
                errorStatus: true,
                errorMessage: "Por favor forneça um e-mail válido"
            })
            return
        }
        // No need to check for existing e-mail

        // Dispatch edit user action
        this.props.onConfirmEditUser({
            name: stageName,
            email: stageEmail,
            rights: this.state.userWantsAdminRights ? "supervisor" : "customer",
            emailToBeReplaced: currentEmail,
        })
        // Close dialog on success
        this.handleCloseDialog()
    }

    handleRemoveUser() {
        this.props.onConfirmRemoveUser({
            email: this.props.selectedEmail,
        })
        // Close dialog on success
        this.handleCloseDialog()
    }

    /*
        RENDER FUNCTION
     */
    render() {
        let dialogTitle = null
        let dialogContent = null
        let dialogActions = null

        // Query user data
        let userAC = this.props.UACData.find(user => (user.email === this.props.selectedEmail))
        if (typeof (userAC) === "undefined" && this.props.dialogMode !== "add")
            return null

        let userData = this.props.customerData.find(customer => (customer.email === this.props.selectedEmail))
        if (typeof (userData) === "undefined" && this.props.dialogMode !== "add")
            return null

        // Dialog UI for removing an existing pet
        if (this.props.dialogMode === "remove") {
            dialogTitle = "Remover Cadastro do Pet"

            dialogContent = (
                <DialogContentText align="center">
                    {"Tem certeza que deseja remover o usuário " + userData.name + "?"}
                    <br />
                    {"Ele será permanentemente excluído de nossos registros."}
                </DialogContentText>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleRemoveUser()} color="secondary"
                        disabled={!this.state.checkedPetRemoval}
                    >
                        Confirmar
                    </Button>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                </div>
            )


            // Dialog UI for adding a new pet or editing an existing one
        } else {
            dialogTitle = (this.props.dialogMode === "add") ? "Cadastrar Novo Usuário" : "Editar Dados do Usuário"

            dialogContent = (
                <div>
                    <form className={this.props.classes.container} noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="name"
                            label="Nome completo"
                            placeholder={(this.props.dialogMode === "edit") ? userData.name : undefined}
                            className={this.props.classes.textField}
                            value={this.state.userName}
                            onChange={this.handleChangeFieldValue("userName")}
                            margin="normal"
                        />
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Endereço de e-mail"
                            placeholder={(this.props.dialogMode === "edit") ? userData.email : undefined}
                            className={this.props.classes.textField}
                            value={this.state.userEmail}
                            onChange={this.handleChangeFieldValue("userEmail")}
                            margin="normal"
                        />
                        {(this.props.dialogMode === "add") &&
                            <div>
                                <TextField
                                    required
                                    fullWidth
                                    id="password"
                                    label="Senha"
                                    type="password"
                                    className={this.props.classes.textField}
                                    value={this.state.userPassword}
                                    onChange={this.handleChangeFieldValue("userPassword")}
                                    margin="normal"
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="passwordConfirm"
                                    label="Confirme a senha"
                                    type="password"
                                    className={this.props.classes.textField}
                                    value={this.state.userPasswordConfirm}
                                    onChange={this.handleChangeFieldValue("userPasswordConfirm")}
                                    margin="normal"
                                />
                            </div>
                        }
                        <br />
                        <FormControlLabel
                            control={<Checkbox checked={this.state.userWantsAdminRights}
                                onChange={this.handleChangeFieldValue("userWantsAdminRights")}
                                color="secondary" />}
                            label="Usuário é administrador"
                        />
                    </form>
                </div>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="secondary">
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        disabled={this.state.willUploadImage}
                        onClick={this.props.dialogMode === "add" ?
                            () => this.handleAddUser()
                            :
                            () => this.handleEditUser(this.props.selectedEmail)
                        }
                    >
                        Confirmar
                    </Button>
                </div>
            )
        }

        return (
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                ariaLabel="user-control-dialog"
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                errorStatus={this.state.errorStatus}
                errorText={this.state.errorMessage}
            />
        )
    }
}

SupervisorUserControl.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // inherited state (SUPPLY THESE)
    UACData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            rights: PropTypes.string.isRequired,
            password: PropTypes.string.isRequired
        })
    ).isRequired,
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired,
    selectedEmail: PropTypes.string.isRequired,

    // inherited actions (SUPPLY THESE)
    onLaunchDialog: PropTypes.func.isRequired,
    onConfirmAddUser: PropTypes.func.isRequired,
    onConfirmEditUser: PropTypes.func.isRequired,
    onConfirmRemoveUser: PropTypes.func.isRequired,
}

export default withStyles(styles)(SupervisorUserControl)