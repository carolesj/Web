import { CircularProgress, Grid, Icon } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import Paper from "@material-ui/core/Paper"
import { withStyles } from "@material-ui/core/styles"
import spacing from "@material-ui/core/styles/spacing"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import Axios from "axios"
import moment from "moment"
import { PropTypes } from "prop-types"
import React from "react"
import Root from "./remote"

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
    Shopping cart table list for the customer view
 */
//const PetShopShoppingCart = withStyles(styles)(props => {
class WrappedShoppingCart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorText: "",
            errorStatus: false,
            doingRemoteRequest: false,
        }
    }

    componentDidMount() {
        // Begin remote request
        this.setState({
            doingRemoteRequest: true,
        })

        // Actually just query the user shopping cart, products are given
        Axios.get(Root + "/" + this.props.currentUserEmail + "/shoppingCart")
            .then(response => {
                if (response.data.ok) {
                    this.setState({
                        errorText: "",
                        errorStatus: false,
                        doingRemoteRequest: false,
                    })
                    this.props.onGetUserShoppingCart(response.data.shoppingCart)
                } else {
                    this.setState({
                        errorStatus: true,
                        errorText: response.data.error,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorText: error.message,
                    doingRemoteRequest: false,
                })
            })
    }

    render () {
        const {
            classes,
            productArray,
            cartItemArray,
            onChangeCurrentView,
            onLaunchDialog,
            onSetSelected
        } = this.props

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

        // Inject media information in cart item array
        let cartItemsWithMedia = cartItemArray.map(item => {
            // Find corresponding item in siteData
            let itemInfo = productArray.find(prod => prod.id === item.itemId)
            // Reassign object in original array
            if (typeof (itemInfo) !== "undefined") {
                return Object.assign({}, item, {
                    media: itemInfo.media,
                    localMedia: itemInfo.localMedia
                })
            }
            return item
        })

        // Track total bill
        let subTotal = 0.0

        return (this.state.doingRemoteRequest ?
            <Grid container justify="center">
                <CircularProgress style={{ margin: spacing.unit * 2 }} size={50} />
            </Grid>
            : (this.state.errorStatus ?
                <Typography variant="title" align="center" color="primary">
                    <br />
                        Erro de servidor :(
                    <br />
                    {this.state.errorText}
                </Typography>
                :
                <div>
                    {/* Table */}
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Item da loja</CustomTableCell>
                                    <CustomTableCell numeric>Unidades</CustomTableCell>
                                    <CustomTableCell numeric>Preço (R$)</CustomTableCell>
                                    <CustomTableCell numeric>Ação</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItemsWithMedia.map((item, index) => {
                                    subTotal = subTotal + parseFloat(item.itemPrice) * parseInt(item.itemAmount, 10)

                                    return (
                                        <TableRow className={classes.row} key={index}>
                                            <CustomTableCell component="th" scope="row">
                                                {/* <div className={classes.chipRoot}> */}
                                                <Chip
                                                    avatar={
                                                        <Avatar
                                                            alt="Imagem do produto"
                                                            src={item.localMedia ? require(`${item.media}`) : item.media}
                                                            className={classes.bigAvatar}
                                                        />}
                                                    label={item.itemName}
                                                    className={classes.chip}
                                                />
                                                {/* </div> */}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>{item.itemAmount}</CustomTableCell>
                                            <CustomTableCell numeric>{parseFloat(item.itemPrice) * parseInt(item.itemAmount, 10)}</CustomTableCell>
                                            <CustomTableCell numeric>
                                                <Button color="secondary" className={classes.tButton}
                                                    onClick={() => { onSetSelected(item.itemId); onLaunchDialog(true, "remove") }}>
                                                Remover
                                                </Button>
                                            </CustomTableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow className={classes.row}>
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
                                        <Button color="primary" className={classes.tButton}
                                            onClick={() => { onLaunchDialog(true, "commit") }}>
                                        Finalizar Compra
                                        </Button>
                                    </CustomTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>

                    {/* In case of empty list */}
                    {(cartItemArray.length === 0) &&
                        <Typography variant="title" align="center" color="primary">
                            <br />
                            Seu carrinho de compras está vazio :(
                        </Typography>
                    }

                    {/* Floating return button */}
                    <Button variant="fab" color="primary"
                        onClick={() => onChangeCurrentView("shop")}
                        className={classes.fab}
                    >
                        <Icon>arrow_back</Icon>
                    </Button>
                </div>
            )
        )
    }
}
const ShoppingCartPropTypes = {
    // style
    classes: PropTypes.object,

    // inherited state (SUPPLY THESE)
    cartItemArray: PropTypes.arrayOf(
        PropTypes.shape({
            itemId: PropTypes.number.isRequired,
            itemName: PropTypes.string.isRequired,
            itemPrice: PropTypes.number.isRequired,
            itemAmount: PropTypes.number.isRequired,
        })
    ).isRequired,
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
    currentUserEmail: PropTypes.string.isRequired,

    // inherited actions (SUPPLY THESE)
    onChangeCurrentView: PropTypes.func.isRequired,
    onGetUserShoppingCart: PropTypes.func.isRequired,
    onGetProductList: PropTypes.func.isRequired, // TODO DITCH THIS!!!
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}
const PetShopShoppingCart = withStyles(styles)(WrappedShoppingCart)
WrappedShoppingCart.propTypes = ShoppingCartPropTypes
PetShopShoppingCart.propTypes = ShoppingCartPropTypes


/*
    Appointment table list for all user views
 */
class WrappedAppointmentList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorText: "",
            errorStatus: false,
            doingRemoteRequest: false,
        }
    }

    componentDidMount() {
        // Begin remote request
        this.setState({
            doingRemoteRequest: true,
        })

        // Appointments depend on pets, so query these first
        Axios.get(Root + "/" + this.props.currentUserEmail + "/pets")
            .then(response => {
                if (response.data.ok) {
                    this.props.onGetUserAnimals(response.data.animals)

                    // Then, actually query the user appointments
                    Axios.get(Root + "/" + this.props.currentUserEmail + "/appointments")
                        .then(response => {
                            if (response.data.ok) {
                                this.setState({
                                    errorText: "",
                                    errorStatus: false,
                                    doingRemoteRequest: false,
                                })
                                this.props.onGetUserAppointments(response.data.appointments)
                            } else {
                                this.setState({
                                    errorStatus: true,
                                    errorText: response.data.error,
                                    doingRemoteRequest: false,
                                })
                            }
                        })
                        .catch(error => {
                            this.setState({
                                errorStatus: true,
                                errorText: error.message,
                                doingRemoteRequest: false,
                            })
                        })
                } else {
                    this.setState({
                        errorStatus: true,
                        errorText: response.data.error,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorText: error.message,
                    doingRemoteRequest: false,
                })
            })
    }

    render() {
        const {
            classes,
            animalArray,
            appointmentArray,
            onChangeCurrentView,
            onLaunchDialog,
            onSetSelected,
        } = this.props

        // Just inline this I don't really care
        const CustomTableCell = withStyles(theme => ({
            head: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            body: {
                fontSize: 14,
            },
        }))(TableCell)

        // Inject media information in appointment array
        let appointmentsWithMedia = appointmentArray.map(item => {
        // Find corresponding item in siteData
            let itemInfo = animalArray.find(pet => pet.id === item.animalId)
            // Reassign object in original array
            if (typeof(itemInfo) !== "undefined") {
                return Object.assign({}, item, {
                    media: itemInfo.media,
                    localMedia: itemInfo.localMedia
                })
            }
            return item
        })

        return (this.state.doingRemoteRequest ?
            <Grid container justify="center">
                <CircularProgress style={{ margin: spacing.unit * 2 }} size={50} />
            </Grid>
            : (this.state.errorStatus ?
                <Typography variant="title" align="center" color="primary">
                    <br />
                        Erro de servidor :(
                    <br />
                    {this.state.errorText}
                </Typography>
                :
                <div>
                    {/* The actual table */}
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Serviço</CustomTableCell>
                                    <CustomTableCell numeric>Nome do pet</CustomTableCell>
                                    <CustomTableCell numeric>Data e hora marcados</CustomTableCell>
                                    <CustomTableCell numeric>Estado do pedido</CustomTableCell>
                                    <CustomTableCell numeric>Ação</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentsWithMedia.map((item, index) => {
                                    const dateOptions = {
                                        hour: "numeric",
                                        minute: "numeric",
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric"
                                    }

                                    return (
                                        <TableRow className={classes.row} key={index}>
                                            <CustomTableCell component="th" scope="row">
                                                {item.serviceName}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>
                                                {/* <div className={classes.chipRoot}> */}
                                                <Chip
                                                    avatar={
                                                        <Avatar
                                                            alt="Imagem do produto"
                                                            src={item.localMedia ? require(`${item.media}`) : item.media}
                                                            className={classes.bigAvatar}
                                                        />}
                                                    label={item.animalName}
                                                    className={classes.chip}
                                                />
                                                {/* </div> */}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>
                                                {moment(item.date).toDate().toLocaleDateString("pt-BR", dateOptions)}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>
                                                {(item.status === "approved") &&
                                                    <Typography color="primary">
                                                        Aprovada
                                                    </Typography>
                                                }
                                                {(item.status === "pending") &&
                                                    <Typography color="default">
                                                        Pendente
                                                    </Typography>
                                                }
                                                {(item.status === "revoked") &&
                                                    <Typography color="secondary">
                                                        Indeferida
                                                    </Typography>
                                                }
                                            </CustomTableCell>
                                            <CustomTableCell numeric>
                                                <Button color="primary" className={classes.tButton}
                                                    onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "inspect") }}>
                                                    Ver Mais
                                                </Button>
                                                <Button color="secondary" className={classes.tButton}
                                                    onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "remove") }}>
                                                    Remover
                                                </Button>
                                            </CustomTableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Paper>

                    {/* In case of empty list */}
                    {(appointmentArray.length === 0) &&
                        <Typography variant="title" align="center" color="primary">
                            <br />
                            Você não possui agendamentos no momento :(
                        </Typography>
                    }

                    {/* Floating return button */}
                    <Button variant="fab" color="primary"
                        onClick={() => onChangeCurrentView("services")}
                        className={classes.fab}
                    >
                        <Icon>arrow_back</Icon>
                    </Button>
                </div>
            )
        )
    }
}
const AppointmentListPropTypes = {
    // style
    classes: PropTypes.object,

    // inherited state (SUPPLY THESE)
    animalArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            race: PropTypes.string.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,
    appointmentArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            serviceId: PropTypes.number.isRequired,
            serviceName: PropTypes.string.isRequired,
            animalId: PropTypes.number.isRequired,
            animalName: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // inherited actions (SUPPLY THESE)
    onGetUserAppointments: PropTypes.func.isRequired,
    onGetUserAnimals: PropTypes.func.isRequired,
    onChangeCurrentView: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}
const PetShopAppointmentList = withStyles(styles)(WrappedAppointmentList)
WrappedAppointmentList.propTypes = AppointmentListPropTypes
PetShopAppointmentList.propTypes = AppointmentListPropTypes


/*
    User table list for the supervisor view
 */
const PetShopUserList = withStyles(styles)(props => {
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

    // Inject access information in customer array
    let fullCustomerInfo = props.customerData.map(cust => {
        // Find corresponding item in UACData
        let userInfo = props.UACData.find(user => user.email === cust.email)
        // Reassign object in original array
        return Object.assign({}, cust, {
            rights: userInfo.rights,
        })
    })

    return (
        <div>
            {/* Table */}
            <Paper className={props.classes.root}>
                <Table className={props.classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Nome completo</CustomTableCell>
                            <CustomTableCell numeric>E-mail</CustomTableCell>
                            <CustomTableCell numeric>Nível de acesso</CustomTableCell>
                            <CustomTableCell numeric>Ação</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fullCustomerInfo.map((customer, index) => {
                            const isMe = (customer.email === props.currentUserEmail)
                            const isMeString = isMe ? " (você)" : ""
                            return (
                                <TableRow className={props.classes.row} key={index}>
                                    <CustomTableCell component="th" scope="row">
                                        {customer.name + isMeString}
                                    </CustomTableCell>
                                    <CustomTableCell numeric>{customer.email}</CustomTableCell>
                                    <CustomTableCell numeric>{customer.rights}</CustomTableCell>
                                    <CustomTableCell numeric>
                                        <Button color="primary" className={props.classes.tButton} disabled={isMe}
                                            onClick={() => { props.onSetSelected(customer.email); props.onLaunchDialog(true, "edit") }}
                                        >
                                            Editar
                                        </Button>
                                        <Button color="secondary" className={props.classes.tButton} disabled={isMe}
                                            onClick={() => { props.onSetSelected(customer.email); props.onLaunchDialog(true, "remove") }}
                                        >
                                            Remover
                                        </Button>
                                    </CustomTableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>

            {/* Floating return button */}
            <Button variant="fab" color="primary"
                onClick={() => props.onLaunchDialog(true, "add")}
                className={props.classes.fab}
            >
                <AddIcon />
            </Button>
        </div>
    )
})

PetShopUserList.propTypes = {
    // style
    classes: PropTypes.object,

    // inherited state (SUPPLY THESE)
    UACData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            rights: PropTypes.string.isRequired,
            password: PropTypes.string,
        })
    ).isRequired,
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object),
            appointments: PropTypes.arrayOf(PropTypes.object),
            shoppingCart: PropTypes.arrayOf(PropTypes.object)
        })
    ).isRequired,

    // inherited actions (SUPPLY THESE)
    currentUserEmail: PropTypes.string.isRequired, // TODO Pass this
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired, // <<<<<<<< SETS A STRING, NOT A NUMBER!!!! >>>>>>>>
}

export { PetShopAppointmentList, PetShopShoppingCart, PetShopUserList }
