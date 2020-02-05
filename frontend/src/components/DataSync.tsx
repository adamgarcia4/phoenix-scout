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

	const cb = useCallback( async () => {
			const res = await backendAxios.get('/scoutedMatch')
			value.dispatch({
				type: 'refreshData',
				data: res.data
			})
		},
		[],
	)

	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={() => {
				cb()
			}}
		>
			Sync Data
		</Button>
	)
}

export default DataLoader