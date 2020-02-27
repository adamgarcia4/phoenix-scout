/* eslint-disable no-alert */
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'

// import { Theme } from '@material-ui/core'
import { SnackbarProvider, useSnackbar } from 'notistack'
import backendAxios from '../../config/backendAxios'
import {
	EventSettingsSection, FlexContainer, FlexItem, FlexButton, FlexColumn,
} from './style'

const Admin = () => {
	const [eventCode, setEventCode] = useState('2020caln')
	const { enqueueSnackbar } = useSnackbar()

	const getTeams = () => {
		const c = window.confirm('Do you really want to import teams?')
		if (!c) {
			return
		}

		backendAxios.post('teams/seed', {
			eventId: eventCode,
		}).then(() => {
			enqueueSnackbar('Teams successfully uploaded from TBA!', { variant: 'success' })
		}).catch((err) => {
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
