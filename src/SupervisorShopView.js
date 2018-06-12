import { PropTypes } from "prop-types"
import React from "react"
import { PetShopProductList } from "./PetShopCardViews"

function SupervisorShopView(props) {

    // At this point, the view is either "shop" or "shoppingCart"
    return(
        <PetShopProductList
            productArray={props.siteData.products}
            currentUserRights={"supervisor"} // Encapsulated in this module
            onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
            onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
            onSetSelected={(id) => props.onSetSelected(id)}
        />
    )
}

SupervisorShopView.propTypes = {
    // inherited state (SUPPLY THESE)
    siteData: PropTypes.object.isRequired,

    // inherited actions (SUPPLY THESE)
    onSetSelected: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onChangeCurrentView: PropTypes.func.isRequired,
}

export default SupervisorShopView