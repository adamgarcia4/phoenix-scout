/* eslint-disable no-alert */
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
// import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { AxiosResponse } from 'axios'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import firebase from 'firebase'

// import { Theme } from '@material-ui/core'
import tbaAxios from '../config/tbaAxios'
import { MatchAPIResponse, TeamInterface, ScoutedMatch } from '../Interfaces'

// https://forum.quasar-framework.org/topic/2560/solved-pwa-force-refresh-when-new-version-released/21

const Alert = (props: AlertProps) =>
// eslint-disable-next-line
   <MuiAlert elevation={6} variant="filled" {...props} />

interface MessageI {
  type: string,
  message: string,
}

const useStyles = makeStyles(() => createStyles({
	root: {
		width: '100%',
	},
	alert: {
		marginBottom: '15px',
	},
}))

export default function Admin() {
	const [eventCode, setEventCode] = useState('2019cala')
	const [addTeam, setAddTeam] = useState('')
	const [open, setOpen] = useState<MessageI | false>(false)

	const classes = useStyles()


	const getTeams = () => {
		const c = window.confirm('Do you really want to import many teams?')
		if (!c) {
			return
		}

		const db = firebase.firestore()
		const batch = db.batch()

		tbaAxios.get(`event/${eventCode}/teams/simple`).then((res: AxiosResponse<TeamInterface[]>) => {
			res.data.forEach((doc) => {
				batch.set(db.collection('teams').doc(doc.key), doc)
			})

			batch.commit()

			setOpen({
				type: 'success',
				message: `All ${res.data.length} Teams have been loaded up!`,
			})
		})
	}

	const addTeamToFb = () => {
		const c = window.confirm('Do you really want to import this team?')
		if (!c) {
			return
		}

		tbaAxios.get(`team/frc${addTeam}/simple`).then((res: AxiosResponse<TeamInterface>) => {
			firebase.firestore().collection('teams').doc(res.data.key).update(res.data)

			setOpen({
				type: 'success',
				message: `Team ${res.data.team_number} has been loaded!`,
			})
		}).catch(() => {
			setOpen({
				type: 'error',
				message: `Team ${addTeam} could not be loaded!`,
			})
		})
	}

	const seedMatches = async () => {
		const res: AxiosResponse<MatchAPIResponse[]> = await tbaAxios.get(`/event/${eventCode}/matches`)

		const scoutMatches: ScoutedMatch[] = []

		for (const match of res.data) {
			const { alliances } = match

			if (match.comp_level === 'qm' && alliances) {
				for (const teamKey of alliances.red.team_keys) {
					scoutMatches.push({
						key: `${match.key}_${teamKey}`,
						match: match.key,
						time: match.time || 0,
						team: teamKey,
						compLevel: match.comp_level,
						side: 'red',
						status: 'toBeAssigned',
					})
				}

				for (const teamKey of alliances.blue.team_keys) {
					scoutMatches.push({
						key: `${match.key}_${teamKey}`,
						match: match.key,
						time: match.time || 0,
						team: teamKey,
						compLevel: match.comp_level,
						side: 'blue',
						status: 'toBeAssigned',
					})
				}
			}
		}

		console.log('scoutMatches:', scoutMatches)


		// firebase.firestore().collection('scoutMatches')
		let batch = firebase.firestore().batch()
		let counter = 0

		for await (const scoutMatch of scoutMatches) {
			const ref = firebase.firestore().collection('scoutMatches').doc(scoutMatch.key)
			if (counter < 500) {
				batch.set(ref, scoutMatch)
				counter += 1
			} else {
				await batch.commit()
				batch = firebase.firestore().batch()
				counter = 0
			}
		}

		batch.commit().then(() => console.log('done!'))
		// console.log('scoutMatches:', scoutMatches)

		// firebase.firestore().collection('teams').doc(res.data.key).update(res.data)

		// setOpen({
		// 	type: 'success',
		// 	message: `Team ${res.data.team_number} has been loaded!`,
		// })
	}

	const seedData = async () => {
		firebase.firestore().collection('scoutMatches').add({
			compLevel: 'qm',
			key: 'key1',
			match: 'match1',
			side: 'red',
			status: 'toBeAssigned',
			team: 'frc4',
			time: 1,
		} as ScoutedMatch)
	}

	const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	const getAlertSeverity = () => {
		if (!open) {
			return undefined
		}

		if (open.type === 'success') {
			return 'success'
		}

		if (open.type === 'error') {
			return 'error'
		}

		return 'success'
	}
	return (
		<>
			{open ? (
				<Alert onClose={handleClose} severity={getAlertSeverity()} className={classes.alert}>
					{open.message}
				</Alert>
			) : null}
			<TextField
				label="Event Code"
				onChange={(event) => {
					setEventCode(event.target.value)
				}}
				value={eventCode}
			/>
			<Button variant="contained" color="primary" onClick={() => getTeams()}>
        Fetch Teams
			</Button>

			<TextField
				label="Add team"
				onChange={(event) => {
					setAddTeam(event.target.value)
				}}
				value={addTeam}
			/>
			<Button variant="contained" color="primary" onClick={() => addTeamToFb()}>
        Fetch Team
			</Button>
			<Button variant="contained" color="primary" onClick={() => seedMatches()}>
        Add Matches
			</Button>
			<Button variant="contained" color="primary" onClick={() => seedData()}>
        Seed Data
			</Button>
		</>
	)
}
