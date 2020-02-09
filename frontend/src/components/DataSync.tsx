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
				value.scoutedMatch.dispatch({
					type: 'syncStart',
				})
			}}
		>
			Sync Data
		</Button>
	)
}

export default DataLoader
