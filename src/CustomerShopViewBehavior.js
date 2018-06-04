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
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { addToCart, removeFromCart, editCartItem, commitOnPurchase } from "./StoreActions"

const styles = theme => ({
    // Shopping list
    listRoot: {
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
    details: {
        alignItems: "center",
    },

    // Shopping cart
    tableRoot: {
        //width: "100%",
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        overflowX: "auto",
    },
    tableBody: {
        minWidth: 500,
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default,
        },
    },
    tableButton: {
        marginRight: -15,
    },
    confirmButton: {
        marginLeft: 3 * theme.spacing.unit,
    },
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

/*
    Shop list sub-component
 */
function ShoppingList(props) {
    /*
        required props:

        - classes
        - siteData

        - onToggleDialog(open, mode)
        - onSetSelected(id)
     */

    // Destructure classes
    const { classes } = props

    return (
        <div className={classes.listRoot}>
            <Grid container spacing={24} justify="flex-start">
                {props.siteData.products.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={item.localMedia ? require(`${item.media}`) : item.media}
                                title={"Serviço de " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {`${item.name} - R$${item.price}`}
                                </Typography>
                                <Typography component="p">
                                    {item.description}
                                </Typography>
                                {item.amount > 0 ?
                                    <Typography variant="body1" gutterBottom align="left">
                                        <br />
                                        {`Disponibilidade: ${item.amount} unidades`}
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" gutterBottom align="left">
                                        <br />
                                        Produto esgotado
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                {item.amount > 0 ?
                                    <Button size="small" color="primary"
                                        onClick={() => { props.onSetSelected(item.id); props.onToggleDialog(true, "add") }}>
                                        Adicionar ao Carrinho
                                    </Button>
                                    :
                                    <Button disabled size="small" color="primary">
                                        Adicionar ao Carrinho
                                    </Button>
                                }
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

ShoppingList.propTypes = {
    classes: PropTypes.object.isRequired,
    siteData: PropTypes.object.isRequired,
    onToggleDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


/*
    Shopping cart sub-component
 */
function ShoppingCart(props) {
    // Just inline this I don't give a fuck
    const CustomTableCell = withStyles(theme => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell)

    // Retrieve the data
    let data = props.customerData.find(customer => (customer.email === props.currentUserEmail)).shoppingCart

    // Destructure
    const { classes } = props

    // Tracker
    let subTotal = 0.0

    return (
        (data.length > 0) ?
            <Grid container spacing={24} direction="column" justify="flex-start" alignItems="stretch">
                <Grid item>
                    <Paper className={classes.tableRoot}>
                        <Table className={classes.tableBody}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Item da loja</CustomTableCell>
                                    <CustomTableCell numeric>Unidades</CustomTableCell>
                                    <CustomTableCell numeric>Preço (R$)</CustomTableCell>
                                    <CustomTableCell numeric>Ação</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((item, index) => {
                                    subTotal = subTotal + (parseFloat(item.itemPrice) * parseInt(item.itemAmount))

                                    return (
                                        <TableRow className={classes.row} key={index}>
                                            <CustomTableCell component="th" scope="row">
                                                {item.itemName}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>{item.itemAmount}</CustomTableCell>
                                            <CustomTableCell numeric>{parseFloat(item.itemPrice) * parseInt(item.itemAmount)}</CustomTableCell>
                                            <CustomTableCell numeric>
                                                <Button color="secondary" className={classes.tableButton}
                                                    onClick={() => { props.onSetSelected(item.itemId); props.onToggleDialog(true, "remove") }}>
                                                    Remover
                                                </Button>
                                            </CustomTableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow className={classes.row}>
                                    <CustomTableCell component="th" scope="row">
                                        Subtotal
                                    </CustomTableCell>
                                    <CustomTableCell numeric></CustomTableCell>
                                    <CustomTableCell numeric></CustomTableCell>
                                    <CustomTableCell numeric>
                                        {`R$ ${subTotal}`}
                                    </CustomTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item>
                    <Button variant="raised" color="secondary" className={classes.confirmButton}
                        onClick={() => props.onToggleDialog(true, "commit")}>
                        Confirmar Compra
                    </Button>
                </Grid>
            </Grid>
            :
            <Typography variant="headline" align="center" color="secondary">
                <br />
                Seu carrinho de compras está vazio
            </Typography>
    )
}

ShoppingCart.propTypes = {
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
    Shop control sub-component
 */
class ShopControl extends React.Component {
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
        CONTROLLED COMPONENT HANDLERS
     */
    handleItemAmountFieldChange(event) {
        this.setState({
            // DON'T FORGET TO PARSEINT
            itemAmountField: event.target.value,
            itemAmountFieldParsed: parseInt(event.target.value),
        })
    }

    handleClickConfirmAddItem() {
        // Fetch data from redux store 
        let userData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
        let itemData = this.props.siteData.products.find(item => item.id === this.props.selectedId)

        // Find chosen item already in user cart
        let alreadyChosenData = userData.shoppingCart.find(item => (item.itemId === itemData.id))

        // Has user already added this to cart?
        if (typeof (alreadyChosenData) !== "undefined") {
            if (this.state.itemAmountFieldParsed + alreadyChosenData.itemAmount > itemData.amount) {
                this.setState({
                    errorStatus: true,
                    errorMessage: "Quantidade (somada à que já está presente no carrinho) excede o disponível",
                })
            } else {
                // Dispatch edit cart
                this.props.onClickConfirmEditItem(this.props.currentUserEmail, {
                    itemId: itemData.id,
                    itemName: itemData.name,
                    itemPrice: itemData.price,
                    itemAmount: (alreadyChosenData.itemAmount + this.state.itemAmountFieldParsed),
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
                this.props.onClickConfirmAddItem(this.props.currentUserEmail, {
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
        let itemData = this.props.siteData.products.find(item => (item.id === this.props.selectedId))

        // Dispatch remove from cart
        this.props.onClickConfirmRemoveItem(this.props.currentUserEmail, {
            itemId: itemData.id,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickConfirmCommitPurchase() {
        // Fetch data from redux store 
        let userData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))

        // Dispatch commit purchase
        this.props.onClickConfirmCommitPurchase(this.props.currentUserEmail, userData.shoppingCart)

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleCloseDialog() {
        this.setState({
            errorStatus: false,
            errorMessage: "",
            itemAmountField: "0",
            itemAmountFIeldParsed: 0,
        })
        this.props.onToggleDialog(false)
    }

    render() {
        let dialogContent = null
        let dialogActions = null

        // Destructure classes
        const { classes } = this.props

        if (this.props.dialogMode === "add") {
            dialogContent = (
                <DialogContent>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                            id="itemAmount"
                            label="Quantidade"
                            value={this.state.itemAmountField}
                            onChange={event => this.handleItemAmountFieldChange(event)}
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                    </form>
                </DialogContent>
            )

            dialogActions = (
                <Button onClick={() => this.handleClickConfirmAddItem()} color="primary"
                    disabled={(this.state.itemAmountFieldParsed <= 0) || (isNaN(this.state.itemAmountFieldParsed))}>
                    Confirmar
                </Button>
            )

        } else if (this.props.dialogMode === "remove") {
            dialogContent = (
                <DialogContent>
                    <DialogContentText align="center">
                        {"Tem certeza que deseja remover o item do seu carrinho de compras?"}
                    </DialogContentText>
                </DialogContent>
            )

            dialogActions = (
                <Button onClick={() => this.handleClickConfirmRemoveItem()} color="secondary">
                    Confirmar
                </Button>
            )

        } else if (this.props.dialogMode === "commit") {
            dialogContent = (
                <DialogContent>
                    <DialogContentText align="center">
                        {"Deseja proceder com a compra?"}
                    </DialogContentText>
                </DialogContent>
            )

            dialogActions = (
                <Button onClick={() => this.handleClickConfirmCommitPurchase()} color="primary">
                    Confirmar
                </Button>
            )
        }

        return (
            <div>
                <Dialog open={this.props.dialogOpen} aria-labelledby="shop-control-dialog-title"
                    onClose={() => this.handleCloseDialog()}>

                    <DialogTitle id="shop-control-dialog-title">
                        {(this.props.dialogMode === "add") &&
                            "Adicionar ao Carrinho"
                        }
                        {(this.props.dialogMode === "remove") &&
                            "Remover do Carrinho"
                        }
                        {(this.props.dialogMode === "commit") &&
                            "Confirmar Compra"
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

ShopControl.propTypes = {
    classes: PropTypes.object.isRequired,
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
    onToggleDialog: PropTypes.func.isRequired,
    onClickConfirmAddItem: PropTypes.func.isRequired,
    onClickConfirmEditItem: PropTypes.func.isRequired,
    onClickConfirmRemoveItem: PropTypes.func.isRequired,
    onClickConfirmCommitPurchase: PropTypes.func.isRequired,
}


/*
    Exposed main component
 */
class CustomerShopViewBehavior extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // Can be any of { "add", "commit" }
            selectedId: 0,     // Id of product selected for "add to/remove from cart" or "commit purchase" operations
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
                {(this.props.currentUserView === "products") &&
                    <ShoppingList classes={this.props.classes}
                        siteData={this.props.siteData}
                        onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={id => this.handleSetSelected(id)} />
                }
                {(this.props.currentUserView === "myShoppingCart") &&
                    <ShoppingCart classes={this.props.classes}
                        customerData={this.props.customerData}
                        currentUserEmail={this.props.currentUserEmail}
                        onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={id => this.handleSetSelected(id)} />
                }
                <ShopControl classes={this.props.classes}
                    siteData={this.props.siteData}
                    customerData={this.props.customerData}
                    currentUserEmail={this.props.currentUserEmail}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onClickConfirmAddItem={(userEmail, itemData) => this.props.onClickConfirmAddItem(userEmail, itemData)}
                    onClickConfirmEditItem={(userEmail, itemData) => this.props.onClickConfirmEditItem(userEmail, itemData)}
                    onClickConfirmRemoveItem={(userEmail, itemData) => this.props.onClickConfirmRemoveItem(userEmail, itemData)}
                    onClickConfirmCommitPurchase={(userEmail, shoppingCart) => this.props.onClickConfirmCommitPurchase(userEmail, shoppingCart)} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        //currentUserRights: state.currentUserRights,
        //currentUserLoggedIn: state.currentUserLoggedIn,
        customerData: state.CustomerData,
        siteData: state.SiteData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onClickConfirmAddItem: (userEmail, itemData) => {
            dispatch(addToCart(userEmail, itemData))
        },
        onClickConfirmEditItem: (userEmail, itemData) => {
            dispatch(editCartItem(userEmail, itemData))
        },
        onClickConfirmRemoveItem: (userEmail, itemData) => {
            dispatch(removeFromCart(userEmail, itemData))
        },
        onClickConfirmCommitPurchase: (userEmail, shoppingCart) => {
            dispatch(commitOnPurchase(userEmail, shoppingCart))
        },
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomerShopViewBehavior))