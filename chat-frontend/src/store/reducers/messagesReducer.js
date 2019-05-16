
const initialState = {
    usernames: [],
    messages: [],
    error: null
};

const messagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [ ...state.messages, action.message]
            };
        case 'LATEST_MESSAGES':
            return {
                ...state,
                messages: action.messages
            };
        case 'ACTIVE_USERS':
            return {
                ...state,
                usernames: action.users
            };
        default:
            return state;
    }
};
export default messagesReducer;