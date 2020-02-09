import {
	useReducer,
	useEffect,
} from 'react'


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


export interface State<T> {
  documents: { [key: string]: T },
  queuedKeys: Set<string>,
  /**
   * Set to true to push to Backend
   */
  isDrainNeeded: number,
  /**
   * Set to true to pull from Backend
   */
  isSyncNeeded: number,
}

/**
 * 3 main actions:
 * Add - Add data locally
 * Drain - Push changes to server
 * Sync - Download changes from server
 */
export type Action<T> = {
		type: 'addData',
		data: T,
	} |
	{
		type: 'addDataWithoutDrain',
		data: T[]
	} |
	{
		type: 'drainQueue',
	} |
	{
		type: 'syncData',
	} |
	{
		type: 'drainStart'
	} |
	{
		type: 'drainSuccess'
	} |
	{
		type: 'pushFailed'
	} |
	{
		type: 'syncStart'
	} |
	{
		type: 'syncSuccess'
	}

// I now have to handle 2-way deletes
const getInitialState = <T extends any>(): State<T> => ({
	/**
   * This is the actual data as a key/val store
   */
	documents: {},
	/**
   * This is a list of keys of object taht need to be sent to server when sync.
   */
	queuedKeys: new Set(),
	/**
   * This is the field that, when set to true, triggers pushing all keys to server
   */
	isDrainNeeded: 0,
	/**
   * If set to true, then triggers pulling data from server
   */
	isSyncNeeded: 0,
	/**
   *
   * if push is needed AND download needed, then push should happen first, then
   * once done, download should happen
   *
   */
})

const reducer = <T extends any>(state: State<T>, action: Action<T>): State<T> => {
	// console.groupCollapsed(`Reducer ${action.type}`)
	// console.log('state:', state)
	// console.log('action:', action)
	// console.groupEnd()

	switch (action.type) {
	/**
     * Add data to memory and queue
     * Trigger a drain queue to Database
     * TODO: To Support multiple documents?
     */
	case 'addData':
		return {
			...state,
			queuedKeys: state.queuedKeys.add(action.data.key),
			documents: {
				...state.documents,
				[action.data.key]: action.data,
			},
			isDrainNeeded: state.isDrainNeeded + 1,
		}
	case 'addDataWithoutDrain':
		const matchesToAdd = {}
		for (const match of action.data) {
			matchesToAdd[match.key] = match
		}

		return {
			...state,
			documents: {
				...state.documents,
				...matchesToAdd,
			},
		}
	case 'drainStart':
		return {
			...state,
			isDrainNeeded: state.isDrainNeeded + 1,
		}
	case 'drainSuccess':
		state.queuedKeys.clear()
		return {
			...state,
			isDrainNeeded: 0,
			// If sync was needed before, repush sync request.
			// If didn't already need to sync, then dont.
			isSyncNeeded: state.isSyncNeeded ? state.isSyncNeeded + 1 : 0,
		}
		// case 'pushFailed':
		//   return {
		//     ...state,
		//     // isDrainNeeded: false,
		//   }
	case 'syncStart':
		console.log('state:', state)

		return {
			...state,
			isSyncNeeded: state.isSyncNeeded + 1,
		}
	case 'syncSuccess':
		return {
			...state,
			// No need to sync anymore
			isSyncNeeded: 0,
		}
	default:
		throw new Error()
	}
}
/**
 * When the app boots up, we should start syncing data.
 * @param dispatch Function
 */
const useSyncOnPageLoad = (dispatch) => {
	useEffect(() => {
		console.log('Sync on page load')
		dispatch({
			type: 'syncStart',
		})
	}, [])
}

/**
 * This is server-downloading side effect.
 * Before downloading new data, first ensure that no
 * Items are waiting in the queue
 */
const useSyncWithBackend = <T extends any>(state: State<T>, dispatch, getFunc) => {
	useEffect(() => {
		console.log('Sync with Backend')
		if (state.queuedKeys.size) {
			dispatch({
				type: 'drainStart',
			})
			return
		}

		if (state.isSyncNeeded) {
			getFunc()
				.then((data) => {
					dispatch({
						type: 'addDataWithoutDrain',
						data,
					})
				})
			dispatch({
				type: 'syncSuccess',
			})
		}
	}, [state.isSyncNeeded])
}

/**
 * This effect syncs changes back up with server.
 * Tested, and seems that this pushes once.
 */
const useDrainQueue = <T extends any>(
	state: State<T>,
	dispatch,
	postFunc: (any) => Promise<any>,
) => {
	useEffect(() => {
		console.log('Drain Queue Start')
		if (
			state.queuedKeys.size
      && state.isDrainNeeded
		) {
			const matchesToUpload = []

			for (const key of state.queuedKeys) {
				matchesToUpload.push(state.documents[key])
			}

			postFunc(matchesToUpload)
				.then((res) => {
					console.log('res.data:', res.data)

					dispatch({
						type: 'drainSuccess',
					})
				})
				.catch(() => {
					// dispatch({
					//   type: 'pushFailed'
					// })
				})
		}
	}, [state.isDrainNeeded])
}

interface IPersist<T> {
	state: State<T>,
	dispatch: (test: Action<T>) => any,
}
export default function usePersistReducer<T>(
	getFunc: () => Promise<T[]>,
	postFunc: (any) => Promise<any>,
):IPersist<T> {
	const initialState = getInitialState<T>()
	const [state, dispatch] = useReducer(reducer, initialState)

	// console.groupCollapsed('Current')
	// console.log('state:', state)
	// console.groupEnd()

	useSyncOnPageLoad(dispatch)
	useSyncWithBackend(state, dispatch, getFunc)
	useDrainQueue(state, dispatch, postFunc)

	return {
		state,
		dispatch,
	}
}
