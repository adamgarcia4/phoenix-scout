/* eslint-disable no-param-reassign */
import React, { useContext, useEffect } from 'react'
import { Typography } from '@material-ui/core'

import TableComponent, { HeadersInterface } from './ui/Table'
// import { MatchInterface } from './Interfaces'
import { ScoutedMatch } from '@shared/Interfaces'
import Button from '@material-ui/core/Button'

import { store } from './store'
import { useHistory } from 'react-router-dom'
import { paths } from "./App";
import useLocalStorage from './hooks/useLocalStorage'

const Home: React.FC = () => {
	const value = useContext(store)
	let history = useHistory()

	const headers: HeadersInterface[] = [
		{
			name: 'Match Name',
			key: 'key',
		},
		{
			name: 'Status',
			key: 'status'
		},
		{
			name: 'Team',
			key: 'team'
		},
		{
			name: 'Scout',
			key: 'action',
			getValue: (row: ScoutedMatch) => {
				return (
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setStoredValue(() => {
								return storedValue + 1
							})
							history.push(paths.getAddMatchPage(row.key))
						}}
					>
						Scout Now
					</Button>
				)
			}
		}
	]

	return (
		<div>
			<h1>Welcome to Phoenix Scout Home!</h1>
			<Typography variant="h4">
        Assigned to me
			</Typography>
			<TableComponent headers={headers} data={Object.values(value.state.scoutedMatches)}/>
		</div>
	)
}

export default Home
