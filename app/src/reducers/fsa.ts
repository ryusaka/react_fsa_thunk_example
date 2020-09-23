import { reducerWithInitialState } from 'typescript-fsa-reducers'
import actionCreatorFactory from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'
import axios from 'axios'

/** You can optionally use custom Error types */
class CustomError extends Error { }

/** Parameters used for logging in */
interface WaitParams {
	text: string,
}

/** The object that comes back from the server on successful login */
interface Wait1000Res {
	response: string,
}

/** The shape of our Redux store's state */
export interface State {
  syncText: string,
  waiting?: boolean,
  finished?: boolean,
  response?: string,
	error?: CustomError,
}

/** The typescript-fsa action creator factory function */
const creatorFactory = actionCreatorFactory('user')

/** The typescript-fsa-redux-thunk async action creator factory function */
const createAsync = asyncFactory<State>(creatorFactory)

/** Normal synchronous action */
const syncAction = creatorFactory<string>('sync action')

/** The asynchronous login action Error type is optional */
export const asyncAction = createAsync<WaitParams, Wait1000Res, CustomError>(
	'wait1000' as const,
	async (params, dispatch) => {
		try {
			const res = await axios.get('/wait1000', {params})
			dispatch(syncAction('sync action dispatched'))

			return res.data
		} catch (e) {
			if (e.response.status !== 200) {
				throw new CustomError(`${e.message}`)
			}
		}
	}
)

/** An initial value for the application state */
const initial: State = {
  syncText: 'not dispatched',
  waiting: false,
  finished: false,
	response: '',
}
/** Reducer, handling updates to indicate logging-in status/error */
export const reducer = reducerWithInitialState(initial)
	.case(syncAction, (state, syncText) => ({
		...state,
		syncText,
	}))
	.case(asyncAction.async.started, state => ({
    ...state,
    waiting: true,
    finished: false,
    error: undefined,
    response: '',
	}))
	.case(asyncAction.async.failed, (state, { error }) => ({
    ...state,
    waiting: false,
    finished: false,
    response: '',
		error,
	}))
	.case(asyncAction.async.done, (state, action) => ({
    ...state,
    waiting: false,
    finished: true,
		response: action.result.response,
		error: undefined,
	}))
