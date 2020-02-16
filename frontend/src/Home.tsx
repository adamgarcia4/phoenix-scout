/* eslint-disable no-param-reassign */
import React, { useContext, useState } from 'react'
// import { Typography } from '@material-ui/core'

import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'

import { MatchAPIResponse } from '@shared/Interfaces'
import Select from 'react-select'
import TableComponent, { HeadersInterface } from './ui/Table'
import { store } from './store'
import { paths } from './App'

const Home: React.FC = () => {
	const value = useContext(store)
	const history = useHistory()

	const relevantMatches = Object.values(value.matches.state.documents)
		.filter((match) => {
			return match.comp_level === 'qm'
		})
		.sort((a, b) => a.match_number - b.match_number)

	console.log('relevantMatches:', relevantMatches)

	const [teamsToScout, setTeamsToScout] = useState<{[key: string]: string}>({})

	const headers: HeadersInterface[] = [
		{
			name: 'Match #',
			key: 'match',
			getValue: (row: MatchAPIResponse) => {
				return `${row.comp_level}${row.match_number}`
			},
		},
		{
			name: 'Teams',
			key: 'teams',
			getValue: (row: MatchAPIResponse) => {
				const teamsList = []

				for (const side of Object.keys(row?.alliances)) {
					for (const teamKey of row.alliances[side].team_keys) {
						teamsList.push({
							value: teamKey,
							label: teamKey,
						})
					}
				}

				return (
					<Select
						options={teamsList}
						onChange={(selectedVal) => {
							setTeamsToScout({
								...teamsToScout,
								[row.key]: selectedVal.value,
							})
						}}
					/>
				)
			},
		},
		{
			name: 'Actions',
			key: 'action',
			getValue: (row: MatchAPIResponse) => {
				return (
					<Button
						variant="contained"
						color="primary"
						disabled={!teamsToScout[row.key]}
						onClick={() => {
							history.push(paths.addMatchPage.get(row.key, teamsToScout[row.key]))
						}}
					>
						Scout Now
					</Button>
				)
			},
			sort: false,
		},
	]

	// const matches = value.matches.state.documents
	// console.log('matches:', matches)

	return (
		<div>
			<h1>Welcome to Phoenix Scout Home!</h1>

			<TableComponent
				headers={headers}
				data={relevantMatches}
				options={{
					globalFilter: (origRows, keysArr, c) => {
					// console.log('origRows:', origRows)
					// console.log('keysArr:', keysArr)
					// console.log('c:', c)

						return origRows.filter((origRow) => {
							const actualObj = origRow.original

							if (actualObj.key.includes(c)) {
								return true
							}

							if (actualObj.alliances) {
								if (
									actualObj.alliances.blue.team_keys.includes(c)
								|| actualObj.alliances.red.team_keys.includes(c)
								) {
									return true
								}
							}

							return false
						})
					},
				}}
			/>
		</div>
	)
}

export default Home
