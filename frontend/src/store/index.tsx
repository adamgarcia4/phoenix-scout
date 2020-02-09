import React, {
	createContext,
} from 'react'
import { ScoutedMatch } from '@shared/Interfaces'
import backendAxios from '../config/backendAxios'
import usePersistReducer, { State, Action } from './usePersistReducer'

interface ContextInterface {
	scoutedMatch: {
		state: State<ScoutedMatch>,
		dispatch: (test: Action<ScoutedMatch>) => any,
	}
}

const store = createContext<ContextInterface>(null)
const { Provider } = store


// eslint-disable-next-line
const StateProvider = ({ children }) => {
	const getScoutedMatch = async () => {
		const res = await backendAxios.get('/scoutedMatch')
		return res.data
	}

	const postScoutedMatch = async (dataToUpload) => {
		const res = await backendAxios.post('/scoutedMatch', {
			data: dataToUpload,
		})
		return res
	}

	const scoutMatchObj = usePersistReducer<ScoutedMatch>(getScoutedMatch, postScoutedMatch)


	// need to add copy to localstorage hook too
	return (
		<Provider
			value={{
				scoutedMatch: scoutMatchObj,
			}}
		>
			{children}
		</Provider>
	)
}

export { store, StateProvider }
