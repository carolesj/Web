import { PropTypes } from "prop-types"
import React from "react"
import { PetShopServiceList } from "./PetShopCardViews"

function SupervisorServiceView(props) {

    // At this point, the view is either "services" or "appointments"
    return(
        <PetShopServiceList
            serviceArray={props.siteData.services}
            currentUserRights={"supervisor"} // Encapsulated in this module
            onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
            onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
            onSetSelected={(id) => props.onSetSelected(id)}
        />
    )
}

SupervisorServiceView.propTypes = {
    // inherited state (SUPPLY THESE)
    siteData: PropTypes.object.isRequired,

    // inherited actions (SUPPLY THESE)
    onChangeCurrentView: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}

export default SupervisorServiceView