import { combineReducers } from './redux-custom';
const initialReucer1 = {
    count: 1
}
const initialReucer2 = {
    user: {}
}
function reducer1(state = initialReucer1, action: any) {
    switch (action.type) {
        case 'ADD_COUNTER':
            return { ...state, count: state.count + 1 }
        default:
            return state;
    }
}
function reducer2(state = initialReucer2, action: any) {
    switch (action.type) {
        default:
            return state;
    }
}

export const reducer = combineReducers({ reducer1, reducer2 });;
export const initialState = { reducer1: initialReucer1, reducer2: initialReucer2 };;