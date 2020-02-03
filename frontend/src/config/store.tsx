import React, { createContext, useReducer, useState } from 'react'
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
 */

interface DispatchFunctionSignature {
  type: 'addData' | 'refreshData',
  data?: any
}

interface ContextInterface {
  state: {
    scoutedMatches: ScoutedMatch[],
  },
  dispatch: (test: DispatchFunctionSignature) => any,
}

const initialState = {
	scoutedMatches: []
}

const store = createContext<ContextInterface | null>(null)
const { Provider } = store

const StateProvider = ( { children } ) => {
  // const [newVal, setNewVal] = useState([])
  const [state, dispatch] = useReducer((state, action) => {
    // console.log('action:', action.type)
    // console.log('state:', state)
    // console.log('newVal:', newVal)
    
    switch(action.type) {
      case 'addData':
        // setNewVal([...newVal, action.data])
        return {
          scoutedMatches: [
            ...state.scoutedMatches,
            action.data,
          ]
        }  
      case 'refreshData':
        return {
          scoutedMatches: action.data,
        }
      default:
        throw new Error();
    };
  }, initialState);

  return (
    <Provider
      value={{ state, dispatch }}
    >
      {children}
    </Provider>
  )
	
};

export { store, StateProvider }