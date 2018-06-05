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
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import ptLocale from "date-fns/locale/pt"
import { DateTimePicker } from "material-ui-pickers"
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider"
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { addAppointment, removeAppointment } from "./StoreActions"


const styles = theme => ({
    // Service list
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

    // Appointment list
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
        marginLeft: 2 * theme.spacing.unit,
        marginRight: 2 * theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        width: 250,
    },

    // Appointment control
    menu: {
        width: 200,
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
    Service list sub-component
 */
function ServiceList(props) {
    const { classes } = props

    return (
        <div className={classes.listRoot}>
            <Grid container spacing={24} justify="flex-start">
                {props.siteData.services.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
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
                                <Typography gutterBottom component="p">
                                    {item.description}
                                </Typography>
                                {item.available ?
                                    <Typography variant="body1" align="right">
                                        <br />
                                        Disponível para agendamento
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" align="right">
                                        <br />
                                        Serviço indisponível
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                <Grid container justify="flex-end">
                                    <Grid item>
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
                                    </Grid>
                                </Grid>
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

    // Fetch and prepare the data
    let data = props.customerData.find(customer => (customer.email === props.currentUserEmail)).appointments
    let timeOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
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
                                    <CustomTableCell numeric>Data e Hora Marcados</CustomTableCell>
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
                                                {item.date.toLocaleTimeString("pt-BR", timeOptions)}
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
                                                    onClick={() => { props.onSetSelected(item.id); props.onToggleDialog(true, "inspect") }}>
                                                    Ver Mais
                                                </Button>
                                                <Button color="secondary" className={classes.tableButton}
                                                    onClick={() => { props.onSetSelected(item.id); props.onToggleDialog(true, "remove") }}>
                                                    Remover
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
    Service control sub-component
 */
class AppointmentControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorStatus: false,
            errorMessage: "",
            dateTimePickerValue: new Date(),
            servicePickerValue: 0,
            petPickerValue: 0,
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleDateTimeChange(dateTime) {
        this.setState({
            dateTimePickerValue: dateTime,
        })
    }

    handlePetPickerChange(event) {
        this.setState({
            petPickerValue: event.target.value,
        })
    }

    handleServicePickerChange(event) {
        this.setState({
            servicePickerValue: event.target.value,
        })
    }

    handleCloseDialog() {
        this.setState({
            errorStatus: false,
            errorMessage: "",
            dateTimePickerValue: new Date(),
            servicePickerValue: 0,
            petPickerValue: 0,
        })
        this.props.onToggleDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS
     */
    handleClickConfirmAddAppointment() {
        // Fetch service data
        let stageServiceId = this.state.servicePickerValue
        let stageServiceName = this.props.siteData.services.find(service => (service.id === stageServiceId)).name

        // Fetch customer pet data
        let stagePetId = this.state.petPickerValue
        let stagePetName = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
            .animals.find(pet => (pet.id === stagePetId)).name

        // Prepare remaining data
        let stageDate = this.state.dateTimePickerValue
        let stageStatus = "pending"
        let stageMessage = ""

        // Dispatch add appointment action
        this.props.onClickConfirmAddAppointment(this.props.currentUserEmail, {
            serviceId: stageServiceId,
            serviceName: stageServiceName,
            animalId: stagePetId,
            animalName: stagePetName,
            date: stageDate,
            status: stageStatus,
            message: stageMessage,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }

    handleClickConfirmRemoveAppointment() {
        // Just dispatch remove appointment action
        this.props.onClickConfirmRemoveAppointment(this.props.currentUserEmail, {
            id: this.props.selectedId,
        })

        // Close dialog on success
        this.handleCloseDialog()
    }


    /*
        RENDER FUNCTION
     */
    render() {
        let dialogContent = null
        let dialogActions = null
        const { classes } = this.props

        // Dialog UI for adding new appointment
        if (this.props.dialogMode === "add") {

            // Fetch service array
            const serviceArray = this.props.siteData.services.map(service => {
                return {
                    value: service.id,
                    label: service.name,
                }
            })

            // Fetch current user pet array
            const customerPetArray = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .animals.map(pet => {
                    return {
                        value: pet.id,
                        label: pet.name,
                    }
                })

            // Fetch full customer pet object (can be undefined)
            const customerPet = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .animals.find(pet => (pet.id === this.state.petPickerValue))

            dialogContent = (
                <DialogContent>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            {(typeof (customerPet) !== "undefined") &&
                                <Avatar
                                    alt="Imagem do pet selecionado"
                                    src={customerPet.localMedia ? require(`${customerPet.media}`) : customerPet.media}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                            }
                        </Grid>
                        <Grid item>
                            {(customerPetArray.length > 0) ?
                                <TextField
                                    id="select-pet"
                                    label="Selecione o Pet"
                                    select
                                    className={classes.textField}
                                    value={this.state.petPickerValue}
                                    onChange={event => this.handlePetPickerChange(event)}
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu
                                        },
                                    }}
                                    margin="normal" >
                                    {customerPetArray.map((option, index) => (
                                        <MenuItem key={index} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                :
                                <TextField
                                    id="select-pet"
                                    label="Não existem pets cadastrados"
                                    disabled
                                    error
                                    className={classes.textField}
                                    margin="normal" >
                                </TextField>
                            }
                        </Grid>
                        <Grid item>
                            <TextField
                                id="select-service"
                                label="Selecione o Serviço"
                                select
                                className={classes.textField}
                                value={this.state.servicePickerValue}
                                onChange={event => this.handleServicePickerChange(event)}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu
                                    },
                                }}
                                margin="normal" >
                                {serviceArray.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                                <div className="picker">
                                    <DateTimePicker
                                        autoOk
                                        disablePast
                                        ampm={false}
                                        className={classes.textField}
                                        value={this.state.dateTimePickerValue}
                                        onChange={dateTime => this.handleDateTimeChange(dateTime)}
                                        label="Agendamento"
                                    />
                                </div>
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                </DialogContent>
            )

            dialogActions = (
                <Button onClick={() => this.handleClickConfirmAddAppointment()} color="primary"
                    disabled={(customerPetArray.length === 0)}>
                    Confirmar
                </Button>
            )
            // Dialog UI for inspecting running appointment
        } else if (this.props.dialogMode === "inspect") {

            // Fetch service data
            const serviceData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .appointments.find(appoint => (appoint.id === this.props.selectedId))

            // Fetch customer pet data
            const customerPet = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .animals.find(pet => (pet.id === serviceData.animalId))

            dialogContent = (
                <DialogContent>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            {(typeof (customerPet) !== "undefined") &&
                                <Avatar
                                    alt="Imagem do pet selecionado"
                                    src={customerPet.localMedia ? require(`${customerPet.media}`) : customerPet.media}
                                    className={classNames(this.props.classes.avatar, this.props.classes.bigAvatar)}
                                />
                            }
                        </Grid>
                        <Grid item>
                            <br />
                            <Typography align="center" color="primary" variant="body2">
                                Seu pet
                            </Typography>
                            <Typography align="center" color="secondary" variant="body2">
                                {customerPet.name}
                            </Typography>
                            <br />
                            <Typography align="center" color="primary" variant="body2">
                                Serviço
                            </Typography>
                            <Typography align="center" color="secondary" variant="body2">
                                {serviceData.serviceName}
                            </Typography>
                            <br />
                            <Typography align="center" color="primary" variant="body2">
                                Data/Hora
                            </Typography>
                            <Typography align="center" color="secondary" variant="body2">
                                {serviceData.date.toLocaleTimeString("pt-BR")}
                            </Typography>
                            <br />
                            <Typography align="center" color="primary" variant="body2">
                                Mensagem do admin
                            </Typography>
                            <Typography align="center" color="secondary" variant="body2">
                                {serviceData.message}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            )

            // Dialog UI for removing existing appointment
        } else if (this.props.dialogMode === "remove") {
            dialogContent = (
                <DialogContent>
                    <DialogContentText align="center">
                        {"Tem certeza que deseja remover o agendamento marcado?"}
                    </DialogContentText>
                </DialogContent>
            )

            dialogActions = (
                <Button onClick={() => this.handleClickConfirmRemoveAppointment()} color="secondary">
                    Confirmar
                </Button>
            )
        }

        return (
            <div>
                <Dialog open={this.props.dialogOpen} aria-labelledby="appoint-control-dialog-title"
                    onClose={() => this.handleCloseDialog()}>

                    <DialogTitle id="appoint-control-dialog-title">
                        {(this.props.dialogMode === "add") &&
                            "Marcar Agendamento"
                        }
                        {(this.props.dialogMode === "remove") &&
                            "Remover Agendamento"
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
                        {this.props.dialogMode === "inspect" ?
                            <Button onClick={() => this.handleCloseDialog()} color="primary">
                                Ok
                            </Button>
                            :
                            <Button onClick={() => this.handleCloseDialog()} color="primary">
                                Cancelar
                            </Button>
                        }
                        {dialogActions}
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

AppointmentControl.propTypes = {
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
    onClickConfirmAddAppointment: PropTypes.func.isRequired,
    onClickConfirmRemoveAppointment: PropTypes.func.isRequired,
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
                {(this.props.currentUserView === "appointments") &&
                    <AppointmentList classes={this.props.classes}
                        customerData={this.props.customerData}
                        currentUserEmail={this.props.currentUserEmail}
                        onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                        onSetSelected={id => this.handleSetSelected(id)} />
                }
                <AppointmentControl classes={this.props.classes}
                    siteData={this.props.siteData}
                    customerData={this.props.customerData}
                    currentUserEmail={this.props.currentUserEmail}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onClickConfirmAddAppointment={(userEmail, appointData) =>
                        this.props.onClickConfirmAddAppointment(userEmail, appointData)}
                    onClickConfirmRemoveAppointment={(userEmail, appointData) =>
                        this.props.onClickConfirmRemoveAppointment(userEmail, appointData)} />
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