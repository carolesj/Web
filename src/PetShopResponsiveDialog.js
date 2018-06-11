import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import PropTypes from "prop-types"
import React from "react"

function PetShopResponsiveDialog(props) {
    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            fullScreen={props.fullScreen}
            aria-labelledby={props.ariaLabel}
        >
            <DialogTitle id={props.ariaLabel}>
                {props.dialogTitle}                
            </DialogTitle>

            <DialogContent>
                {props.dialogContent}
                {props.errorStatus &&
                    <DialogContentText align="center" color="primary">
                        {props.errorText}
                    </DialogContentText>
                }
            </DialogContent>

            <DialogActions>
                {props.dialogActions}
            </DialogActions>
        </Dialog>
    )
}

PetShopResponsiveDialog.propTypes = {
    // mui state
    fullScreen: PropTypes.bool.isRequired,

    // inherited state
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    // inherited elements
    ariaLabel: PropTypes.string.isRequired,
    dialogTitle: PropTypes.string.isRequired,
    dialogContent: PropTypes.element.isRequired,
    dialogActions: PropTypes.element.isRequired,

    // error related
    errorStatus: PropTypes.bool.isRequired,
    errorText: PropTypes.string.isRequired,
}

export default withMobileDialog()(PetShopResponsiveDialog)