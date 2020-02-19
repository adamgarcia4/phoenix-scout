import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { ScoutedMatch } from '@shared/Interfaces'
import { TeamInterface } from '../Interfaces'
import Table, { HeadersInterface } from '../ui/Table'
import { store } from '../store'
import { paths } from '../App'

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
			name: 'Team Details',
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
						See Team Details
					</Button>
				)
			},
		},
	]
	return (
		<div>
			<Table
				headers={headers}
				data={Object.values(value.teams.state.documents)}
				options={{
					globalFilter: (origRows, keysArr, c: string) => {
						return origRows.filter((origRow) => {
							const actualObj: TeamInterface = origRow.original

							if (actualObj.team_number.toString().includes(c)) {
								return true
							}

							return false
						})
					},
				}}
			/>
		</div>
	)
}

export default Teams
