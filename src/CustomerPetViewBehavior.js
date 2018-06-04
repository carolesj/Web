import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import FileUpload from "@material-ui/icons/FileUpload"
import classNames from "classnames"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { addPet, editPet, removePet } from "./StoreActions"
import { FormControlLabel, Checkbox } from "@material-ui/core"

const styles = theme => ({
    // Pet list
    root: {
        flexGrow: 1,
        margin: 2 * theme.spacing.unit,
    },
    card: {  // DON'T FORGET to add this to <Card /> for dimension control
        minWidth: 380,
        maxWidth: 480,
    },
    media: {
        height: 0,
        paddingTop: "76.25%",  // Originally, 56.25%, meaning 16:9 media
    },

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
    Pet list sub-component
 */
function PetList(props) {
    /*
        required props:

        - classes
        - customerData
        - currentUserEmail

        - onToggleDialog(open, mode)
        - onSetSelected(id)
     */
    let data = props.customerData.find(customer => (customer.email === props.currentUserEmail))

    /*
        GRID TYPE

            Full-width, with grow (control grow via outer div and justification
            via the Grid container element).
        
        GRID ITEM

            Size controlled via breakpoints, for xs, sm, and upper.
            (To re-enable control via media size, set the class to classes.media.)

        CARD TYPE

            Media container. (TODO include pet register control in the cards.)

     */
    return (typeof (data) === "undefined") ? null :  // Don't worry, this comparison is safe
        (
            <div className={props.classes.root}>
                <Grid container spacing={24} direction="row" justify="flex-end" alignItems="flex-start">
                    <Grid item>
                        <Button variant="raised" color="primary"
                            onClick={() => props.onToggleDialog(true, "add")}>
                            Cadastrar Novo Pet
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={24} direction="row" justify="space-between" alignItems="flex-start">
                    {data.animals.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    className={props.classes.media}
                                    image={item.localMedia ? require(`${item.media}`) : item.media}
                                    title={"Meu pet " + item.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="headline" component="h2">
                                        {item.name}
                                    </Typography>
                                    <Typography component="p">
                                        {"Raça: " + item.race}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary"
                                        onClick={() => { props.onSetSelected(item.id); props.onToggleDialog(true, "edit") }}>
                                        Editar
                                    </Button>
                                    <Button size="small" color="secondary"
                                        onClick={() => { props.onSetSelected(item.id); props.onToggleDialog(true, "remove") }}>
                                        Remover
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
}

PetList.propTypes = {
    classes: PropTypes.object.isRequired,
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    onToggleDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


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
        CONTROLLED COMPONENT HANDLERS
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
        this.setState(state => ({  // TODO Not sure if this locks state for changing...
            willUploadPetImage: true,
            didUploadPetImage: false,
            petImageAsURL: null,
        }))

        // When done uploading image
        reader.onload = event => {
            this.setState(state => ({  // TODO Not sure if this locks state for changing...
                willUploadPetImage: false,
                didUploadPetImage: true,
                petImageAsURL: event.target.result
            }))
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
        REDUX STATE DISPATCH WRAPPERS
     */
    handleClickAddPet() {
        // TODO Check all field values for validity
        // TODO Actually move an image file and use it
        let stagePetName = this.state.petNameFieldValue
        let stagePetRace = this.state.petRaceFieldValue
        let stagePetMedia = this.state.didUploadPetImage ? this.state.petImageAsURL : "./media/sampleDog.png"
        let stageLocalMedia = !this.state.didUploadPetImage

        // Dispatch add pet store action
        this.props.onClickSubmitAddPet(this.props.currentUserEmail, {
            // HOW TO KNOW WHICH ARE REQUIRED FOR THE ACTION
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
        // TODO Actually move an image file and use it
        let stagePetId = currentData.id
        let stagePetName = this.state.petNameFieldValue
        let stagePetRace = this.state.petRaceFieldValue
        let stagePetMedia = this.state.didUploadPetImage ? this.state.petImageAsURL : currentData.media
        let stageLocalMedia = !this.state.didUploadPetImage

        this.props.onClickSubmitEditPet(this.props.currentUserEmail, {
            // HOW TO KNOW WHICH ARE REQUIRED FOR THE ACTION
            id: stagePetId,
            name: stagePetName,
            race: stagePetRace,
            media: stagePetMedia,
            localMedia: stageLocalMedia,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    /*
        ACTUAL RENDER METHOD
     */
    handleClickRemovePet() {
        let stagePetId = this.props.selectedId

        this.props.onClickSubmitRemovePet(this.props.currentUserEmail, {
            // HOW TO KNOW WHICH ARE REQUIRED FOR THE ACTION
            id: stagePetId,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    render() {
        /*
            required props:
    
            - classes
            - customerData
            - currentUserEmail
    
            - dialogOpen
            - dialogMode
            - onToggleDialog
         */
        let dialogContent = null
        let dialogActions = null


        /*
            TODO

            0. Change "media" values to contain actual paths            DONE
                + Use "./media/" or just "media" ???                    DONE
            1. Resolve paths correctly now with require.resolve         DONE (require.resolve doesn't do it for us, it just returns the absolute path)
            2. Set behaviour of "onChange" for file input component
         */
        if (this.props.dialogMode === "add") {
            dialogContent = (
                <DialogContent>
                    <form className={this.props.classes.container} noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="name"
                            label="Nome"
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
                            className={this.props.classes.textField}
                            value={this.state.petRaceFieldValue}
                            onChange={event => this.handlePetRaceFieldChange(event)}
                            margin="normal"
                        />
                    </form>
                    <Grid container direction="column" justify="center" alignItems="center">
                        {this.state.didUploadPetImage &&
                            <Grid item>
                                <Avatar
                                    alt="Imagem do novo pet"
                                    src={this.state.petImageAsURL}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                            </Grid>
                        }
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
                                    disabled={this.state.willUploadPetImage}>
                                    Escolher Imagem
                                    <FileUpload className={this.props.classes.rightIcon} />
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                </DialogContent>
            )

            dialogActions = (
                <Button onClick={() => this.handleClickAddPet()} color="primary" disabled={this.state.willUploadPetImage}>
                    Submeter
                </Button>
            )

        } else if (this.props.dialogMode === "edit") {
            // VERY NAUGHTY CODE AHEAD
            // VERY NAUGHTY CODE AHEAD
            // VERY NAUGHTY CODE AHEAD

            // Fetch from store HMMMMMMMMMMMMMMMMMMMMMMMMMM
            let data = this.props
                .customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .animals.find(animal => (animal.id === this.props.selectedId))

            // Change UI setters
            if (typeof (data) !== "undefined") {
                dialogContent = (
                    <DialogContent>
                        <form className={this.props.classes.container} noValidate autoComplete="off">
                            <TextField
                                autoFocus
                                fullWidth
                                id="name"
                                label="Nome"
                                placeholder={data.name}
                                className={this.props.classes.textField}
                                value={this.state.petNameFieldValue}
                                onChange={event => this.handlePetNameFieldChange(event)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                id="race"
                                label="Raça"
                                placeholder={data.race}
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
                                        alt="Nova imagem"
                                        src={this.state.petImageAsURL}
                                        className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                    />
                                    :
                                    <Avatar
                                        alt="Imagem atual"
                                        src={data.localMedia ? require(`${data.media}`) : data.media}
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
                                        disabled={this.state.willUploadPetImage}>
                                        Trocar Imagem
                                        <FileUpload className={this.props.classes.rightIcon} />
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                    </DialogContent>
                )

                dialogActions = (
                    <Button onClick={() => this.handleClickEditPet(data)} color="primary"
                        disabled={this.state.willUploadPetImage}>
                        Submeter
                    </Button>
                )
            }

        } else if (this.props.dialogMode === "remove") {
            // VERY NAUGHTY CODE AHEAD
            // VERY NAUGHTY CODE AHEAD
            // VERY NAUGHTY CODE AHEAD

            // Fetch from store HMMMMMMMMMMMMMMMMMMMMMMMMMM
            let data = this.props
                .customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .animals.find(animal => (animal.id === this.props.selectedId))

            // Change UI setters
            if (typeof (data) !== "undefined") {
                dialogContent = (
                    <DialogContent>
                        <DialogContentText align="center">
                            {"Tem certeza que deseja remover o pet " + data.name + "?"}
                            <br />
                            {"Ele será permanentemente excluído de nossos registros."}
                        </DialogContentText>
                        <br />
                        <FormControlLabel
                            control={<Checkbox checked={this.state.checkedAwareOfPetRemoval}
                                onChange={() => this.handleToggleAwareOfPetRemoval()}
                                color="secondary" />}
                            label="Tenho noção de que o pet será permanentemente removido dos registros" />
                    </DialogContent>
                )

                dialogActions = (
                    <Button onClick={() => this.handleClickRemovePet()} color="secondary"
                        disabled={!this.state.checkedAwareOfPetRemoval}>
                        Proceder
                    </Button>
                )
            }
        }

        return (
            <div>
                <Dialog open={this.props.dialogOpen} aria-labelledby="pet-control-dialog-title"
                    onClose={() => this.handleCloseDialog()}>

                    <DialogTitle id="pet-control-dialog-title">
                        {(this.props.dialogMode === "add") &&
                            "Adicionar Pet"
                        }
                        {(this.props.dialogMode === "edit") &&
                            "Editar Dados do Pet"
                        }
                        {(this.props.dialogMode === "remove") &&
                            "Remover Pet"
                        }
                    </DialogTitle>

                    {dialogContent}

                    {/* Depends only on errorStatus */}
                    {this.state.errorStatus && <DialogContent>
                        <DialogContentText align="center" color="secondary">
                            {this.state.errorMessage}
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

PetControl.propTypes = {
    classes: PropTypes.object.isRequired,
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
    onToggleDialog: PropTypes.func.isRequired,
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
        return (
            <div>
                <PetList classes={this.props.classes}
                    customerData={this.props.customerData}
                    currentUserEmail={this.props.currentUserEmail}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onSetSelected={id => this.handleSetSelected(id)} />
                <PetControl classes={this.props.classes}
                    customerData={this.props.customerData}
                    currentUserEmail={this.props.currentUserEmail}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onClickSubmitAddPet={this.props.handleSubmitAddPet}
                    onClickSubmitEditPet={this.props.handleSubmitEditPet}
                    onClickSubmitRemovePet={this.props.handleSubmitRemovePet} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        //currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        //currentUserRights: state.currentUserRights,
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