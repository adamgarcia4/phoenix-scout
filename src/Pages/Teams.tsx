import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import { TeamInterface } from '../Interfaces'
import Table from '../ui/Table'
// import 'firebase/firestore'

const Teams = () => {
	const [teams, setTeams] = useState<TeamInterface[]>([])

	useEffect(() => {
		const unsubscribe = firebase.firestore().collection('teams').onSnapshot((docs) => {
			const teamsArr = docs.docs.map((doc) => doc.data() as TeamInterface)

			setTeams(teamsArr)
		})

		return () => {
			unsubscribe()
		}
	}, [])

	const headers = [
		{
			name: '#',
			key: 'team_number',
		},
		{
			name: 'Name',
			key: 'nickname',
		},
	]
	return (
		<div>
			<Table headers={headers} data={teams} />
		</div>
	)
}

export default Teams
