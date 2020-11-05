import axios from 'axios';
import Cookies from 'js-cookie';

import { PROFILE_ERROR } from './profiles';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const CLEAR_PROFILE = 'CLEAR_PROFILE'; //when we logout we clear auth state but also profile logically
export const ACCOUNT_DELETED = 'ACCOUNT_DELETED';
export const LINKEDIN_SUCCESS = 'LINKEDIN_SUCCESS';
export const LINKEDIN_FAIL = 'LINKEDIN_FAIL';

//For now we don't care about the profile and alerts

export const loadUser = () => {
    return async (dispatch, getState) => {
        //Setting token as a header for all requests
        if (Cookies.get('token')) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }

        try {
            //The server will verify the token, and then get the user
            const res = await axios.get(getState().globalVars.currentDomain + '/auth/me');
            dispatch({ type: USER_LOADED, user: res.data.data });
        } catch (err) {
            dispatch({ type: AUTH_ERROR });
        }
    }
}

//login and register are without linkedin here...
export const registerUser = (firstName, lastName, email, password) => {
    return async (dispatch, getState) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ firstName, lastName, email, password });

        try {
            const res = await axios.post(getState().globalVars.currentDomain + '/auth/register', body, config);

            dispatch({ type: REGISTER_SUCCESS, token: res.data.token });
            dispatch(loadUser());
        } catch (err) {
            console.log(err);
            dispatch({ type: REGISTER_FAIL });
        }
    }
}

export const loginUser = (email, password) => {
    return async (dispatch, getState) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ email, password });

        try {
            const res = await axios.post(getState().globalVars.currentDomain + '/auth/login', body, config);

            dispatch({ type: LOGIN_SUCCESS, token: res.data.token });
            dispatch(loadUser());
        } catch (err) {
            console.log(err);
            dispatch({ type: LOGIN_FAIL });
        }
    }
}

export const linkedinConnect = code => {
    return async (dispatch, getState) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ code });

        try {
            const res = await axios.post(getState().globalVars.currentDomain + '/auth/linkedinAuth', body, config);
            dispatch({ type: LINKEDIN_SUCCESS, token: res.data.token, linkedinToken: res.data.linkedinToken });
            dispatch(loadUser());
        } catch (err) {
            console.log(err);
            dispatch({ type: LINKEDIN_FAIL });
        }
    }
}

export const logout = () => {
    return dispatch => {
        dispatch({ type: LOGOUT });
        dispatch({ type: CLEAR_PROFILE });
    };
}


export const deleteAccount = id => {
    return async (dispatch, getState) => {
        if (window.confirm('Are you sure ? This can NOT be undone.')) {
            try {
                await axios.delete(getState().globalVars.currentDomain + '/profile');
                dispatch({ type: ACCOUNT_DELETED });
                dispatch({ type: CLEAR_PROFILE });
            } catch (err) {
                dispatch({
                    type: PROFILE_ERROR, error: {
                        msg: err.response.statusText,
                        status: err.response.status
                    }
                });
            }
        }
    }
}
