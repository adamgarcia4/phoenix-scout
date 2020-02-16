import React, {
	createContext,
} from 'react'
import { ScoutedMatch, TeamInterface, MatchAPIResponse } from '@shared/Interfaces'
import backendAxios from '../config/backendAxios'
import usePersistReducer, { State, Action } from './usePersistReducer'

interface ISingleReducer<T> {
	state: State<T>,
	dispatch: (test: Action<T>) => any,
}

interface ContextInterface {
	scoutedMatch: ISingleReducer<ScoutedMatch>,
	teams: ISingleReducer<TeamInterface>,
	matches: ISingleReducer<MatchAPIResponse>,
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

	const scoutMatchObj = usePersistReducer<ScoutedMatch>({
		get: getScoutedMatch,
		post: postScoutedMatch,
	})

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

	const teamsObj = usePersistReducer<TeamInterface>({
		get: getTeams,
		post: postTeams,
	})

	const getMatches = async () => {
		const res = await backendAxios.get('/matches')
		return res.data
	}

	const postMatches = async (dataToUpload) => {
		const res = await backendAxios.post('/teams', {
			data: dataToUpload,
		})
		return res
	}
	const matchesObj = usePersistReducer<MatchAPIResponse>({
		get: getMatches,
		post: postMatches,
	})
	// need to add copy to localstorage hook too
	return (
		<Provider
			value={{
				scoutedMatch: scoutMatchObj,
				teams: teamsObj,
				matches: matchesObj,
			}}
		>
			{children}
		</Provider>
	)
}

export { store, StateProvider }
