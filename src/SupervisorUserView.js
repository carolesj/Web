import { PropTypes } from "prop-types"
import React from "react"
import { PetShopUserList } from "./PetShopCompactViews"

function SupervisorUserView(props) {
    return(
        <PetShopUserList
            UACData={props.UACData}
            customerData={props.customerData}
            currentUserEmail={props.currentUserEmail}
            onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
            onSetSelected={(email) => props.onSetSelected(email)}
        />
    )
}

SupervisorUserView.propTypes = {
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
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // inherited actions (SUPPLY THESE)
    onSetSelected: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
}

export default SupervisorUserView