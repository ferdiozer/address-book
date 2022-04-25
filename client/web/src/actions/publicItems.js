import {
    GET_FAQ_LIST,
    GET_FAQ_LIST_ERROR,
    GET_FAQ_LIST_SUCCESS,
    GET_TESTIMONIAL_LIST,
    GET_TESTIMONIAL_LIST_ERROR,
    GET_TESTIMONIAL_LIST_SUCCESS,
    SEND_APPLICATION,
    SEND_APPLICATION_ERROR,
    SEND_APPLICATION_SUCCESS,
    SET_LOADING
} from "../constants/actions";

import { BASE_API_URL } from '../services/apis';

import axios from '../services/APIHelper';
import CmsServices from '../services/cms.services'
import { maskPhoneRegexPattern } from "../helpers";


//import axios from 'axios'


///////////////////#HOME/////////////////////////////////
export const getFaqsHome = (language) => async (dispatch) => {
    const requestModel = {
        where: {
            status: true,
            showMainPage: true,
            language: language,
        },
        sort: {
            order: 1,
        },
        select: {
            title: 1,
            description: 1,
            language: 1,
        },
    };
    try {
        dispatch({ type: GET_FAQ_LIST });
        const { items } = await CmsServices.getFaqs(requestModel);
        dispatch({ type: GET_FAQ_LIST_SUCCESS, payload: items });
    } catch (error) {
        dispatch({ type: GET_FAQ_LIST_ERROR });
    }
};

export const getTestimonialsHome = (language) => async (dispatch) => {
    const requestModel = {
        where: {
            status: true,
            language: language,
        },
        limit: 3,
        sort: {
            order: 1,
        },

    };
    try {
        dispatch({ type: GET_TESTIMONIAL_LIST });
        const { items } = await CmsServices.getTestimonials(requestModel);
        dispatch({ type: GET_TESTIMONIAL_LIST_SUCCESS, payload: items });
    } catch (error) {
        dispatch({ type: GET_TESTIMONIAL_LIST_ERROR });
    }
};

///////////////////#sendApplication/////////////////////////////////
export const sendApplication = (lang, postData) => async (dispatch) => {
    const requestModel = {
        ...postData,
        formType: postData.formType,
        language: lang,
        phoneNumber: postData.phoneNumber.replace(maskPhoneRegexPattern, ''),
    };
    try {
        dispatch({ type: SEND_APPLICATION });
        await CmsServices.postApplication(requestModel);
        dispatch({ type: SEND_APPLICATION_SUCCESS });
        return Promise.resolve()
    } catch (error) {
        dispatch({ type: SEND_APPLICATION_ERROR });
        return Promise.reject()
    }
};