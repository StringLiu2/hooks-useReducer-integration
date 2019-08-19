#基于React的createContext, useContext, useReducer封装的组合reducer库(优化了useCustomRedux成为一个泛型函数)

## reducer.ts redux-custom.tsx test.tsx (使用案例,然后把组件直接引入到index.tsx中使用,使用JavaScript的大佬就把文件改一下除去一些类型定义等)
## 库代码如下:
``` js
import React, { Context, createContext, useContext, useReducer } from 'react';
/** 
 * @createContext ProviderContext 一个创建完毕的context
*/
const ProviderContext: Context<any> = createContext('provider');
/** 高阶函数
 *  @param reducer 传入一个整合或者没有整合的reducer
 *  @param initialState 传入一个初始化的state，用来当做默认值
 */
export default (reducer: Function, initialState: any) => (Com: React.FC | React.ComponentClass) => {
    return () => {
        const [state, dispatch] = useReducer<any>(reducer, initialState);
        return (
            <ProviderContext.Provider value={{ state, dispatch }}>
                <Com />
            </ProviderContext.Provider >
        );
    }
}
/**
 *      获取自定义的redux
 *  @state 这个参数是需要拿来使用的state 
 *  @dispatch 这个参数是dispatch分发action使用的
 *  @T 接收一个state的类型，是总体的state的类型
 */
export function useCustomRedux<T>() {
    interface Type {
        dispatch: Dispatch<T>;
        state: T;
    }
    return useContext<Type>(ProviderContext);
}

/**接受一个包含多个reducer函数的对象，返回一个新的reducer函数
 * @param reducers 传入多个reducer,用于整合成一个reducer
 */
export function combineReducers(reducers: any) {//整合reducer函数的对象的函数
    return function (state = {}, action: any) {//返回一个整合之后的reducer函数 ,然后传给了createStore使用
        //依次调用所有的reduce函数，并得到了状态,然后得到了许多的状态,得到n个新的子状态，封装成对象并返回
        return Object.keys(reducers).reduce((newState: any, key: string) => {
            newState[key] = reducers[key]((state as any)[key], action);//然后得到新的子状态，赋值给对应的key的新state里面
            return newState;
        }, {});
    }
}
```
## 使用方式: 
### reducer.ts文件
``` js
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

export const reducer = combineReducers({ reducer1, reducer2 });//合并reducer
export const initialState = { reducer1: initialReucer1, reducer2: initialReucer2 };//合并initialState
```
### test.tsx
```js
import React from 'react'
import provider, { useCustomRedux } from './redux-custom';
import { reducer, initialState } from './reducer';
function Test() {
    //优化
    const { state, dispatch } = useCustomRedux<typeof initialState>();
    // const { state, dispatch } = useCustomRedux();
    return (
        <div>
            <h2>{state.reducer1.count}</h2>
            <button onClick={() => dispatch({ type: 'ADD_COUNTER' })}>触发dispatch-action</button>
        </div>
    )
}
export default provider(reducer, initialState)(Test);
```
