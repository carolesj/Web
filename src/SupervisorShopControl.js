import { Avatar, FormControl, Input, InputAdornment, InputLabel, withStyles } from "@material-ui/core"
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
class SupervisorShopControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Error reporting
            errorStatus: false,
            errorMessage: "",

            // Dialog state
            itemNameValue: "",
            itemPriceValue: "",
            itemAmountValue: "",
            itemDescriptionValue: "",

            // Pet image state
            willUploadItemImage: false,
            didUploadItemImage: false,
            itemImageAsURL: null,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleChangeFieldValue(prop) {
        return event => {
            this.setState({
                [prop]: event.target.value,
            })
        }
    }

    handleChangeImagePath(event) {
        let media = event.target.files[0]
        let reader = new FileReader()

        // Start uploading image
        this.setState({  // TODO Not sure if this locks state for changing...
            willUploadItemImage: true,
            didUploadItemImage: false,
            itemImageAsURL: null,
        })

        // When done uploading image
        reader.onload = event => {
            this.setState({  // TODO Not sure if this locks state for changing...
                willUploadItemImage: false,
                didUploadItemImage: true,
                itemImageAsURL: event.target.result,
            })
        }

        // Begin op and trigger callback
        reader.readAsDataURL(media)
    }

    handleCloseDialog() {
        this.setState({
            errorStatus: false,
            errorMessage: "",
            itemNameValue: "",
            itemPriceValue: "",
            itemAmountValue: "",
            itemDescriptionValue: "",
            willUploadItemImage: false,
            didUploadItemImage: false,
            itemImageAsURL: null,
        })
        this.props.onLaunchDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS

        TODO These handlers need better names
        TODO Check handlers on other files as well
     */
    handleClickAddItem() {
        // Text
        let stageItemName = this.state.itemNameValue
        let stageItemDescription = this.state.itemDescriptionValue

        // Numbers
        let stageItemPrice = parseFloat(this.state.itemPriceValue)
        let stageItemAmount = parseInt(this.state.itemAmountValue, 10)

        // Blob
        let stageItemMedia = this.state.didUploadItemImage ? this.state.itemImageAsURL : "./media/sampleDog.png"
        let stageLocalMedia = !this.state.didUploadItemImage


        // CHECK EVERYTHING
        if (stageItemName === "") {
            this.setState({
                errorStatus: true,
                errorMessage: "Nome do produto inválido!"
            })
            return
        }
        if (isNaN(stageItemPrice)) {
            this.setState({
                errorStatus: true,
                errorMessage: "Preço do produto inválido!"
            })
            return
        }
        if (isNaN(stageItemAmount)) {
            this.setState({
                errorStatus: true,
                errorMessage: "Quantidade em estoque do produto inválido!"
            })
            return
        }

        // DISPATCH ACTION
        this.props.onClickSubmitAddItem({
            name: stageItemName,
            price: stageItemPrice,
            amount: stageItemAmount,
            description: stageItemDescription,
            media: stageItemMedia,
            localMedia: stageLocalMedia,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickEditItem(currentData) {
        // Text
        let stageItemName = this.state.itemNameValue
        let stageItemDescription = this.state.itemDescriptionValue

        // Numbers
        let stageItemPrice = parseFloat(this.state.itemPriceValue)
        let stageItemAmount = parseInt(this.state.itemAmountValue, 10)

        // Blob
        let stageItemMedia = this.state.didUploadItemImage ? this.state.itemImageAsURL : currentData.media
        let stageLocalMedia = this.state.didUploadItemImage ? false : currentData.localMedia


        // CHECK EVERYTHING
        if (stageItemName === "") {
            this.setState({
                errorStatus: true,
                errorMessage: "Nome do produto inválido!"
            })
            return
        }
        if (isNaN(stageItemPrice)) {
            this.setState({
                errorStatus: true,
                errorMessage: "Preço do produto inválido!"
            })
            return
        }
        if (isNaN(stageItemAmount)) {
            this.setState({
                errorStatus: true,
                errorMessage: "Quantidade em estoque do produto inválido!"
            })
            return
        }

        // DISPATCH ACTION
        this.props.onClickSubmitEditItem({
            id: currentData.id,
            name: stageItemName,
            price: stageItemPrice,
            amount: stageItemAmount,
            description: stageItemDescription,
            media: stageItemMedia,
            localMedia: stageLocalMedia,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickRemoveItem() {
        this.props.onClickSubmitRemoveItem({
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
        let itemData = this.props.siteData.products.find(product => (product.id === this.props.selectedId))
        if (typeof(itemData) === "undefined")
            return null

        // Dialog UI for adding or editing a pet
        if (this.props.dialogMode !== "remove") {
            dialogTitle = (this.props.dialogMode === "registryAdd") ? "Cadastrar Novo Produto" : "Editar Dados do Produto"

            dialogContent = (
                <div>
                    <form className={this.props.classes.container} noValidate autoComplete="off">
                        <TextField
                            autoFocus
                            required={(this.props.dialogMode === "add")}
                            fullWidth
                            id="name"
                            label="Nome do item"
                            placeholder={(this.props.dialogMode === "edit") ? itemData.name : undefined}
                            className={this.props.classes.textField}
                            value={this.state.itemNameValue}
                            onChange={this.handleChangeFieldValue("itemNameValue")}
                            margin="normal"
                        />
                        <FormControl fullWidth className={this.props.classes.textField}>
                            <InputLabel htmlFor="price-adorned">Preço</InputLabel>
                            <Input
                                id="price-adorned"
                                label="Preço do item"
                                value={this.state.itemPriceValue}
                                onChange={this.handleChangeFieldValue("itemPriceValue")}
                                placeholder={(this.props.dialogMode === "edit") ? String(itemData.price) : undefined}
                                startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            />
                        </FormControl>
                        <TextField
                            required={(this.props.dialogMode === "add")}
                            fullWidth
                            id="item-amount"
                            label="Quantia em estoque"
                            value={this.state.itemAmountValue}
                            onChange={this.handleChangeFieldValue("itemAmountValue")}
                            placeholder={(this.props.dialogMode === "edit") ? String(itemData.amount) : undefined}
                            className={this.props.classes.textField}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        <TextField
                            required={(this.props.dialogMode === "add")}
                            fullWidth
                            multiline
                            rowsMax="4"
                            id="description"
                            label="Descrição do produto"
                            placeholder={(this.props.dialogMode === "edit") ? itemData.description : undefined}
                            className={this.props.classes.textField}
                            value={this.state.itemDescriptionValue}
                            onChange={this.handleChangeFieldValue("itemDescriptionValue")}
                            margin="normal"
                        />
                    </form>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            {this.state.didUploadItemImage ?
                                <Avatar
                                    alt="Nova imagem"
                                    src={this.state.itemImageAsURL}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                                : (this.props.dialogMode === "edit") &&
                                <Avatar
                                    alt="Imagem atual"
                                    src={itemData.localMedia ? require(`${itemData.media}`) : itemData.media}
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
                                    disabled={this.state.willUploadItemImage}
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
                        disabled={this.state.willUploadItemImage}
                        onClick={this.props.dialogMode === "registryAdd" ?
                            () => this.handleClickAddItem()
                            :
                            () => this.handleClickEditItem(itemData)
                        }
                    >
                        Confirmar
                    </Button>
                </div>
            )

        // Dialog UI for removing an existing pet
        } else {
            dialogTitle = "Remover Registro do Produto"

            dialogContent = (
                <DialogContentText align="center">
                    {"Tem certeza que deseja remover de circulação o item " + itemData.name + "?"}
                    <br />
                    {"Ele será permanentemente excluído de nossos registros."}
                </DialogContentText>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                            Cancelar
                    </Button>
                    <Button onClick={() => this.handleClickRemoveItem()} color="secondary">
                            Confirmar
                    </Button>
                </div>
            )

        } 


        return (
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                ariaLabel="supervisor-shop-control-dialog"
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

    // inherited
    dialogOpen: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired,
    selectedId: PropTypes.number.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,

    // store state
    siteData: PropTypes.object.isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // store actions
    onClickSubmitAddItem: PropTypes.func.isRequired,
    onClickSubmitEditItem: PropTypes.func.isRequired,
    onClickSubmitRemoveItem: PropTypes.func.isRequired,
}

export default withStyles(styles)(SupervisorShopControl)