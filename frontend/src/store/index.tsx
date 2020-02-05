import React, { createContext, useReducer, useState, useEffect } from 'react'
import { ScoutedMatch } from 'src/Interfaces';
import backendAxios from '../config/backendAxios'

/**
 * Store is a collection of reducers/value thing.
 * 
 * requirements:
 * 
 * 1. Action to push new data to state.  This makes
 * UI 100% fluid, with internet or without.
 * 
 * 2. Option to persist to local storage disk.
 * This will act as the caching while offline.
 * 
 * Keep track of which documents are also found
 * in the database.  Key value store.  True False
 * Key is document identifier.  Can have a default
 * value of `key`, but be customized.
 * 
 * When full api fetch made for data, this list is
 * regenerated.
 * 
 * 3. Action which pushes all unpersisted data
 * to database.  Once a response comes back, the
 * Key/Value store is regenerated.
 * 
 * Optional function to persist with database
 * 
 * If State is always a key value store
 * We can push an object and have a default getKey Function
 * 
 * Get a list of data via Object.values()
 * 
 */

interface State {
  scoutedMatches: { [key: string]: ScoutedMatch },
  queuedKeys: Set<string>,
  /**
   * Set to true to push to Backend
   */
  isPushNeeded: Boolean,
  /**
   * Set to true to pull from Backend
   */
  isDownloadNeeded: Boolean,
}

type Action = {
  type: 'addData',
  data: ScoutedMatch,
} | {
  type: 'syncData',
  // data: ScoutedMatch[],
} | {
  type: 'pushStart'
} | {
  type: 'pushSuccess'
} | {
  type: 'pushFailed'
} | {
  type: 'syncStart'
} | {
  type: 'syncSuccess'
} | {
  type: 'populateServerData',
  data: ScoutedMatch[]
}

const initialState: State = {
  /**
   * This is the actual data as a key/val store
   */
  scoutedMatches: {},
  /**
   * This is a list of keys of object taht need to be sent to server when sync.
   */
  queuedKeys: new Set(),
  /**
   * This is the field that, when set to true, triggers pushing all keys to server
   */
  isPushNeeded: false,
  /**
   * If set to true, then triggers pulling data from server
   */
  isDownloadNeeded: false,
  /**
   * 
   * if push is needed AND download needed, then push should happen first, then
   * once done, download should happen
   * 
   */
}

const reducer = (state: State, action: Action): State => {
  // console.log('action.type:', action.type)
  
  switch(action.type) {
    case 'addData':
      // if queuedKeys.has() key, then we can override the data in our store
      // instead of add as a new document
      return {
        ...state,
        queuedKeys: state.queuedKeys.add(action.data.key),
        scoutedMatches: {
          ...state.scoutedMatches,
          [action.data.key]: action.data
        },
        isPushNeeded: true,
      }
    case 'populateServerData':
      const matchesToAdd = {}
      for (const match of action.data) {
        matchesToAdd[match.key] = match
      }

      return {
        ...state,
        scoutedMatches: {
          ...state.scoutedMatches,
          ...matchesToAdd,
        }
      }
    case 'pushStart':
      return {
        ...state,
        isPushNeeded: true,
      }
    case 'pushSuccess':
      return {
        ...state,
        isPushNeeded: false,
        queuedKeys: new Set()
      }
    case 'pushFailed':
      return {
        ...state,
        isPushNeeded: false,
      }
    case 'syncStart': 
      return {
        ...state,
        isDownloadNeeded: true,
      }
    case 'syncSuccess':
      return {
        ...state,
        isDownloadNeeded: false,
      }
    default:
      throw new Error();
  };
}

interface ContextInterface {
  state: State,
  dispatch: (test: Action) => any,
}

const store = createContext<ContextInterface>(null)
const { Provider } = store

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({
      type: 'syncStart'
    })
  }, [])
  
  // This is server-downloading side effect
  useEffect(() => {
    // If I want to download but I have items that haven't been pushed yet
    // left in the queue,
    // first push to server then pull.
    if (state.queuedKeys.size) {
      dispatch({
        type: "pushStart"
      })
      return
    }
    if (state.isDownloadNeeded) {
      backendAxios.get('/scoutedMatch')
      .then(res => {
        dispatch({
          type: 'populateServerData',
          data: res.data
        })
      })
      dispatch({
        type: "syncSuccess"
      })
    }
  }, [state.isDownloadNeeded])

  // This effect syncs changes back up with server
  useEffect(() => {
    if (
      state.queuedKeys.size && 
      state.isPushNeeded
    ) {
      const matchesToUpload = []
      for (const key of state.queuedKeys) {
        matchesToUpload.push(state.scoutedMatches[key])
      }

      backendAxios.post('/scoutedMatch', {
        scoutedMatches: matchesToUpload
      })
      .then(res => {
        dispatch({
          type: 'pushSuccess'
        })
      })
      .catch(err => {
        dispatch({
          type: 'pushFailed'
        })
      })
      
    }
  }, [state.queuedKeys.size, state.isPushNeeded])
  
  return (
    <Provider
      value={{ state, dispatch }}
    >
      {children}
    </Provider>
  )
	
};

export { store, StateProvider }