import React, { useReducer } from 'react'
import {
	// Button,
	// Typography,
	Box,
	Theme,
} from '@material-ui/core'
import { PitScout } from '@shared/Interfaces'
import Select from 'react-select'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import SaveIcon from '@material-ui/icons/Save'
import Fab from '@material-ui/core/Fab'

import Expansion from '../ui/Expansion'
import Toggle from '../ui/Toggle'

const getInitialState: () => PitScout = () => {
	return {
		fitUnderTrench: false,
		canClimb: false,
		ballCapacity: 0,
		canShootHigh: false,
		canShootLow: false,

		canDoStage2Color: false,
		canDoStage3Color: false,

		canAutonShoot: false,
		canAutonMove: false,

		canShoot: [],

		wheelSize: '',

		canVisionTrack: false,
	}
}

type IActions = {
	type: 'initializeData',
	data: PitScout
} | {
	type: 'updateField',
	key: string,
	value: any,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
	saveFab: {
		position: 'absolute',
		right: theme.spacing(2),
		bottom: theme.spacing(2),
	},
}))

const reducer = (prevState: PitScout, action: IActions) => {
	switch (action.type) {
	case 'initializeData':
		return action.data

	case 'updateField':
		return {
			...prevState,
			[action.key]: action.value,
		}
	default:
		return prevState
	}
}

export default () => {
	const styles = useStyles({})
	const [data, dispatch] = useReducer(reducer, getInitialState())

	const updateField = (key) => (val) => {
		dispatch({
			type: 'updateField',
			key,
			value: val,
		})
	}

	const submit = () => {
		console.log('data:', data)
	}
	const ballSelectOptions = [0, 1, 2, 3, 4, 5].map((num) => {
		return {
			label: num,
			value: num,
		}
	})
	return (
		<div>
			<Expansion
				sections={[
					{
						title: 'Pit Scout',
						content: (
							<div>
								<Box>
									<Toggle
										label="Can fit under trench?"
										value={data.fitUnderTrench}
										setValue={updateField('fitUnderTrench')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can climb?"
										value={data.canClimb}
										setValue={updateField('canClimb')}
									/>
								</Box>
								<Box>
									Ball Capacity
									<Select
										options={ballSelectOptions}
										onChange={(newVal: any) => {
											updateField('ballCapacity')(newVal.value)
										}}
										defaultValue={'ballCapacity' in data ? {
											label: data.ballCapacity,
											value: data.ballCapacity,
										} : null}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Shoot High"
										value={data.canShootHigh}
										setValue={updateField('canShootHigh')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Shoot Low"
										value={data.canShootLow}
										setValue={updateField('canShootLow')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can do stage 2 Color?"
										value={data.canDoStage2Color}
										setValue={updateField('canDoStage2Color')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can do stage 3 Color?"
										value={data.canDoStage3Color}
										setValue={updateField('canDoStage3Color')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Shoot in Auton?"
										value={data.canAutonShoot}
										setValue={updateField('canAutonShoot')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Move in Auton?"
										value={data.canAutonMove}
										setValue={updateField('canAutonMove')}
									/>
								</Box>
								<Box>
									<Toggle
										label="Can Vision Track"
										value={data.canVisionTrack}
										setValue={updateField('canVisionTrack')}
									/>
								</Box>
							</div>
						),
						expanded: true,
					},
				]}
			/>
			<Fab
				color="primary"
				className={styles.saveFab}
				// disabled={JSON.stringify(oldData) === JSON.stringify(data)}
				onClick={submit}
			>
				<SaveIcon />
			</Fab>
		</div>
	)
}
