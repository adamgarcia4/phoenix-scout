import React, { useState } from 'react'

import {
	Typography,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Theme,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
	section: {
		margin: 'auto',
		width: '80%',
		padding: '20px',
	},
	submitButton: {
		marginTop: '30px',
	},
	saveFab: {
		position: 'absolute',
		right: theme.spacing(2),
		bottom: theme.spacing(2),
	},
}))


interface ExpansionSectionProps {
	expanded: string | false,
	handlePanelChange: Function,
	title: string,
	content: JSX.Element,
}

const ExpansionSection = ({
	expanded,
	handlePanelChange,
	title,
	content,
}: ExpansionSectionProps) => {
	const classes = useStyles()

	return (
		<ExpansionPanel
			expanded={expanded === title}
			onChange={handlePanelChange(title)}
		>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography className={classes.heading}>{title}</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				{content}
			</ExpansionPanelDetails>
		</ExpansionPanel>
	)
}

interface ExpansionProps {
	sections: {
		title: string,
		content: JSX.Element,
	}[]
}
const Expansion = ({
	sections,
}: ExpansionProps) => {
	const classes = useStyles()
	// TODO: Option to start with a panel expanded
	const [expanded, setExpanded] = useState<string | false>(false)

	const handlePanelChange = (panel: string) => (
		event: React.ChangeEvent<{}>,
		isExpanded: boolean,
	) => {
		setExpanded(isExpanded ? panel : false)
	}

	return (
		<div className={classes.root}>
			{sections.map((section) => {
				return (
					<ExpansionSection
						content={section.content}
						title={section.title}
						key={section.title}
						handlePanelChange={handlePanelChange}
						expanded={expanded}
					/>
				)
			})}

		</div>
	)
}

export default Expansion
