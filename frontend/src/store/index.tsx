import React, {
	createContext,
} from 'react'
import { ScoutedMatch, TeamInterface } from '@shared/Interfaces'
import backendAxios from '../config/backendAxios'
import usePersistReducer, { State, Action } from './usePersistReducer'

interface ISingleReducer<T> {
	state: State<T>,
	dispatch: (teset: Action<T>) => any,
}

interface ContextInterface {
	scoutedMatch: ISingleReducer<ScoutedMatch>,
	teams: ISingleReducer<TeamInterface>,
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

	const getTeams = async () => {
		const res = await backendAxios.get('/teams')
		return res.data
	}

	const postTeams = async (dataToUpload) => {
		const res = await backendAxios.post('/teams', {
			data: dataToUpload,
		})
		return res
	}

	const teamsObj = usePersistReducer<TeamInterface>(getTeams, postTeams)

	// need to add copy to localstorage hook too
	return (
		<Provider
			value={{
				scoutedMatch: scoutMatchObj,
				teams: teamsObj,
			}}
		>
			{children}
		</Provider>
	)
}

export { store, StateProvider }
