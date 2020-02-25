import React, {
	createContext, useEffect,
} from 'react'
import { ScoutedMatch, TeamInterface, MatchAPIResponse, PitScout } from '@shared/Interfaces'
import backendAxios from '../config/backendAxios'
import usePersistReducer, { State, Action } from './usePersistReducer'
import useLocalStorage from '../hooks/useLocalStorage'

interface ISingleReducer<T> {
	state: State<T>,
	dispatch: (test: Action<T>) => any,
}

interface ContextInterface {
	scoutedMatch: ISingleReducer<ScoutedMatch>,
	teams: ISingleReducer<TeamInterface>,
	matches: ISingleReducer<MatchAPIResponse>,
	pitScout: ISingleReducer<PitScout>
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

	const getPitScout = async () => {
		const res = await backendAxios.get('/pitScout')
		return res.data
	}

	const postPitScout = async (dataToUpload) => {
		const res = await backendAxios.post('/pitScout', {
			data: dataToUpload,
		})
		return res
	}
	const pitScoutObj = usePersistReducer<PitScout>({
		get: getPitScout,
		post: postPitScout,
	})

	// const [val, setVal] = useLocalStorage('pit', JSON.parse(window.localStorage.getItem('pit')) || null)

	// console.log('vals:', val)

	useEffect(() => {
		// console.log('hi')
		// setVal(JSON.stringify(pitScoutObj.state.documents))
	}, [pitScoutObj.state.documents])
	

	// need to add copy to localstorage hook too
	return (
		<Provider
			value={{
				scoutedMatch: scoutMatchObj,
				teams: teamsObj,
				matches: matchesObj,
				pitScout: pitScoutObj,
			}}
		>
			{children}
		</Provider>
	)
}

export { store, StateProvider }
