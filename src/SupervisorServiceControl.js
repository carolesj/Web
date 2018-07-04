import { Avatar, Checkbox, FormControlLabel, withStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import FileUpload from "@material-ui/icons/FileUpload"
import classNames from "classnames"
import { PropTypes } from "prop-types"
import React from "react"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"


const styles = theme => ({
    // visuals
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },

    // inputs
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



class SupervisorShopControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Error reporting
            errorStatus: false,
            errorMessage: "",

            // Dialog state
            serviceNameValue: "",
            serviceDescriptionValue: "",
            checkedServiceAvailable: true,

            // Service image state
            willUploadImage: false,
            didUploadImage: false,
            imageAsURL: null,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleChangeFieldValue(prop) {
        if (prop === "ImagePathValue") {
            return this.handleChangeImagePath
        } else if (prop === "checkedServiceAvailable") {
            return event => { this.setState({ [prop]: event.target.checked, }) }
        } else {
            return event => { this.setState({ [prop]: event.target.value, }) }
        }
    }

    handleChangeImagePath(event) {
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
                imageAsURL: event.target.result,
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
            serviceNameValue: "",
            serviceDescriptionValue: "",
            checkedServiceAvailable: true,
            willUploadImage: false,
            didUploadImage: false,
            imageAsURL: null,
        })
        this.props.onLaunchDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS

        TODO These handlers need better names
        TODO Check handlers on other files as well
     */
    handleAddService() {
        // Text
        let stageServiceName = this.state.serviceNameValue
        let stageServiceAvailable = this.state.checkedServiceAvailable
        let stageServiceDescription = this.state.serviceDescriptionValue

        // Blob
        let stageServiceMedia = this.state.didUploadImage ? this.state.imageAsURL : "./media/sampleDog.png"
        let stageLocalMedia = !this.state.didUploadImage


        // CHECK EVERYTHING
        if (stageServiceName === "") {
            this.setState({
                errorStatus: true,
                errorMessage: "Nome do serviço inválido!"
            })
            return
        }

        // DISPATCH ACTION
        this.props.onConfirmAddService({
            name: stageServiceName,
            available: stageServiceAvailable,
            description: stageServiceDescription,
            media: stageServiceMedia,
            localMedia: stageLocalMedia,
        })
        // Close dialog on success
        this.handleCloseDialog()
    }

    handleEditService(currentData) {
        // Text
        let stageServiceName = this.state.serviceNameValue
        let stageServiceAvailable = this.state.checkedServiceAvailable
        let stageServiceDescription = this.state.serviceDescriptionValue

        // Blob
        let stageServiceMedia = this.state.didUploadImage ? this.state.imageAsURL : currentData.media
        let stageLocalMedia = this.state.didUploadImage ? false : currentData.localMedia


        // CHECK EVERYTHING
        if (stageServiceName === "") {
            this.setState({
                errorStatus: true,
                errorMessage: "Nome do serviço inválido!"
            })
            return
        }

        // DISPATCH ACTION
        this.props.onConfirmEditService({
            id: currentData.id,
            name: stageServiceName,
            available: stageServiceAvailable,
            description: stageServiceDescription,
            media: stageServiceMedia,
            localMedia: stageLocalMedia,
        })
        // Close dialog on success
        this.handleCloseDialog()
    }

    handleRemoveService() {
        // DISPATCH ACTION
        this.props.onConfirmRemoveService({
            id: this.props.selectedId,
        })
        // Close dialog on success
        this.handleCloseDialog()
    }

    /*
        RENDER FUNCTION
     */
    render() {
        let dialogTitle = ""
        let dialogContent = <React.Fragment></React.Fragment>
        let dialogActions = <React.Fragment></React.Fragment>

        // Query item data
        let serviceData = this.props.siteData.services.find(service => (service.id === this.props.selectedId))
        if (typeof(serviceData) === "undefined" && this.props.dialogMode !== "add")
            return null

        // Dialog UI for adding or editing a pet
        if (this.props.dialogMode !== "remove") {
            dialogTitle = (this.props.dialogMode === "add") ? "Cadastrar Novo Produto" : "Editar Dados do Produto"

            dialogContent = (
                <div>
                    <form className={this.props.classes.container} noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            required={(this.props.dialogMode === "add")}
                            fullWidth
                            id="name"
                            label="Nome do serviço"
                            placeholder={(this.props.dialogMode === "edit") ? serviceData.name : undefined}
                            className={this.props.classes.textField}
                            value={this.state.serviceNameValue}
                            onChange={this.handleChangeFieldValue("serviceNameValue")}
                            margin="normal"
                        />
                        <TextField
                            required={(this.props.dialogMode === "add")}
                            fullWidth
                            multiline
                            rowsMax="4"
                            id="description"
                            label="Descrição do serviço"
                            placeholder={(this.props.dialogMode === "edit") ? serviceData.description : undefined}
                            className={this.props.classes.textField}
                            value={this.state.serviceDescriptionValue}
                            onChange={this.handleChangeFieldValue("serviceDescriptionValue")}
                            margin="normal"
                        />
                    </form>
                    <br />
                    <FormControlLabel
                        control={<Checkbox checked={this.state.checkedServiceAvailable}
                            onChange={this.handleChangeFieldValue("checkedServiceAvailable")}
                            color="secondary" />}
                        label="Serviço disponível"
                    />
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            {this.state.didUploadImage ?
                                <Avatar
                                    alt="Nova imagem"
                                    src={this.state.imageAsURL}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                                : (this.props.dialogMode === "edit") &&
                                <Avatar
                                    alt="Imagem atual"
                                    src={serviceData.localMedia ? require(`${serviceData.media}`) : serviceData.media}
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
                                onChange={event => this.handleChangeImagePath(event)}
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
                    <Button onClick={() => this.handleCloseDialog()} color="secondary">
                        Cancelar
                    </Button>
                    <Button 
                        color="primary"
                        disabled={this.state.willUploadImage}
                        onClick={this.props.dialogMode === "add" ?
                            () => this.handleAddService()
                            :
                            () => this.handleEditService(serviceData)
                        }
                    >
                        Confirmar
                    </Button>
                </div>
            )

        // Dialog UI for removing an existing pet
        } else {
            dialogTitle = "Remover Registro do Serviço"

            dialogContent = (
                <DialogContentText align="center">
                    {"Tem certeza que deseja cancelar realização do serviço " + serviceData.name + "?"}
                    <br />
                    {"Ele será permanentemente excluído de nossos registros."}
                </DialogContentText>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                            Cancelar
                    </Button>
                    <Button onClick={() => this.handleRemoveService()} color="secondary">
                            Confirmar
                    </Button>
                </div>
            )

        } 


        return (
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                ariaLabel="supervisor-service-control-dialog"
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                errorStatus={this.state.errorStatus}
                errorText={this.state.errorMessage}
            />
        )
    }
}

SupervisorShopControl.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // inherited state (SUPPLY THESE)
    siteData: PropTypes.object.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired,
    selectedId: PropTypes.number.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,

    // inherited actions (SUPPLY THESE)
    onConfirmAddService: PropTypes.func.isRequired,
    onConfirmEditService: PropTypes.func.isRequired,
    onConfirmRemoveService: PropTypes.func.isRequired,
}

export default withStyles(styles)(SupervisorShopControl)