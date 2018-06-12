/*
import { SupervisorActions } from './StoreActions';
   UAC action types
 */
export const CommonActions = {
    USER_SIGNIN: "USER_SIGNIN",
    USER_SIGNUP: "USER_SIGNUP",
    USER_LOGOUT: "USER_LOGOUT",
    CHANGE_CURRENT_VIEW: "CHANGE_CURRENT_VIEW"
}

/*
    Customer action types
 */
export const CustomerActions = {
    // Pet list control
    PET_ADD: "PET_ADD",
    PET_EDIT: "PET_EDIT",
    PET_REMOVE: "PET_REMOVE",

    // Edit profile
    PROFILE_EDIT: "PROFILE_EDIT",

    // Store interaction
    STORE_ADD_TO_CART: "STORE_ADD_TO_CART",
    STORE_EDIT_CART_ITEM: "STORE_EDIT_CART_ITEM",
    STORE_REMOVE_FROM_CART: "STORE_REMOVE_FROM_CART",
    STORE_COMMIT_ON_PURCHASE: "STORE_COMMIT_ON_PURCHASE",

    // Appointment control
    APPOINTMENT_ADD: "APPOINTMENT_ADD",
    APPOINTMENT_REMOVE: "APPOINTMENT_REMOVE"
}

/*
    Superisor action types
 */
export const SupervisorActions = {
    // User control
    USERCTL_ADD: "USERCTL_ADD",
    USERCTL_EDIT: "USERCTL_EDIT",
    USERCTL_REMOVE: "USERCTL_REMOVE",

    // Stock control
    STOCKCTL_ADD: "STOCKCTL_ADD",
    STOCKCTL_EDIT: "STOCKCTL_EDIT",
    STOCKCTL_REMOVE: "STOCKCTL_REMOVE",

    // Service control
    SERVICECTL_REG_ADD: "SERVICECTL_REG_ADD",
    SERVICECTL_REG_EDIT: "SERVICECTL_REG_EDIT",
    SERVICECTL_REG_REMOVE: "SERVICECTL_REG_REMOVE",

    // Appointment control
    SERVICECTL_EDIT: "SERVICECTL_EDIT",
    SERVICECTL_REMOVE: "SERVICECTL_REMOVE"
}

/*
   UAC action creators
 */
export function signUserIn(userData) {
    return {
        type: CommonActions.USER_SIGNIN,
        payload: { userData }
    }
}

export function signUserUp(userData) {
    return {
        type: CommonActions.USER_SIGNUP,
        payload: { userData }
    }
}

// TODO credentials may be unnecessary
export function logUserOut(userData) {
    return {
        type: CommonActions.USER_LOGOUT,
        payload: { userData }
    }
}

export function changeCurrentView(nextView) {
    return {
        type: CommonActions.CHANGE_CURRENT_VIEW,
        payload: { nextView }
    }
}

/*
   Customer action creators
 */
export function editUserProfile(userData) {
    return {
        type: CustomerActions.PROFILE_EDIT,
        payload: { userData }
    }
}

export function addPet(userEmail, petData) {
    return {
        type: CustomerActions.PET_ADD,
        payload: { userEmail, petData }
    }
}

export function editPet(userEmail, petData) {
    return {
        type: CustomerActions.PET_EDIT,
        payload: { userEmail, petData }
    }
}

export function removePet(userEmail, petData) {
    return {
        type: CustomerActions.PET_REMOVE,
        payload: { userEmail, petData }
    }
}

export function addToCart(userEmail, itemData) {
    return {
        type: CustomerActions.STORE_ADD_TO_CART,
        payload: { userEmail, itemData }
    }
}

export function editCartItem(userEmail, itemData) {
    return {
        type: CustomerActions.STORE_EDIT_CART_ITEM,
        payload: { userEmail, itemData }
    }
}

export function removeFromCart(userEmail, itemData) {
    return {
        type: CustomerActions.STORE_REMOVE_FROM_CART,
        payload: { userEmail, itemData }
    }
}

export function commitOnPurchase(userEmail, shoppingCart) {
    return {
        type: CustomerActions.STORE_COMMIT_ON_PURCHASE,
        payload: { userEmail, shoppingCart }
    }
}

export function addAppointment(userEmail, appointData) {
    return {
        type: CustomerActions.APPOINTMENT_ADD,
        payload: { userEmail, appointData }
    }
}

export function removeAppointment(userEmail, appointData) {
    return {
        type: CustomerActions.APPOINTMENT_REMOVE,
        payload: { userEmail, appointData }
    }
}

/*
   Supervisor action creators
 */
export function addUser(userData) {
    return {
        type: SupervisorActions.USERCTL_ADD,
        payload: { userData }
    }
}

export function editUser(userData) {
    return {
        type: SupervisorActions.USERCTL_EDIT,
        payload: { userData }
    }
}

export function removeUser(userData) {
    return {
        type: SupervisorActions.USERCTL_REMOVE,
        payload: { userData }
    }
}



export function addProduct(itemData) {
    return {
        type: SupervisorActions.STOCKCTL_ADD,
        payload: { itemData }
    }
}

export function editProduct(itemData) {
    return {
        type: SupervisorActions.STOCKCTL_EDIT,
        payload: { itemData }
    }
}


export function removeProduct(itemData) {
    return {
        type: SupervisorActions.STOCKCTL_REMOVE,
        payload: { itemData }
    }
}



export function sudoEditAppointment(userEmail, appointData) {
    return {
        type: SupervisorActions.SERVICECTL_EDIT,
        payload: { userEmail, appointData }
    }
}

export function sudoRemoveAppointment(userEmail, appointData) {
    return {
        type: SupervisorActions.SERVICECTL_REMOVE,
        payload: { userEmail, appointData }
    }
}



export function addService(serviceData) {
    return {
        type: SupervisorActions.SERVICECTL_REG_ADD,
        payload: { serviceData }
    }
}

export function editService(serviceData) {
    return {
        type: SupervisorActions.SERVICECTL_REG_EDIT,
        payload: { serviceData }
    }
}

export function removeService(serviceData) {
    return {
        type: SupervisorActions.SERVICECTL_REG_REMOVE,
        payload: { serviceData }
    }
}