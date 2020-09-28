const initState = {
    user: false,
    activeConversation: {
        names: ['testForFakeConvo112233'],
        messages: []
    }
}

const rootReducer = (state = initState, action) => {
    if(action.type === 'LOGIN') {
        return {
            ...state,
            user: action.user
        }
    } else if(action.type === 'LOGOUT') {
        return {
            ...state,
            user: false
        }
    } else if(action.type === "SELECT_CONVO") {
        return {
            ...state,
            activeConversation: action.conversation
        }
    } else if(action.type === "ADD_MESSAGE") {
        return {
            ...state,
            activeConversation :{
              ...state.activeConversation,
              messages: state.activeConversation.messages.concat(action.message)              
              }      
        };
    } else if(action.type === 'REFRESH'){
        window.location.reload();
    } else {
        return state;
    }
}

export default rootReducer;