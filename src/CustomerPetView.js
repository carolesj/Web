import { PropTypes } from "prop-types"
import React from "react"
import { PetShopPetList } from "./PetShopCardViews"
import { Typography } from "@material-ui/core"

function CustomerPetView(props) {
    // current user's pet information (at this point it WILL EXIST)
    const userPetArray = props.customerData.find(cust => (cust.email === props.currentUserEmail)).animals

    return ((userPetArray.length > 0) ? 
        <PetShopPetList
            animalArray={userPetArray}
            currentUserRights={"customer"} // Encapsulated in this module
            onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
            onSetSelected={(id) => props.onSetSelected(id)}
        />
        :
        <Typography variant="title" align="center" color="primary">
            <br />
            Você não possui pets cadastrados :(
        </Typography>
    )
}

CustomerPetView.propTypes = {
    // inherited state (SUPPLY THESE)
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // inherited actions (SUPPLY THESE)
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}

export default CustomerPetView