import React, { useContext, useCallback } from 'react'
import { Button } from '@material-ui/core'

import { ScoutedMatch } from '@shared/Interfaces'

import backendAxios from '../config/backendAxios'
import { store } from '../store'

interface ScoutMatchResponse {
	scoutedMatches?: [ScoutedMatch]
}

const DataLoader = (props) => {
	const value = useContext(store)

	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={() => {
				// cb()
				value.dispatch({
					type: 'syncStart'
				})

				value.dispatch({
					type: 'pushStart'
				})
				// TODO: Add to dispatch
			}}
		>
			Sync Data
		</Button>
	)
}

export default DataLoader