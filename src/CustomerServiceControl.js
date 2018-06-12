import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import Grid from "@material-ui/core/Grid"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import classNames from "classnames"
import { DateTimePicker } from "material-ui-pickers"
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider"
import MomentUtils from "material-ui-pickers/utils/moment-utils"
import moment from "moment"
import BRLocale from "moment/locale/pt-br"
import { PropTypes } from "prop-types"
import React from "react"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"

moment.locale("pt-br")
const styles = theme => ({
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
    textField: {
        marginLeft: 2 * theme.spacing.unit,
        marginRight: 2 * theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        width: 250,
    },
})


/*
    Service control sub-component
 */
class CustomerServiceControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // error reporting
            errorStatus: false,
            errorMessage: "",
            // state trackers
            dateTimePickerValue: moment(),
            servicePickerValue: "",
            petPickerValue: "",
        }
    }


    /*
        LOCAL UI STATE CONTROLLERS
     */
    handleChangeFieldValue(prop) {
        if (prop === "dateTimePickerValue") {
            return dateTime => this.setState({
                [prop]: dateTime,
            })
        } else {
            return event => this.setState({
                [prop]: event.target.value,
            })
        }
    }

    handleCloseDialog() {
        this.setState({
            // error
            errorStatus: false,
            errorMessage: "",
            // state
            dateTimePickerValue: moment(),
            servicePickerValue: "",
            petPickerValue: "",
        })
        this.props.onLaunchDialog(false)
    }


    /*
        REDUX STORE DISPATCH WRAPPERS
     */
    handleClickConfirmAddAppointment() {
        // Fetch service data
        let stageServiceId = this.state.servicePickerValue
        let stageService = this.props.siteData.services.find(service => (service.id === stageServiceId))
        if (typeof(stageService) === "undefined") {
            this.setState({
                errorStatus: true,
                errorMessage: "Por favor escolha um serviço"
            })
            return
        }
        let stageServiceName = stageService.name

        // Fetch customer pet data
        let stagePetId = this.state.petPickerValue
        let stagePet = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
            .animals.find(pet => (pet.id === stagePetId))
        if (typeof(stagePet) === "undefined") {
            this.setState({
                errorStatus: true,
                errorMessage: "Por favor escolha um pet"
            })
            return
        }
        let stagePetName = stagePet.name

        // Prepare remaining data
        let stageDate = this.state.dateTimePickerValue
        let stageStatus = "pending"
        let stageMessage = ""

        // Dispatch add appointment action
        this.props.onConfirmAddAppointment(this.props.currentUserEmail, {
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
        this.props.onConfirmRemoveAppointment(this.props.currentUserEmail, {
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


            dialogTitle = "Marcar Novo Agendamento"

            dialogContent = (
                <div>
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
                                    onChange={this.handleChangeFieldValue("petPickerValue")}
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
                                onChange={this.handleChangeFieldValue("servicePickerValue")}
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
                            <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale={BRLocale}>
                                <div className="picker">
                                    <DateTimePicker
                                        autoOk
                                        disablePast
                                        ampm={false}
                                        className={classes.textField}
                                        value={this.state.dateTimePickerValue}
                                        onChange={this.handleChangeFieldValue("dateTimePickerValue")}
                                        label="Agendamento"
                                    />
                                </div>
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                </div>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => this.handleClickConfirmAddAppointment()} color="primary"
                        disabled={(customerPetArray.length === 0)}>
                        Confirmar
                    </Button>
                </div>
            )
            // Dialog UI for inspecting running appointment
        } else if (this.props.dialogMode === "inspect") {

            // Fetch service data
            const serviceData = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .appointments.find(appoint => (appoint.id === this.props.selectedId))

            // Fetch customer pet data
            const customerPet = this.props.customerData.find(customer => (customer.email === this.props.currentUserEmail))
                .animals.find(pet => (pet.id === serviceData.animalId))


            dialogTitle = "Informações do Agendamento"

            dialogContent = (
                <div>
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
                                {serviceData.date.format()}
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
                </div>
            )

            dialogActions = (
                <Button onClick={() => this.handleCloseDialog()} color="primary">
                    Ok
                </Button>
            )

            // Dialog UI for removing existing appointment
        } else if (this.props.dialogMode === "remove") {
            dialogTitle = "Remover Agendamento"

            dialogContent = (
                <div>
                    <DialogContentText align="center">
                        {"Tem certeza que deseja remover o agendamento marcado?"}
                    </DialogContentText>
                </div>
            )

            dialogActions = (
                <div>
                    <Button onClick={() => this.handleClickConfirmRemoveAppointment()} color="secondary">
                        Confirmar
                    </Button>
                    <Button onClick={() => this.handleCloseDialog()} color="primary">
                        Cancelar
                    </Button>
                </div>
            )
        }

        return (
            <PetShopResponsiveDialog
                isOpen={this.props.dialogOpen}
                onClose={() => this.handleCloseDialog()}
                ariaLabel="service-control-dialog"
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                errorStatus={this.state.errorStatus}
                errorText={this.state.errorMessage}
            />
        )
    }
}

CustomerServiceControl.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // inherited sate (SUPPLY THESE)
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
    onConfirmAddAppointment: PropTypes.func.isRequired,
    onConfirmRemoveAppointment: PropTypes.func.isRequired,
}

export default withStyles(styles)(CustomerServiceControl)