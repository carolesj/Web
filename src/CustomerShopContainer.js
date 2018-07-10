import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerShopControl from "./CustomerShopControl"
import CustomerShopView from "./CustomerShopView"
import { addToCart, changeCurrentView, commitOnPurchase, editCartItem, removeFromCart, getProducts, getUserShoppingCart } from "./StoreActions"

class CustomerShopContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // TODO Define possible values as constants for this
            selectedId: 0,     // Id of product selected for "add to/remove from cart" or "commit purchase" operations
        }
    }

    handleLaunchDialog(open, mode = null) {
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
        const {
            siteData,
            customerData,
            currentUserView,
            currentUserEmail,
            handleConfirmAddItem,
            handleConfirmEditItem,
            handleConfirmRemoveItem,
            handleConfirmCommitPurchase,
            handleGetUserShoppingCart,
            handleGetProductList,
            handleChangeCurrentView
        } = this.props

        return (
            <div>
                <CustomerShopView
                    siteData={siteData}
                    customerData={customerData}
                    currentUserView={currentUserView}
                    currentUserEmail={currentUserEmail}
                    onSetSelected={(id) => this.handleSetSelected(id)}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onChangeCurrentView={(nextView) => handleChangeCurrentView(nextView)}
                    onGetUserShoppingCart={handleGetUserShoppingCart}
                    onGetProductList={handleGetProductList}
                />
                <CustomerShopControl
                    siteData={siteData}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onConfirmAddItem={(userEmail, itemData) => handleConfirmAddItem(userEmail, itemData)}
                    onConfirmEditItem={(userEmail, itemData) => handleConfirmEditItem(userEmail, itemData)}
                    onConfirmRemoveItem={(userEmail, itemData) => handleConfirmRemoveItem(userEmail, itemData)}
                    onConfirmCommitPurchase={(userEmail, shoppingCart) => handleConfirmCommitPurchase(userEmail, shoppingCart)}
                />
            </div>
        )
    }
}

CustomerShopContainer.propTypes = {
    // store state
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
    currentUserRights: PropTypes.string.isRequired,

    // store customer actions
    handleConfirmAddItem: PropTypes.func.isRequired,
    handleConfirmEditItem: PropTypes.func.isRequired,
    handleConfirmRemoveItem: PropTypes.func.isRequired,
    handleConfirmCommitPurchase: PropTypes.func.isRequired,

    // store common actions
    handleChangeCurrentView: PropTypes.func.isRequired,
    handleGetUserShoppingCart: PropTypes.func.isRequired,
    handleGetProductList: PropTypes.func.isRequired,
}


function mapStateToProps(state) {
    return {
        currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        currentUserRights: state.currentUserRights,
        //currentUserLoggedIn: state.currentUserLoggedIn,
        customerData: state.CustomerData,
        siteData: state.SiteData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Customer controls
        handleConfirmAddItem: (userEmail, itemData) => {
            dispatch(addToCart(userEmail, itemData))
        },
        handleConfirmEditItem: (userEmail, itemData) => {
            dispatch(editCartItem(userEmail, itemData))
        },
        handleConfirmRemoveItem: (userEmail, itemData) => {
            dispatch(removeFromCart(userEmail, itemData))
        },
        handleConfirmCommitPurchase: (userEmail) => {
            dispatch(commitOnPurchase(userEmail))
        },
        // General controls
        handleChangeCurrentView: nextView => {
            dispatch(changeCurrentView(nextView))
        },
        handleGetUserShoppingCart: shoppingCart => {
            dispatch(getUserShoppingCart(shoppingCart))
        },
        handleGetProductList: products => {
            dispatch(getProducts(products))
        }
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(CustomerShopContainer)