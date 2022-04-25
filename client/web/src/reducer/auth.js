import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    RESET_AUTH,
    SET_USER,
    LOGOUT,
} from '../constants/actions';

//localStorage.getItem('auth-token')
export const initialState = {
    user: null,
    token: "",
    isLoggedIn: false,
    loading: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                loading: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                loading: false,
                isLoggedIn: true,
                token: action.payload._id,
                user: action.payload.user,
            };
        case LOGIN_ERROR:
            return {
                ...state,
                isLoggedIn: false,
                loading: false,
                user: null,
            };

        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                loading: false,
                user: null,
                token: ""
            };

        case SET_USER:
            return {
                ...state,
                loading: false,
                isLoggedIn: action.payload.isLoggedIn,
                user: action.payload,
            };

        case RESET_AUTH:
            return {
                initialState,
            };




        default:
            return state;
    }
};
