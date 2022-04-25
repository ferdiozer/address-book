import { combineReducers } from 'redux';


import home from './home';
import auth from './auth';

const rootReducer = combineReducers({
    home,
    auth
});

export default (state, action) =>
    action.type === 'CLOSE_APP'
        ? rootReducer({ settings: state.settings }, action)
        : rootReducer(state, action);
