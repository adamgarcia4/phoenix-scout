import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { ScoutedMatch, TeamInterface } from '@shared/Interfaces'
import Table, { HeadersInterface } from '../ui/Table'
import { store } from '../store'
import { paths } from '../App'

const Teams = () => {
	const value = useContext(store)
	const history = useHistory()

	const rawRows = Object.values(value.teams.state.documents)
	const sortedRows = rawRows.sort((a, b) => a.team_number - b.team_number)
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
			name: 'Pit Scouted?',
			key: 'pitScout',
			getValue: (row: TeamInterface) => {
				if (row.key in value.pitScout.state.documents) {
					return 'Yes'
				}

				return 'No'
			},
		},
		{
			name: 'Team Details',
			key: 'detail',
			getValue: (row: ScoutedMatch) => {
				const buttonsArr = []

				buttonsArr.push((
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							history.push(paths.teamDetailsPage.get(row.key))
						}}
						key="Team Details"
						style={{ marginRight: '5px' }}
					>
					See Team Details
					</Button>
				))

				buttonsArr.push((
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							history.push(paths.pitScout.get(row.key))
						}}
						key="Pit Scout"
					>
					Pit Scout
					</Button>
				))

				return buttonsArr
			},
		},
	]
	return (
		<div>
			<Table
				headers={headers}
				data={sortedRows}
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
