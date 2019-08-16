import React from 'react'
import provider, { useCustomRedux } from './redux-custom';
import { reducer, initialState } from './reducer';
function Test() {
    const { state, dispatch } = useCustomRedux();
    return (
        <div>
            <h2>{state.reducer1.count}</h2>
            <button onClick={() => dispatch({ type: 'ADD_COUNTER' })}>触发dispatch-action</button>
        </div>
    )
}
export default provider(reducer, initialState)(Test);