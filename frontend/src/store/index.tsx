import React, { createContext, useReducer, useState, useEffect } from 'react'
import { ScoutedMatch } from 'src/Interfaces';

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
  queuedKeys: Set<String>,
  pushData: Boolean,
}

type Action = {
  type: 'addData',
  data: ScoutedMatch,
} | {
  type: 'refreshData',
  data: ScoutedMatch[],
} | {
  type: 'pushDataToggle',
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
  pushData: false,
}

const reducer = (state: State, action: Action): State => {
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
        }
      }
    case 'refreshData':
      const newMatchesToAdd: { [key: string]: ScoutedMatch } = {}

      for (const scoutedMatch of action.data) {
        newMatchesToAdd[scoutedMatch.key] = scoutedMatch
      }

      return {
        ...state,
        scoutedMatches: {
          ...state.scoutedMatches,
          ...newMatchesToAdd,
        },
        pushData: true,
      }
    case 'pushDataToggle':
      return {
        ...state,
        pushData: false,
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
  
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log('state:', state)
  
  useEffect(() => {
    if (
      state.queuedKeys.size && 
      state.pushData
    ) {
      console.log('DATABASE', state.queuedKeys)
    }

    dispatch({
      type: 'pushDataToggle'
    })

  }, [state.queuedKeys.size, state.pushData])
  
  return (
    <Provider
      value={{ state, dispatch }}
    >
      {children}
    </Provider>
  )
	
};

export { store, StateProvider }