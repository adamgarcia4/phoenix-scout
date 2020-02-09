import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { store } from '../store'

const TeamDetail = () => {
	const value = useContext(store)
	const params = useParams<{ teamNum: string }>()
	const { teamNum } = params

	const teamMatchScoutsArr = Object.values(value.state.scoutedMatches)
		.filter((match) => {
			return (
				match.team === teamNum
				&& match.data
			)
		})

	console.log('teamMatchScoutsArr:', teamMatchScoutsArr)

	return (
		<div>
			<h1>{teamNum}</h1>
			
			{teamMatchScoutsArr.map((match) => {
				return match.key
			})}
		</div>
	)
}

export default TeamDetail
