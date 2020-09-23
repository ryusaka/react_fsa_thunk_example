import { combineReducers, AnyAction, Action } from 'redux'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { History } from 'history'
import { reducer as userReducer, State as UserState } from './fsa'
import { reducer as userPureReducer, State as UserPureState } from './pure'
import { connectRouter, RouterState } from 'connected-react-router'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'


export type AppState = {
  router: RouterState,
  user: UserState,
  userPure: UserPureState,
}

const createRootReducer = (history: History) => combineReducers<AppState>({
  router: connectRouter(history),
  user: userReducer,
  userPure: userPureReducer,
})

export type AsyncAction<R=void> = ThunkAction<Promise<R>, AppState, undefined, AnyAction>
export type DispatchAction<T extends AnyAction = Action> = ThunkDispatch<AppState, undefined, T>

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
export const useAppDispatch: () => DispatchAction = useDispatch


export default createRootReducer
