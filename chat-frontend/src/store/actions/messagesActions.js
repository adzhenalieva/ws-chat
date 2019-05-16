import axios from '../../axios-api';
import {NotificationManager} from "react-notifications";


export const DELETE_SUCCESS = 'DELETE_SUCCESS';
export const DELETE_FAILURE = "DELETE_FAILURE";

const deleteSuccess = () => ({type: DELETE_SUCCESS});

const deleteFailure = error => ({type: DELETE_FAILURE, error});

export const chatAction = (type, message) => ({type, message});

export const deleteMessage = id => {
    return dispatch => {
        return axios.delete('/messages/' + id).then(
            () => {
                dispatch(deleteSuccess());
                NotificationManager.success('Deleted successfully');
            },
            error => {
                if (error.response && error.response.data) {
                    dispatch(deleteFailure(error.response.data));
                } else {
                    dispatch(deleteFailure({global: 'No connection'}))
                }

            }
        )
    }
};

