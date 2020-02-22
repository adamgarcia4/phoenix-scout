import React, { useContext } from 'react'
import { Button } from '@material-ui/core'

import { ScoutedMatch } from '@shared/Interfaces'

// import backendAxios from '../config/backendAxios'
import { store } from '../store'

interface ScoutMatchResponse {
	scoutedMatches?: [ScoutedMatch]
}

const DataLoader = () => {
	const value = useContext(store)

	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={() => {
				// TODO: Create single sync that calls all relevant syncs
				value.scoutedMatch.dispatch({
					type: 'syncStart',
				})
				value.teams.dispatch({
					type: 'syncStart',
				})
			}}
		>
			Sync
		</Button>
	)
}

export default DataLoader
