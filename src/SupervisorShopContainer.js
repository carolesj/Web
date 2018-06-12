import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { addProduct, changeCurrentView, editProduct, removeProduct } from "./StoreActions"
import SupervisorShopControl from "./SupervisorShopControl"
import SupervisorShopView from "./SupervisorShopView"

class SupervisorShopContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // TODO Define possible values as constants for this
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
        const {
            siteData,
            customerData,
            currentUserEmail,
            currentUserRights,
            handleStockAddItem,
            handleStockEditItem,
            handleStockRemoveItem,
            handleChangeCurrentView
        } = this.props

        return (
            <div>
                <SupervisorShopView
                    siteData={siteData}
                    onSetSelected={(id) => this.handleSetSelected(id)}
                    onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onChangeCurrentView={(nextView) => handleChangeCurrentView(nextView)}
                />
                <SupervisorShopControl
                    siteData={siteData}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    currentUserRights={currentUserRights}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onConfirmStockAddItem={(itemData) => handleStockAddItem(itemData)}
                    onConfirmStockEditItem={(itemData) => handleStockEditItem(itemData)}
                    onConfirmStockRemoveItem={(itemData) => handleStockRemoveItem(itemData)}
                />
            </div>
        )
    }
}

SupervisorShopContainer.propTypes = {
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

    // store supervisor actions
    handleStockAddItem: PropTypes.func.isRequired,
    handleStockEditItem: PropTypes.func.isRequired,
    handleStockRemoveItem: PropTypes.func.isRequired,

    // store common actions
    handleChangeCurrentView: PropTypes.func.isRequired,
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
        // Supervisor controls
        handleStockAddItem: itemData => {
            dispatch(addProduct(itemData))
        },
        handleStockEditItem: itemData => {
            dispatch(editProduct(itemData))
        },
        handleStockRemoveItem: itemData => {
            dispatch(removeProduct(itemData))
        },
        // General controls
        handleChangeCurrentView: nextView => {
            dispatch(changeCurrentView(nextView))
        }
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(SupervisorShopContainer)
