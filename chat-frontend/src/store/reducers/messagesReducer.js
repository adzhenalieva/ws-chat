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
                messages: [...state.messages, action.message]
            };
        case 'LATEST_MESSAGES':
            return {
                ...state,
                messages: action.message
            };
        case 'ACTIVE_USERS':
            return {
                ...state,
                usernames: action.message
            };
        case 'NEW_USER':
            return {
                ...state,
                usernames: [...state.usernames, action.message.username]
            };
        case 'DELETE_USER':
            let usernames = [...state.usernames];
            usernames.splice(usernames.indexOf(action.message), 1);
            return {
                ...state,
                usernames: usernames
            };
        default:
            return state;
    }
};
export default messagesReducer;