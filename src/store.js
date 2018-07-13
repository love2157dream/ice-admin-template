import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as tags from './store/reducer';
import thunk from 'redux-thunk';

let store = createStore(
  combineReducers({...tags}),
  applyMiddleware(thunk)
);

export default store;