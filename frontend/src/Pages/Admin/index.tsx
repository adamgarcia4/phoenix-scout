/* eslint-disable no-alert */
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
// import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { AxiosResponse } from 'axios'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Typography, Divider, Paper } from '@material-ui/core'

import styled from 'styled-components'

// import { Theme } from '@material-ui/core'
import tbaAxios from '../../config/tbaAxios'
import { MatchAPIResponse, TeamInterface, ScoutedMatch } from '../../Interfaces'
import PaperSection from '../../ui/PaperSection'

import backendAxios from '../../config/backendAxios'
import {
	EventSettingsSection, FlexContainer, FlexItem, FlexButton, FlexColumn,
} from './style'

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

	const classes = useStyles({})


	const getTeams = () => {
		const c = window.confirm('Do you really want to import many teams?')
		if (!c) {
			return
		}

		tbaAxios.get(`event/${eventCode}/teams/simple`).then((res: AxiosResponse<TeamInterface[]>) => {
			res.data.forEach((doc) => {
			})

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
		const res = await backendAxios.post('/scoutedMatch/seedEvent', {
			eventId: eventCode,
		})

		console.log('res:', res)

		// setOpen({
		// 	type: 'success',
		// 	message: `Team ${res.data.team_number} has been loaded!`,
		// })
	}

	const seedData = async () => {
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
			<EventSettingsSection
				header="Event Settings"
			>
				<FlexContainer>
					<FlexItem
						style={{
							marginRight: '5px',
						}}
					>
						<TextField
							label="Event Code"
							onChange={(event) => {
								setEventCode(event.target.value)
							}}
							value={eventCode}
						/>
					</FlexItem>
					<FlexColumn style={{ flex: 1, height: '100%' }}>
						<FlexButton variant="contained" color="primary" size="small" onClick={() => getTeams()}>
							Fetch Teams
						</FlexButton>
						<FlexButton variant="contained" color="primary" size="small" onClick={() => seedMatches()}>
			        Add Matches
						</FlexButton>
					</FlexColumn>


				</FlexContainer>
			</EventSettingsSection>


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
			<Button variant="contained" color="primary" onClick={() => seedData()}>
        Seed Data
			</Button>
		</>
	)
}
