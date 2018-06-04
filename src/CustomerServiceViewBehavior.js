import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
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
import { addAppointment, removeAppointment } from "./StoreActions"

const styles = theme => ({
    // Service list
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

    // Appointment list
    tableRoot: {
        //width: "100%",
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        overflowX: "auto",
    },
    tableBody: {
        minWidth: 800,
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
    Service list sub-component
 */
function ServiceList(props) {
    // Destructure classes
    const { classes } = props

    return (
        <div className={classes.listRoot}>
            <Grid container spacing={24} justify="flex-start">
                {props.siteData.services.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={require(`${item.media}`)}
                                title={"Serviço de " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {item.name}
                                </Typography>
                                <Typography component="p">
                                    {item.description}
                                </Typography>
                                {item.available ?
                                    <Typography variant="body1" gutterBottom align="left">
                                        <br />
                                        Disponível para agendamento
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" gutterBottom align="left">
                                        <br />
                                        Serviço indisponível
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                {item.available ?
                                    <Button size="small" color="primary"
                                        onClick={() => { props.onSetSelected(item.id); props.onToggleDialog(true, "add") }}>
                                        Contratar
                                    </Button>
                                    :
                                    <Button disabled size="small" color="primary">
                                        Contratar
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

ServiceList.propTypes = {
    classes: PropTypes.object.isRequired,
    siteData: PropTypes.object.isRequired,
    onToggleDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}

/*
    Appointment list sub-component
 */
function AppointmentList(props) {
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
    let data = props.customerData.find(customer => (customer.email === props.currentUserEmail)).appointments

    // For generating text out of date info
    let timeOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }

    // Destructure classes
    const { classes } = props

    return (
        (data.length > 0) ?
            <Grid container spacing={24} direction="column" justify="flex-start" alignItems="stretch">
                <Grid item>
                    <Paper className={classes.tableRoot}>
                        <Table className={classes.tableBody}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Serviço</CustomTableCell>
                                    <CustomTableCell numeric>Nome do Pet</CustomTableCell>
                                    <CustomTableCell numeric>Data marcada</CustomTableCell>
                                    <CustomTableCell numeric>Estado da Requisição</CustomTableCell>
                                    <CustomTableCell numeric>Ação</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((item, index) => {
                                    return (
                                        <TableRow className={classes.row} key={index}>
                                            <CustomTableCell component="th" scope="row">
                                                {item.serviceName}
                                            </CustomTableCell>
                                            <CustomTableCell numeric>{item.animalName}</CustomTableCell>
                                            <CustomTableCell numeric>
                                                {(new Date(item.date)).toLocaleTimeString("pt-BR", timeOptions)}
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
                                                <Button color="primary" className={classes.tableButton}
                                                    onClick={() => { props.onSetSelected(item.itemId); props.onToggleDialog(true, "edit") }}>
                                                    Ver Mais
                                                </Button>
                                            </CustomTableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item>
                    <Button variant="raised" color="secondary" className={classes.confirmButton}
                        onClick={() => { }}>
                        Fazer Novo Agendamento
                    </Button>
                </Grid>
            </Grid>
            :
            <Typography variant="headline" align="center" color="secondary">
                <br />
                Não há nenhum agendamento corrente
            </Typography>
    )
}

AppointmentList.propTypes = {
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
class CustomerServiceViewBehavior extends React.Component {
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
                {(this.props.currentUserView === "services") &&
                    <ServiceList classes={this.props.classes}
                        siteData={this.props.siteData}
                        onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={id => this.handleSetSelected(id)} />
                }
                {(this.props.currentUserView === "myAppoints") &&
                    <AppointmentList classes={this.props.classes}
                        customerData={this.props.customerData}
                        currentUserEmail={this.props.currentUserEmail}
                        onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={id => this.handleSetSelected(id)} />
                }
                {/* TODO HERE */}
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
        onClickConfirmAddAppointment: (userEmail, appointData) => {
            dispatch(addAppointment(userEmail, appointData))
        },
        onClickConfirmRemoveAppointment: (userEmail, appointData) => {
            dispatch(removeAppointment(userEmail, appointData))
        },
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomerServiceViewBehavior))