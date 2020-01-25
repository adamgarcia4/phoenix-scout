import React, { useState, useEffect } from 'react'
// import { makeStyles } from '@material-ui/core/styles'
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableContainer from '@material-ui/core/TableContainer'
// import TableHead from '@material-ui/core/TableHead'
// import TableRow from '@material-ui/core/TableRow'
// import Paper from '@material-ui/core/Paper'
// import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'

import firebase from 'firebase/app'
import TableComponent from './ui/Table'

import 'firebase/firestore'

import { MatchInterface } from './Interfaces'

const Home: React.FC = () => {
	// const [one, two] = useState
	const [matchesArr, setMatchesArr] = useState<MatchInterface[]>([])

	useEffect(() => {
		firebase.firestore().collection('matches').onSnapshot((docs) => {
			const newMatches = docs.docs.map((doc: any) => {
				const matchObj: MatchInterface = doc.data()
				return matchObj
			})

			setMatchesArr(() => [...matchesArr, ...newMatches])
		})
	})

	useEffect(() => {
		// firebase.firestore().collection('teams').onSnapshot((docs) => {
		// const newMatches = docs.docs.map((doc: any) => {
		// const matchObj: MatchInterface = doc.data()

		// return matchObj
		// })

		// // setMatchesArr(() => [...matchesArr, ...newMatches])
		// })

		// .onSnapshot((docs) => {
		//   docs.docs.map(doc => {
		//     const test = doc.data()
		//     test
		//   })

		//   const newMatches = docs.docs.map((doc) => {
		//     const newMatch = doc.data()

		//     return newMatch
		//   })

		//   setMatchesArr(() => [...matchesArr, ...newMatches])
		// })
	}, [])

	const headers = [
		{
			name: '# High Auto',
			key: 'numHighAuto',
		},
		{
			name: '# Low Auto',
			key: 'numLowAuto',
		},
		{
			name: '# High Teleop',
			key: 'numHighTele',
		},
		{
			name: '# Low Teleop',
			key: 'numLowTele',
		},
		{
			name: 'Did Engage Colorwheel',
			key: 'isColorWheel',
		},
		{
			name: 'Did Climb',
			key: 'didClimb',
		},
	]

	const tableData = matchesArr.map((matchData) => {
		return {
			...matchData,
			didClimb: matchData.didClimb ? 'Yes' : 'No',
			isColorWheel: matchData.isColorWheel ? 'Yes' : 'No',
		}
	})

	return (
		<div>
			<h1>Welcome to Phoenix Scout Home!</h1>
			<Typography variant="h4">
        Current Matches
			</Typography>
			<TableComponent headers={headers} data={tableData} />
		</div>
	)
}

export default Home
