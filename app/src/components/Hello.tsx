import * as React from 'react'
import { Button } from '@material-ui/core'
import { AppState } from '../reducers/index'
import { useSelector, useDispatch } from 'react-redux'
import { useAppSelector, useAppDispatch } from '../reducers/index'
import { asyncAction } from '../reducers/fsa'
import { asyncAction as pureAsyncAction } from '../reducers/pure'
import { Link } from 'react-router-dom'

export interface HelloProps {
  compiler: string,
  framework: string,
}

const selector = (state: AppState) => state.user


export const Hello: React.FC<HelloProps> = (props) => {
  // const result = useSelector(selector)
  const dispatch = useDispatch()
  const result = useAppSelector(state => state.user)
  const pure_result = useAppSelector(state => state.userPure)
  const appDispatch = useAppDispatch()

  // appDispatch(pureAsyncAction({text: 'this is param text'})).then(res => res)
  // dispatch(pureAsyncAction({text: 'this is param text'})).then(res => res)
  // appDispatch(asyncAction({text: 'this is param text'}))
  return (
    <div>
      <h1>Hello from {props.compiler} and {props.framework}!</h1>
      {result.waiting && 'loading...'}
      {result.error && `error: ${result.error}`}
      {result.response && `response: ${result.response}`}
      <Button color='primary' variant='outlined' onClick={() => dispatch(asyncAction({text: 'this is param text'}))}>dispatch async action</Button>
      {pure_result.waiting && 'loading...'}
      {pure_result.error && `error: ${result.error}`}
      {pure_result.response && `pure response: ${pure_result.response}`}
      <Button color='primary' variant='outlined' onClick={() => appDispatch(pureAsyncAction({text: 'this is param text'}))}>dispatch pure async action</Button>
      <Button color='secondary' variant='contained' onClick={() => dispatch(asyncAction({text: 'error'}))}>dispatch async action with error</Button>
      <Button color='secondary' variant='contained' onClick={() => appDispatch(pureAsyncAction({text: 'error'}))}>dispatch pure async action with error</Button>
      <Button variant='contained' component={Link} to='/lazy'>Go To Lazy</Button>
    </div>
  )
}
