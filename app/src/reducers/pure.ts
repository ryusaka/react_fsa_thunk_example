import axios, { AxiosResponse } from 'axios'
import { Dispatch } from 'redux'

const SYNC = 'user/SYNC_PURE' as const
const ASYNC_START = 'user/ASYNC_START_PURE' as const
const ASYNC_DONE = 'user/ASYNC_DONE_PURE' as const
const ASYNC_FAILED = 'user/ASYNC_FAILED_PURE' as const

class CustomError extends Error { }

export interface State {
  syncText: string,
  waiting?: boolean,
  finished?: boolean,
  response?: string,
	error?: CustomError,
}

const syncActionCreator = (text: string) => ({
  type: SYNC,
  text,
})
const asyncActionStartCreator = () => {
  return {
    type: ASYNC_START,
  }
}
const asyncActionDoneCreator = ({response}: {response: string}) => {
  return {
    type: ASYNC_DONE,
    response,
  }
}
const asyncActionFailedCreator = (error: CustomError) => {
  return {
    type: ASYNC_FAILED,
    error,
  }
}

type Actions = ReturnType<typeof syncActionCreator> | ReturnType<typeof asyncActionStartCreator> | ReturnType<typeof asyncActionDoneCreator> | ReturnType<typeof asyncActionFailedCreator>

export const asyncAction = (params) => {
  return async (dispatch: Dispatch) => {
    let res: AxiosResponse
    dispatch(asyncActionStartCreator())
    try {
      res = await axios.get('/wait1000', {params})
      // if (res.status !== 200) {
      //   throw new CustomError(`Error ${res.status}: ${res.statusText}`)
      // }
      dispatch(syncActionCreator('sync action dispatched'))
    } catch (e) {
      return dispatch(asyncActionFailedCreator(e))
    }

    return dispatch(asyncActionDoneCreator(res.data))
  }
}

export const initial: State = {
  syncText: 'not dispatched',
  waiting: false,
  finished: false,
	response: '',
}
export const reducer = (state: State = initial, action: Actions): State => {
  switch (action.type) {
    case SYNC: {
      return {
        ...state,
        syncText: action.text,
      }
    }
    case ASYNC_START: {
      return {
        ...state,
        waiting: true,
        finished: false,
        error: undefined,
        response: '',
      }
    }
    case ASYNC_FAILED: {
      return {
        ...state,
        waiting: false,
        finished: false,
        response: '',
        error: action.error,
      }
    }
    case ASYNC_DONE: {
      return {
        ...state,
        waiting: false,
        finished: true,
        response: action.response,
        error: undefined,
      }
    }
    default: {
      return state
    }
  }
}
