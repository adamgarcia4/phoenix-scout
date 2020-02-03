import React, { useEffect, useContext } from 'react'
import { Button } from '@material-ui/core'

import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { ScoutedMatch } from '@shared/Interfaces'

import { store } from '../config/store'

const ScoutMatchInitialQuery = gql`
	{
		scoutedMatches {
			key
			status
			compLevel
			time
			team
			assignedTo {
				name
			}
		}
	}
`

interface ScoutMatchResponse {
	scoutedMatches?: [ScoutedMatch]
}

const DataLoader = (props) => {
	const [loadGreeting, { called, loading, data }] = useLazyQuery<ScoutMatchResponse>(ScoutMatchInitialQuery)

	const value = useContext(store)
	
	useEffect(() => {
		if (!data) {
			return
		}

		if (data.scoutedMatches) {
			value.dispatch({
				type: 'refreshData',
				data: data.scoutedMatches
			})
		}
	}, [data])
	
	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={() => {
				loadGreeting()
			}}
		>
			Pull Data
		</Button>
	)
}

export default DataLoader