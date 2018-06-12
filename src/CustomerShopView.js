import { Icon } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
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
import { PetShopProductList } from "./PetShopCardViews"


const styles = theme => ({
    // table
    root: {
        width: "100%",
        overflowX: "auto",
        //marginTop: theme.spacing.unit * 3,
        //marginLeft: theme.spacing.unit * 3,
        //marginRight: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 500,
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default,
        },
    },

    // buttons
    tButton: {
        marginRight: -15,
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },

    // textfields
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },

    // mini displays
    chipRoot: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    chip: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    bigAvatar: {
        width: 45,
        height: 45,
    },
})


/*
    Shopping cart sub-component

    TODO Move this to another file!!!
 */
const ShoppingCart = withStyles(styles)(props => {
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

    // Prepare data store
    let mediaInfo = null
    let subTotal = 0.0

    return (
        (props.cartItemArray.length > 0) ?
            <div>
                {/* Table */}
                <Paper className={props.classes.root}>
                    <Table className={props.classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Item da loja</CustomTableCell>
                                <CustomTableCell numeric>Unidades</CustomTableCell>
                                <CustomTableCell numeric>Preço (R$)</CustomTableCell>
                                <CustomTableCell numeric>Ação</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.cartItemArray.map((item, index) => {
                                mediaInfo = props.productArray.find(prod => prod.id === item.itemId)
                                subTotal = subTotal + parseFloat(item.itemPrice) * parseInt(item.itemAmount, 10)

                                return (
                                    <TableRow className={props.classes.row} key={index}>
                                        <CustomTableCell component="th" scope="row">
                                            {/* <div className={props.classes.chipRoot}> */}
                                            <Chip
                                                avatar={
                                                    <Avatar
                                                        alt="Imagem do produto"
                                                        src={mediaInfo.localMedia ? require(`${mediaInfo.media}`) : mediaInfo.media}
                                                        className={props.classes.bigAvatar}
                                                    />}
                                                label={item.itemName}
                                                className={props.classes.chip}
                                            />
                                            {/* </div> */}
                                        </CustomTableCell>
                                        <CustomTableCell numeric>{item.itemAmount}</CustomTableCell>
                                        <CustomTableCell numeric>{parseFloat(item.itemPrice) * parseInt(item.itemAmount, 10)}</CustomTableCell>
                                        <CustomTableCell numeric>
                                            <Button color="secondary" className={props.classes.tButton}
                                                onClick={() => { props.onSetSelected(item.itemId); props.onLaunchDialog(true, "remove") }}>
                                                    Remover
                                            </Button>
                                        </CustomTableCell>
                                    </TableRow>
                                )
                            })}
                            <TableRow className={props.classes.row}>
                                <CustomTableCell component="th" scope="row">
                                    <Typography variant="body2">
                                        Subtotal
                                    </Typography>
                                </CustomTableCell>
                                <CustomTableCell numeric></CustomTableCell>
                                <CustomTableCell numeric>
                                    <Typography variant="body2">
                                        {`R$ ${subTotal}`}
                                    </Typography>
                                </CustomTableCell>
                                <CustomTableCell numeric>
                                    <Button color="primary" className={props.classes.tButton}
                                        onClick={() => { props.onLaunchDialog(true, "commit") }}>
                                                Finalizar Compra
                                    </Button>
                                </CustomTableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>

                {/* Floating return button */}
                <Button variant="fab" color="primary"
                    onClick={() => props.onChangeCurrentView("shop")}
                    className={props.classes.fab}
                >
                    <Icon>arrow_back</Icon>
                </Button>
            </div>
            :
            <Typography variant="title" align="center" color="primary">
                <br />
                Seu carrinho de compras está vazio :(
            </Typography>
    )
})

ShoppingCart.propTypes = {
    // style
    classes: PropTypes.object,

    // inherited state (SUPPLY THESE)
    productArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,
    cartItemArray: PropTypes.arrayOf(
        PropTypes.shape({
            itemId: PropTypes.number.isRequired,
            itemName: PropTypes.string.isRequired,
            itemPrice: PropTypes.number.isRequired,
            itemAmount: PropTypes.number.isRequired,
        })
    ).isRequired,

    // inherited actions (SUPPLY THESE)
    onChangeCurrentView: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


function CustomerShopView(props) {

    // Retrieve current user's shopping cart (WILL EXIST)
    let itemArray = props.customerData.find(customer => (customer.email === props.currentUserEmail)).shoppingCart

    // At this point, the view is either "shop" or "shoppingCart"
    return((props.currentUserView === "shop") ?
        <PetShopProductList
            productArray={props.siteData.products}
            currentUserRights={"customer"} // Encapsulated in this module
            onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
            onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
            onSetSelected={(id) => props.onSetSelected(id)}
        />
        :
        (itemArray.length > 0) ?
            <ShoppingCart
                cartItemArray={itemArray}
                productArray={props.siteData.products}
                onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
                onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
                onSetSelected={(id) => props.onSetSelected(id)}
            />
            :
            <Typography variant="title" align="center" color="primary">
                <br />
                Seu carrinho de compras está vazio :(
            </Typography>
    )
}

CustomerShopView.propTypes = {
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
    currentUserView: PropTypes.string.isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // inherited actions (SUPPLY THESE)
    onSetSelected: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onChangeCurrentView: PropTypes.func.isRequired,
}

export default CustomerShopView