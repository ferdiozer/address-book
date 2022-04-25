
import {
    LOGIN,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    REGISTER,
    REGISTER_ERROR,
    REGISTER_SUCCESS,
} from "../constants/actions";

import AuthServices from "../services/auth.services";
import { sleep } from "../helpers";

const tokenName = 'auth-token'


export const register = (postData) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatch({ type: REGISTER });
            const serverData = await AuthServices.register(postData)
            console.log("serverData", serverData)
            //  dispatch({ type: REGISTER_SUCCESS, payload: user });
            resolve(serverData)
        } catch (error) {
            console.log("[ERROR]", error)
            dispatch({ type: REGISTER_ERROR });
            reject(error)
        }
    });
};

export const login = (postData) => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatch({ type: LOGIN });
            const { result } = await AuthServices.login(postData)
            dispatch({ type: LOGIN_SUCCESS, payload: result });
            localStorage.setItem(tokenName, result._id)
            resolve(result)
        } catch (error) {
            console.log("[ERROR]", error)
            dispatch({ type: LOGIN_ERROR });
            reject(error)
        }
    });
};

export const setUser = (user) => async (dispatch) => {
    dispatch({ type: LOGIN_SUCCESS, payload: user });
}

export const getMe = () => async (dispatch) => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatch({ type: LOGIN });
            const { result } = await AuthServices.me()
            console.log(":test:getMeProfile:!!!!!!USER::", result)

        } catch (error) {
            console.log("[ERROR]", error)
        }
    });
};

export const logout = () => async (dispatch) => {
    return new Promise(async (resolve) => {
        localStorage.removeItem(tokenName);
        dispatch({ type: LOGIN_ERROR });
        await sleep(2000)
        return resolve()
    });


    // const service = new Auth();
    // service.logout()

};
