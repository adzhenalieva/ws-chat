import axios from '../../axios-api';
import {push} from 'connected-react-router';
import {NotificationManager} from "react-notifications";

export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";

export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAILURE = "LOGIN_USER_FAILURE";

export const LOGOUT_USER = "LOGOUT_USER";

const registerUserSuccess = user => ({type: REGISTER_USER_SUCCESS, user});
const registerUserFailure = error => ({type: REGISTER_USER_FAILURE, error});

const loginUserSuccess = user => ({type: LOGIN_USER_SUCCESS, user});
const loginUserFailure = error => ({type: LOGIN_USER_FAILURE, error});

export const logoutUser = () => {
    return dispatch => {

        return axios.delete('/users/sessions').then(
            () => {
                dispatch({type: LOGOUT_USER});
                NotificationManager.success('Logged out');
                dispatch(push('/'));
            },
            error => {
                NotificationManager.error('Could not logout!')
            }
        )
    }
};

export const registerUser = userData => {
    return dispatch => {
        return axios.post('/users', userData).then(
            response => {
                dispatch(registerUserSuccess(response.data.user));
                NotificationManager.success('Registered successfully');
                dispatch(push('/chat?token='+response.data.user.token));
            },
            error => {
                if(error.response  && error.response.data){
                    dispatch(registerUserFailure(error.response.data))
                } else {
                    dispatch(registerUserFailure({global: 'No connection'}))
                }

            }
        )
    }
};

export const loginUser = userData => {
    return dispatch => {
        return axios.post('/users/sessions', userData).then(
            response => {
                dispatch(loginUserSuccess(response.data.user));
                NotificationManager.success('Logged in successfully');
                dispatch(push('chat?token='+response.data.user.token));
            },
            error => {
                if(error.response && error.response.data){
                    dispatch(loginUserFailure(error.response.data.error))
                } else {
                    dispatch(loginUserFailure({global: 'No connection'}))
                }

            }
        )
    }
};