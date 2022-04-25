import {
    GET_FAQ_LIST,
    GET_FAQ_LIST_ERROR,
    GET_FAQ_LIST_SUCCESS,
    GET_TESTIMONIAL_LIST,
    GET_TESTIMONIAL_LIST_ERROR,
    GET_TESTIMONIAL_LIST_SUCCESS,
    GET_TEST,
    SET_TEST
} from '../constants/actions';

const initialState = {
    loading: false,
    testimonialList: [],
    faqList: [],
    locationItems: []
};
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_TEST: {
            return {
                ...state,
                conversationStatus: "changed",
                payload: action.payload
            };
        }
        case GET_FAQ_LIST: {
            return {
                ...state,
                loading: true
            };
        }
        case GET_FAQ_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                faqList: action.payload
            };
        }
        case GET_FAQ_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                faqList: []
            };
        }

        case GET_TESTIMONIAL_LIST: {
            return {
                ...state,
                loading: true
            };
        }
        case GET_TESTIMONIAL_LIST_SUCCESS: {
            return {
                ...state,
                loading: false,
                testimonialList: action.payload
            };
        }
        case GET_TESTIMONIAL_LIST_ERROR: {
            return {
                ...state,
                loading: false,
                testimonialList: []
            };
        }


        case GET_TEST: {
            return {
                ...state,
                loading: true,
                isAllConversationsLoaded: false,
                data: {
                    meta: state.data.meta,
                    payload: [],
                },
            };
        }


        default:
            return state;
    }
};
