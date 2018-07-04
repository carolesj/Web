import Typography from "@material-ui/core/Typography"
import { PropTypes } from "prop-types"
import React from "react"
import { PetShopProductList } from "./PetShopCardViews"
import { PetShopShoppingCart } from "./PetShopCompactViews"


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
        <div>
            <PetShopShoppingCart
                cartItemArray={itemArray}
                productArray={props.siteData.products}
                onChangeCurrentView={(nextView) => props.onChangeCurrentView(nextView)}
                onLaunchDialog={(open, mode) => props.onLaunchDialog(open, mode)}
                onSetSelected={(id) => props.onSetSelected(id)}
            />
            {(itemArray.length === 0) &&
            <Typography variant="title" align="center" color="primary">
                <br />
                Seu carrinho de compras está vazio :(
            </Typography>
            }
        </div>
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