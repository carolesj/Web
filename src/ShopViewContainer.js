import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerShopControl from "./CustomerShopControl"
import { PetShopProductList } from "./PetShopCardViews"
import { addProduct, addToCart, changeCurrentView, commitOnPurchase, editCartItem, editProduct, removeFromCart, removeProduct } from "./StoreActions"
import SupervisorShopControl from "./SupervisorShopControl"

const styles = theme => ({
    // Shopping list
    listRoot: {
        flexGrow: 1,
        marginTop: -2 * theme.spacing.unit,
        marginLeft: -1 * theme.spacing.unit,
        marginRight: -1 * theme.spacing.unit,
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
        //marginTop: theme.spacing.unit * 3,
        //marginLeft: theme.spacing.unit * 3,
        //marginRight: theme.spacing.unit * 3,
        marginTop: -1 * theme.spacing.unit,
        marginLeft: -1 * theme.spacing.unit,
        marginRight: -1 * theme.spacing.unit,
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
    Shopping cart sub-component
 */
function ShoppingCart(props) {
    // Just inline this I don't care
    const CustomTableCell = withStyles(theme => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell)

    // Fetch and prepare data
    let data = props.customerData.find(customer => (customer.email === props.currentUserEmail)).shoppingCart
    const { classes } = props
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
                                    subTotal = subTotal + parseFloat(item.itemPrice) * parseInt(item.itemAmount, 10)

                                    return (
                                        <TableRow className={classes.row} key={index}>
                                            <CustomTableCell component="th" scope="row">
                                                {item.itemName}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>{item.itemAmount}</CustomTableCell>
                                            <CustomTableCell numeric>{parseFloat(item.itemPrice) * parseInt(item.itemAmount, 10)}</CustomTableCell>
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
    Exposed main component
 */
class ShopViewContainer extends React.Component {
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
        const {
            classes,
            siteData,
            customerData,
            currentUserView,
            currentUserEmail,
            currentUserRights,
            handleConfirmAddItem,
            handleConfirmEditItem,
            handleConfirmRemoveItem,
            handleConfirmCommitPurchase,
            handleStockAddItem,
            handleStockEditItem,
            handleStockRemoveItem,
            handleChangeCurrentView
        } = this.props

        let shopController = null

        switch (currentUserRights) {
        case "customer":
            shopController = (
                <CustomerShopControl
                    siteData={siteData}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onClickConfirmAddItem={(userEmail, itemData) => handleConfirmAddItem(userEmail, itemData)}
                    onClickConfirmEditItem={(userEmail, itemData) => handleConfirmEditItem(userEmail, itemData)}
                    onClickConfirmRemoveItem={(userEmail, itemData) => handleConfirmRemoveItem(userEmail, itemData)}
                    onClickConfirmCommitPurchase={(userEmail, shoppingCart) => handleConfirmCommitPurchase(userEmail, shoppingCart)}
                />
            )
            break

        case "supervisor":
            shopController = (
                <SupervisorShopControl
                    siteData={siteData}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    currentUserRights={currentUserRights}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onClickSubmitAddItem={(itemData) => handleStockAddItem(itemData)}
                    onClickSubmitEditItem={(itemData) => handleStockEditItem(itemData)}
                    onClickSubmitRemoveItem={(itemData) => handleStockRemoveItem(itemData)}
                />
            )
            break

        default:
            break
        }

        return (
            <div>
                {(currentUserView === "shop") &&
                    <PetShopProductList
                        productArray={siteData.products}
                        currentUserRights={currentUserRights}
                        onChangeCurrentView={(nextView) => handleChangeCurrentView(nextView)}
                        onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={(id) => this.handleSetSelected(id)}
                    />
                }
                {(currentUserView === "shoppingCart") &&
                    <ShoppingCart
                        classes={classes}
                        customerData={customerData}
                        currentUserEmail={currentUserEmail}
                        onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={(id) => this.handleSetSelected(id)}
                    />
                }
                {shopController}
            </div>
        )
    }
}

ShopViewContainer.propTypes = {
    classes: PropTypes.object.isRequired,

    // store state
    siteData: PropTypes.object.isRequired,
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserView: PropTypes.string.isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // store customer actions
    handleConfirmAddItem: PropTypes.func.isRequired,
    handleConfirmEditItem: PropTypes.func.isRequired,
    handleConfirmRemoveItem: PropTypes.func.isRequired,
    handleConfirmCommitPurchase: PropTypes.func.isRequired,

    // store supervisor actions
    handleStockAddItem: PropTypes.func.isRequired,
    handleStockEditItem: PropTypes.func.isRequired,
    handleStockRemoveItem: PropTypes.func.isRequired,

    // store common actions
    handleChangeCurrentView: PropTypes.func.isRequired,
}


function mapStateToProps(state) {
    return {
        currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        currentUserRights: state.currentUserRights,
        //currentUserLoggedIn: state.currentUserLoggedIn,
        customerData: state.CustomerData,
        siteData: state.SiteData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Customer controls
        handleConfirmAddItem: (userEmail, itemData) => {
            dispatch(addToCart(userEmail, itemData))
        },
        handleConfirmEditItem: (userEmail, itemData) => {
            dispatch(editCartItem(userEmail, itemData))
        },
        handleConfirmRemoveItem: (userEmail, itemData) => {
            dispatch(removeFromCart(userEmail, itemData))
        },
        handleConfirmCommitPurchase: (userEmail, shoppingCart) => {
            dispatch(commitOnPurchase(userEmail, shoppingCart))
        },
        // Supervisor controls
        handleStockAddItem: itemData => {
            dispatch(addProduct(itemData))
        },
        handleStockEditItem: itemData => {
            dispatch(editProduct(itemData))
        },
        handleStockRemoveItem: itemData => {
            dispatch(removeProduct(itemData))
        },
        // General controls
        handleChangeCurrentView: nextView => {
            dispatch(changeCurrentView(nextView))
        }
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShopViewContainer))