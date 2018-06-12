import Typography from "@material-ui/core/Typography"
import { PropTypes } from "prop-types"
import React from "react"
import { PetShopServiceList } from "./PetShopCardViews"
import { PetShopAppointmentList } from "./PetShopCompactViews"

function CustomerServiceView(props) {

    // Retrieve current user whole data object (WILL EXIST)
    let currentUserData = props.customerData.find(cust => cust.email === props.currentUserEmail)

    // At this point, the view is either "services" or "appointments"
    return((props.currentUserView === "services") ?
        <PetShopServiceList
            serviceArray={props.siteData.services}
            currentUserRights={"customer"} // Encapsulated in this module
            onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
            onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
            onSetSelected={(id) => props.onSetSelected(id)}
        />
        :
        (currentUserData.appointments.length > 0) ?
            <PetShopAppointmentList
                animalArray={currentUserData.animals}
                appointmentArray={currentUserData.appointments}
                currentUserEmail={props.currentUserEmail}
                currentUserRights={"customer"}
                onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
                onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
                onSetSelected={(id) => props.onSetSelected(id)}
            />
            :
            <Typography variant="title" align="center" color="primary">
                <br />
                Você não possui agendamentos no momento :(
            </Typography>
    )
}

CustomerServiceView.propTypes = {
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
    onChangeCurrentView: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}

export default CustomerServiceView