import React from 'react'
import {
	Theme,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		width: '100%',
	},
	saveFab: {
		position: 'absolute',
		right: theme.spacing(2),
		bottom: theme.spacing(2),
	},
	matchSummaryContainer: {
		padding: '10px',
		marginBottom: '15px',
		display: 'flex',
	},
	groupedFieldContainer: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	groupedFieldLabel: {
		fontWeight: 'bold',
	},
}))

interface IGroupedField {
	label: string | number,
	value: string | number,
	isVertical?: boolean,
}

const GroupedField = ({ label, value, isVertical = false }: IGroupedField) => {
	const styles = useStyles({})

	return (
		<div style={{
			display: 'flex',
			flexDirection: isVertical ? 'column' : 'row',
			flex: 1,
		}}
		>
			{/* <div className={styles.groupedFieldContainer}> */}
			<span className={styles.groupedFieldLabel}>{label}</span>
			<span>{value}</span>
		</div>
	)
}

interface ISummaryProps {
	data: IGroupedField[],
	isVertical?: boolean,
}

const SummaryPanel = ({ data, isVertical = true }: ISummaryProps) => {
	const styles = useStyles({})

	return (
		<Paper style={{
			padding: '10px',
			marginBottom: '15px',
			display: 'flex',
			flexDirection: isVertical ? 'row' : 'column',
		}}
		>
			{data.map((groupField) => {
				return (
					<GroupedField
						label={groupField.label}
						value={groupField.value}
						isVertical={isVertical}
						key={groupField.label}
					/>
				)
			})}
		</Paper>
	)
}

export default SummaryPanel
