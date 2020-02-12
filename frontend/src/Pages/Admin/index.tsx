/* eslint-disable no-alert */
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { AxiosResponse } from 'axios'
import { makeStyles, createStyles } from '@material-ui/core/styles'

// import { Theme } from '@material-ui/core'
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack'
import tbaAxios from '../../config/tbaAxios'
import { TeamInterface } from '../../Interfaces'

import backendAxios from '../../config/backendAxios'
import {
	EventSettingsSection, FlexContainer, FlexItem, FlexButton, FlexColumn,
} from './style'


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

const Admin = () => {
	const [eventCode, setEventCode] = useState('2019cala')
	const [addTeam, setAddTeam] = useState('')

	const { enqueueSnackbar } = useSnackbar()
	const [open, setOpen] = useState<MessageI | false>(false)

	const classes = useStyles({})


	const getTeams = () => {
		const c = window.confirm('Do you really want to import teams?')
		if (!c) {
			return
		}

		backendAxios.post('teams/seed', {
			eventId: eventCode,
		}).then((res) => {
			enqueueSnackbar('Teams successfully uploaded from TBA!', { variant: 'success' })
		}).catch((err) => {
			console.log('err:', err)
			
			enqueueSnackbar(`Teams Unable to be uploaded from TBA.  Error: ${err}`, { variant: 'error' })
		})
	}

	const seedMatches = async () => {
		const c = window.confirm('Do you really want to import matches?')
		if (!c) {
			return
		}

		try {
			await backendAxios.post('/scoutedMatch/seedEvent', {
				eventId: eventCode,
			})

			enqueueSnackbar('Matches successfully uploaded from TBA!', { variant: 'success' })
		} catch (error) {
			enqueueSnackbar(`Matches Unable to be uploaded from TBA.  Error: ${error}`, { variant: 'error' })
		}
	}

	const seedData = async () => {
	}

	const handleClick = (variant: VariantType) => () => {
		enqueueSnackbar('BUTTON!', { variant })
	}

	return (
		<SnackbarProvider maxSnack={3}>
			<>
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
			</>
		</SnackbarProvider>
	)
}

export default function AdminWrapper() {
	return (
		<SnackbarProvider maxSnack={3}>
			<Admin />
		</SnackbarProvider>
	)
}
