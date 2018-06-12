import { withStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import TextField from "@material-ui/core/TextField"
import { PropTypes } from "prop-types"
import React from "react"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
})


class CustomerShopControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorStatus: false,
            errorMessage: "",
            itemAmountField: "0",
            itemAmountFieldParsed: 0,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleItemAmountFieldChange(event) {
        this.setState({
            itemAmountField: event.target.value,
            itemAmountFieldParsed: parseInt(event.target.value, 10),
        })
    }

    handleEnterKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault()
            this.handleClickConfirmAddItem()
        }
    }

    handleCloseDialog() {
        this.setState({
            errorStatus: false,
            errorMessage: "",
            itemAmountField: "0",
            itemAmountFIeldParsed: 0,
        })
        this.props.onLaunchDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS
     */
    handleClickConfirmAddItem() {
        // Fetch data from redux store 
        let userData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
        let itemData = this.props.siteData.products.find(item => item.id === this.props.selectedId)

        // Find chosen item already in user cart
        let alreadyChosenData = userData.shoppingCart.find(item => (item.itemId === itemData.id))

        // Has user already added this to cart?
        if (typeof (alreadyChosenData) !== "undefined") {
            if (this.state.itemAmountFieldParsed > itemData.amount) {
                this.setState({
                    errorStatus: true,
                    errorMessage: "Quantidade (incluindo o carrinho) excede o disponível",
                })
            } else {
                // Dispatch edit cart
                this.props.onConfirmEditItem(this.props.currentUserEmail, {
                    itemId: itemData.id,
                    itemName: itemData.name,
                    itemPrice: itemData.price,
                    itemAmount: this.state.itemAmountFieldParsed,
                })
                // Close dialog on success
                this.handleCloseDialog()
            }

        } else {
            if (this.state.itemAmountFieldParsed > itemData.amount) {
                this.setState({
                    errorStatus: true,
                    errorMessage: "Quantidade excede o disponível",
                })
            } else {
                // Dispatch add to cart
                this.props.onConfirmAddItem(this.props.currentUserEmail, {
                    itemId: itemData.id,
                    itemName: itemData.name,
                    itemPrice: itemData.price,
                    itemAmount: this.state.itemAmountFieldParsed,
                })
                // Close dialog on success
                this.handleCloseDialog()
            }
        }
    }

    handleClickConfirmRemoveItem() {
        // Fetch data from redux store 
        let userData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))

        // Find chosen item in user cart
        let alreadyChosenData = userData.shoppingCart.find(item => (item.itemId === this.props.selectedId))

        // Dispatch remove from cart
        this.props.onConfirmRemoveItem(this.props.currentUserEmail, {
            itemId: alreadyChosenData.itemId,
            itemAmount: alreadyChosenData.itemAmount,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickConfirmCommitPurchase() {
        // Fetch data from redux store 
        let userData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))

        // Dispatch commit purchase
        this.props.onConfirmCommitPurchase(this.props.currentUserEmail, userData.shoppingCart)

        // Close dialog on success
        this.handleCloseDialog()
    }


    /*
        RENDER FUNCTION
     */
    render() {
        const { classes } = this.props

        let dialogTitle = ""
        let dialogContent = <React.Fragment></React.Fragment>
        let dialogActions = <React.Fragment></React.Fragment>


        // Dialog UI for adding item to cart
        if (this.props.dialogMode === "add") {
            dialogTitle = "Adicionar ao Carrinho"

            dialogContent = (
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        autoFocus
                        fullWidth
                        id="itemAmount"
                        label="Quantidade"
                        className={classes.textField}
                        value={this.state.itemAmountField}
                        onChange={e => this.handleItemAmountFieldChange(e)}
                        onKeyDown={e => this.handleEnterKeyDown(e)}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                </form>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.handleClickConfirmAddItem()} color="primary"
                        disabled={(this.state.itemAmountFieldParsed <= 0) || (isNaN(this.state.itemAmountFieldParsed))}
                    >
                        Confirmar
                    </Button>
                </div>
            )

        // Dialog UI for removing item from cart
        } else if (this.props.dialogMode === "remove") {
            dialogTitle = "Remover do Carrinho"

            dialogContent = (
                <DialogContentText align="center">
                    {"Tem certeza que deseja remover o item do seu carrinho de compras?"}
                </DialogContentText>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.handleClickConfirmRemoveItem()} color="secondary">
                        Confirmar
                    </Button>
                </div>
            )

        // Dialog UI for commiting on a purchase
        } else if (this.props.dialogMode === "commit") {
            dialogTitle = "Confirmar Compra"

            dialogContent = (
                <DialogContentText align="center">
                    {"Deseja proceder com a compra?"}
                </DialogContentText>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.handleClickConfirmCommitPurchase()} color="primary">
                        Confirmar
                    </Button>
                </div>
            )
        }


        return (
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                ariaLabel="customer-shop-control-dialog"
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                errorStatus={this.state.errorStatus}
                errorText={this.state.errorMessage}
            />
        )
    }
}

CustomerShopControl.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // inherited state (SUPPLY THESE)
    siteData: PropTypes.object.isRequired,
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
    onLaunchDialog: PropTypes.func.isRequired,
    onConfirmAddItem: PropTypes.func.isRequired,
    onConfirmEditItem: PropTypes.func.isRequired,
    onConfirmRemoveItem: PropTypes.func.isRequired,
    onConfirmCommitPurchase: PropTypes.func.isRequired,
}

export default withStyles(styles)(CustomerShopControl)