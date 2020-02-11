import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { TeamInterface } from '../Interfaces'
import Table, { HeadersInterface } from '../ui/Table'
import { store } from '../store'
import Button from '@material-ui/core/Button'
import { paths } from '../App'
import { ScoutedMatch } from '@shared/Interfaces'

const Teams = () => {
	const value = useContext(store)
	const history = useHistory()

	const headers: HeadersInterface[] = [
		{
			name: '#',
			key: 'team_number',
		},
		{
			name: 'Name',
			key: 'nickname',
		},
		{
			name: 'See Details',
			key: 'detail',
			getValue: (row: ScoutedMatch) => {
				return (
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							history.push(paths.teamDetailsPage.get(row.key))
						}}
					>
						Scout Now
					</Button>
				)
			},
		},
	]
	return (
		<div>
			<Table headers={headers} data={Object.values(value.teams.state.documents)} />
		</div>
	)
}

export default Teams
