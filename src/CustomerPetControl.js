import { Checkbox, FormControlLabel } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import classNames from "classnames"
import { PropTypes } from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import FileUpload from "@material-ui/icons/FileUpload"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"
import React from "react"
import Axios from "axios"
import Root from "./remote"

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


class CustomerPetControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // error reporting
            errorStatus: false,
            errorMessage: "",

            // state controllers
            petName: "",
            petRace: "",
            checkedPetRemoval: false,
            willUploadImage: false,
            didUploadImage: false,
            imageAsURL: null,

            // remote tracker
            doingRemoteRequest: false,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleChangeFieldValue(prop) {
        if (prop === "checkedPetRemoval") {
            return event => { this.setState({ [prop]: event.target.checked, }) }
        } else {
            return event => { this.setState({ [prop]: event.target.value, }) }
        }
    }

    handleAddPetImagePathChange(event) {
        let media = event.target.files[0]
        let reader = new FileReader()

        // Start uploading image
        this.setState({  // TODO Not sure if this locks state for changing...
            willUploadImage: true,
            didUploadImage: false,
            imageAsURL: null,
        })

        // When done uploading image
        reader.onload = event => {
            this.setState({  // TODO Not sure if this locks state for changing...
                willUploadImage: false,
                didUploadImage: true,
                imageAsURL: event.target.result
            })
        }
        // Begin op and trigger callback
        reader.readAsDataURL(media)
    }

    handleCloseDialog() {
        this.setState({
            // error
            errorStatus: false,
            errorMessage: "",

            // state
            petName: "",
            petRace: "",
            checkedPetRemoval: false,
            willUploadImage: false,
            didUploadImage: false,
            imageAsURL: null,

            // remote
            doingRemoteRequest: false,
        })
        this.props.onToggleDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS

        TODO These handlers need better names
        TODO Check handlers on other files as well
     */
    handleClickAddPet() {
        // Stage data
        const requestData = {
            name: this.state.petName,
            race: this.state.petRace,
            media: this.state.imageAsURL
        }
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        // Check validity
        if (!this.state.didUploadImage) {
            this.setState({
                errorStatus: true,
                errorMessage: "Escolha uma imagem para o pet :)"
            })
            return
        }
        if (requestData.name.length < 4) {
            this.setState({
                errorStatus: true,
                errorMessage: "Nome deve conter no mínimo 4 letras"
            })
            return
        }
        if (requestData.race.length < 4) {
            this.setState({
                errorStatus: true,
                errorMessage: "Raça deve conter no mínimo 4 letras"
            })
            return
        }

        // Perform request
        this.setState({
            doingRemoteRequest: true,
        })
        Axios.put(Root + "/" + this.props.currentUserEmail + "/pets", requestData, requestConfig)
            .then(response => {
                if (response.data.ok) {
                    // Request succeeded
                    this.props.onConfirmAddPet(this.props.currentUserEmail, requestData)
                    this.handleCloseDialog()
                } else {
                    this.setState({
                        errorStatus: true,
                        errorMessage: response.data.error,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorMessage: error.message,
                    doingRemoteRequest: false,
                })
            })
    }

    handleClickEditPet(currentData) {
        // Stage data
        const requestData = {
            id: currentData.id,
            name: this.state.petName,
            race: this.state.petRace,
            media: this.state.didUploadImage ? this.state.imageAsURL : currentData.media
        }
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        // Check validity
        if (requestData.name.length < 4) {
            this.setState({
                errorStatus: true,
                errorMessage: "Nome deve conter no mínimo 4 letras"
            })
            return
        }
        if (requestData.race.length < 4) {
            this.setState({
                errorStatus: true,
                errorMessage: "Raça deve conter no mínimo 4 letras"
            })
            return
        }

        // Perform request
        this.setState({
            doingRemoteRequest: true,
        })
        Axios.post(Root + "/" + this.props.currentUserEmail + "/pets", requestData, requestConfig)
            .then(response => {
                if (response.data.ok) {
                    // Request succeeded
                    this.props.onConfirmEditPet(this.props.currentUserEmail, requestData)
                    this.handleCloseDialog()
                } else {
                    this.setState({
                        errorStatus: true,
                        errorMessage: response.data.error,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorMessage: error.message,
                    doingRemoteRequest: false,
                })
            })
    }

    handleClickRemovePet() {
        // Stage data
        const requestId = this.props.selectedId

        // Perform request
        this.setState({
            doingRemoteRequest: true,
        })
        Axios.delete(Root + "/" + this.props.currentUserEmail + "/pets/" + String(requestId))
            .then(response => {
                if (response.data.ok) {
                    // Request succeeded
                    this.props.onConfirmRemovePet(this.props.currentUserEmail, { id: requestId, })
                    this.handleCloseDialog()
                } else {
                    this.setState({
                        errorStatus: true,
                        errorMessage: response.data.error,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorMessage: error.message,
                    doingRemoteRequest: false,
                })
            })
    }

    /*
        RENDER FUNCTION
     */
    render() {
        let dialogTitle = null
        let dialogContent = null
        let dialogActions = null

        // Query pet data
        let petData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
            .animals.find(animal => (animal.id === this.props.selectedId))

        // Actually fail only if action depends on existing pet data
        if (typeof(petData) === "undefined" && this.props.dialogMode !== "add")
            return null

        // Dialog UI for removing an existing pet
        if (this.props.dialogMode === "remove") {
            dialogTitle = "Remover Cadastro do Pet"

            dialogContent = (
                <div>
                    <DialogContentText align="center">
                        {"Tem certeza que deseja remover o pet " + petData.name + "?"}
                        <br />
                        {"Ele será permanentemente excluído de nossos registros."}
                    </DialogContentText>
                    <br />
                    <FormControlLabel
                        control={<Checkbox checked={this.state.checkedPetRemoval}
                            onChange={this.handleChangeFieldValue("checkedPetRemoval")}
                            color="secondary" />}
                        label="Tenho noção de que o pet será permanentemente removido dos registros"
                    />
                </div>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleClickRemovePet()} color="secondary"
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
            dialogTitle = (this.props.dialogMode === "add") ? "Cadastrar Novo Pet" : "Editar Dados do Pet"

            dialogContent = (
                <div>
                    <form className={this.props.classes.container} noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="name"
                            label="Nome"
                            placeholder={(this.props.dialogMode === "edit") ? petData.name : undefined}
                            className={this.props.classes.textField}
                            value={this.state.petName}
                            onChange={this.handleChangeFieldValue("petName")}
                            margin="normal"
                        />
                        <TextField
                            required
                            fullWidth
                            id="race"
                            label="Raça"
                            placeholder={(this.props.dialogMode === "edit") ? petData.race : undefined}
                            className={this.props.classes.textField}
                            value={this.state.petRace}
                            onChange={this.handleChangeFieldValue("petRace")}
                            margin="normal"
                        />
                    </form>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            {this.state.didUploadImage ?
                                <Avatar
                                    alt="Novo avatar"
                                    src={this.state.imageAsURL}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                                : (this.props.dialogMode === "edit") &&
                                <Avatar
                                    alt="Imagem atual"
                                    src={petData.localMedia ? require(`${petData.media}`) : petData.media}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                            }
                        </Grid>
                        <Grid item>
                            <input
                                accept="image/*"
                                className={this.props.classes.input}
                                id="image-file-upload"
                                multiple
                                type="file"
                                onChange={event => this.handleAddPetImagePathChange(event)}
                            />
                            <label htmlFor="image-file-upload">
                                <Button variant="raised" component="span" className={this.props.classes.button}
                                    disabled={this.state.willUploadImage}
                                >
                                    Escolher Imagem
                                    <FileUpload className={this.props.classes.rightIcon} />
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                </div>
            )

            dialogActions = (
                <div>
                    <Button 
                        color="primary"
                        disabled={this.state.willUploadImage || this.state.doingRemoteRequest}
                        onClick={this.props.dialogMode === "add" ?
                            () => this.handleClickAddPet()
                            :
                            () => this.handleClickEditPet(petData)
                        }
                    >
                        Confirmar
                    </Button>
                    <Button onClick={() => this.handleCloseDialog()} color="secondary">
                        Cancelar
                    </Button>
                </div>
            )
        }

        return (
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                isLoading={this.state.doingRemoteRequest}
                ariaLabel="pet-control-dialog"
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                errorStatus={this.state.errorStatus}
                errorText={this.state.errorMessage}
            />
        )
    }
}

CustomerPetControl.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // inherited state (SUPPLY THESE)
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired,
    selectedId: PropTypes.number.isRequired,

    // inherited actions (SUPPLY THESE)
    onToggleDialog: PropTypes.func.isRequired,
    onConfirmAddPet: PropTypes.func.isRequired,
    onConfirmEditPet: PropTypes.func.isRequired,
    onConfirmRemovePet: PropTypes.func.isRequired,
}

export default withStyles(styles)(CustomerPetControl)