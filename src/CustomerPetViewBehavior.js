import { Checkbox, FormControlLabel } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import { withStyles } from "@material-ui/core/styles"
import FileUpload from "@material-ui/icons/FileUpload"
import classNames from "classnames"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { PetShopPetList } from "./PetShopCardViews"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"
import { addPet, editPet, removePet } from "./StoreActions"


const styles = theme => ({
    // Pet control
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: "none",
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        //width: 200,
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: { // Customize AVATAR SIZE through this class
        width: 150,
        height: 150,
    },
})


/*
    Pet control sub-component
 */
class PetControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorStatus: false,
            errorMessage: "",
            petNameFieldValue: "",
            petRaceFieldValue: "",

            // Pet removal checker
            checkedAwareOfPetRemoval: false,

            // Pet image state
            willUploadPetImage: false,
            didUploadPetImage: false,
            petImageAsURL: null,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handlePetNameFieldChange(event) {
        this.setState({
            petNameFieldValue: event.target.value,
        })
    }

    handlePetRaceFieldChange(event) {
        this.setState({
            petRaceFieldValue: event.target.value,
        })
    }

    handleAddPetImagePathChange(event) {
        let media = event.target.files[0]
        let reader = new FileReader()

        // Start uploading image
        this.setState({  // TODO Not sure if this locks state for changing...
            willUploadPetImage: true,
            didUploadPetImage: false,
            petImageAsURL: null,
        })

        // When done uploading image
        reader.onload = event => {
            this.setState({  // TODO Not sure if this locks state for changing...
                willUploadPetImage: false,
                didUploadPetImage: true,
                petImageAsURL: event.target.result
            })
        }

        // Begin op and trigger callback
        reader.readAsDataURL(media)
    }

    handleToggleAwareOfPetRemoval() {
        this.setState(state => ({
            checkedAwareOfPetRemoval: !state.checkedAwareOfPetRemoval,
        }))
    }

    handleCloseDialog() {
        this.setState({
            errorStatus: false,
            errorMessage: "",
            petNameFieldValue: "",
            petRaceFieldValue: "",
            checkedAwareOfPetRemoval: false,
            willUploadPetImage: false,
            didUploadPetImage: false,
            petImageAsURL: null,
        })
        this.props.onToggleDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS

        TODO These handlers need better names
        TODO Check handlers on other files as well
     */
    handleClickAddPet() {
        // TODO Check all field values for validity
        let stagePetName = this.state.petNameFieldValue
        let stagePetRace = this.state.petRaceFieldValue
        let stagePetMedia = this.state.didUploadPetImage ? this.state.petImageAsURL : "./media/sampleDog.png"
        let stageLocalMedia = !this.state.didUploadPetImage

        // Dispatch add pet store action
        this.props.onClickSubmitAddPet(this.props.currentUserEmail, {
            // TODO Is there an easy way to know which of these need to be set?
            name: stagePetName,
            race: stagePetRace,
            media: stagePetMedia,
            localMedia: stageLocalMedia,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickEditPet(currentData) {
        // TODO Check all field values for validity
        let stagePetId = currentData.id
        let stagePetName = this.state.petNameFieldValue
        let stagePetRace = this.state.petRaceFieldValue
        let stagePetMedia = this.state.didUploadPetImage ? this.state.petImageAsURL : currentData.media
        let stageLocalMedia = this.state.didUploadPetImage ? false : currentData.localMedia

        this.props.onClickSubmitEditPet(this.props.currentUserEmail, {
            id: stagePetId,
            name: stagePetName,
            race: stagePetRace,
            media: stagePetMedia,
            localMedia: stageLocalMedia,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickRemovePet() {
        this.props.onClickSubmitRemovePet(this.props.currentUserEmail, {
            id: this.props.selectedId,
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

        // Query pet data
        let petData = this.props
            .customerData.find(customer => (customer.email === this.props.currentUserEmail))
            .animals.find(animal => (animal.id === this.props.selectedId))
        if (typeof(petData) === "undefined")
            return null

        if (this.props.dialogMode === "remove") { // Dialog UI for removing an existing pet
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
                        control={<Checkbox checked={this.state.checkedAwareOfPetRemoval}
                            onChange={() => this.handleToggleAwareOfPetRemoval()}
                            color="secondary" />}
                        label="Tenho noção de que o pet será permanentemente removido dos registros"
                    />
                </div>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleClickRemovePet()} color="secondary"
                        disabled={!this.state.checkedAwareOfPetRemoval}
                    >
                            Confirmar
                    </Button>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                            Cancelar
                    </Button>
                </div>
            )

        } else { // Dialog UI for adding or editing a pet
            dialogTitle = (this.props.dialogMode === "registryAdd") ? "Cadastrar Novo Pet" : "Editar Dados do Pet"

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
                            value={this.state.petNameFieldValue}
                            onChange={event => this.handlePetNameFieldChange(event)}
                            margin="normal"
                        />
                        <TextField
                            required
                            fullWidth
                            id="race"
                            label="Raça"
                            placeholder={(this.props.dialogMode === "edit") ? petData.race : undefined}
                            className={this.props.classes.textField}
                            value={this.state.petRaceFieldValue}
                            onChange={event => this.handlePetRaceFieldChange(event)}
                            margin="normal"
                        />
                    </form>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            {this.state.didUploadPetImage ?
                                <Avatar
                                    alt="Novo avatar"
                                    src={this.state.petImageAsURL}
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
                                    disabled={this.state.willUploadPetImage}
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
                        disabled={this.state.willUploadPetImage}
                        onClick={this.props.dialogMode === "registryAdd" ?
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

PetControl.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // state
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // dialog state
    dialogOpen: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired,
    selectedId: PropTypes.number.isRequired,
    onToggleDialog: PropTypes.func.isRequired,

    // dialog actions
    onClickSubmitAddPet: PropTypes.func.isRequired,
    onClickSubmitEditPet: PropTypes.func.isRequired,
    onClickSubmitRemovePet: PropTypes.func.isRequired,
}


/*
    Exposed main component
 */
class CustomerPetViewBehavior extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // Can be any of { "add", "edit", "remove" }
            selectedId: 0,     // Id of pet selected for "edit" or "remove" operations
        }
    }

    handleToggleDialog(open, mode = null) {
        this.setState(state => ({
            dialogOpen: open,
            dialogMode: (mode !== null) ? mode : state.dialogMode,
        }))
    }

    handleSetSelected(id) {
        this.setState({
            selectedId: id
        })
    }

    render() {

        const {
            classes,
            customerData,
            currentUserEmail,
            currentUserRights,
            handleSubmitAddPet,
            handleSubmitEditPet,
            handleSubmitRemovePet,
        } = this.props

        // current user's pet information
        const userPetArray = customerData.find(cust => (cust.email === currentUserEmail)).animals

        return (
            <div>
                <PetShopPetList
                    animalArray={userPetArray}
                    currentUserRights={currentUserRights}
                    onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onSetSelected={(id) => this.handleSetSelected(id)}
                />
                <PetControl
                    classes={classes}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onClickSubmitAddPet={handleSubmitAddPet}
                    onClickSubmitEditPet={handleSubmitEditPet}
                    onClickSubmitRemovePet={handleSubmitRemovePet}
                />
            </div>
        )
    }
}

CustomerPetViewBehavior.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // store state
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // store actions
    handleSubmitAddPet: PropTypes.func.isRequired,
    handleSubmitEditPet: PropTypes.func.isRequired,
    handleSubmitRemovePet: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        //currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        currentUserRights: state.currentUserRights,
        //currentUserLoggedIn: state.currentUserLoggedIn,
        customerData: state.CustomerData,
        //siteData: state.SiteData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        handleSubmitAddPet: (userEmail, petData) => {
            dispatch(addPet(userEmail, petData))
        },
        handleSubmitEditPet: (userEmail, petData) => {
            dispatch(editPet(userEmail, petData))
        },
        handleSubmitRemovePet: (userEmail, petData) => {
            dispatch(removePet(userEmail, petData))
        },
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomerPetViewBehavior))