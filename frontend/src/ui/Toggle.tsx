import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

interface IToggleProps {
	value: boolean,
	setValue: Function,
	label: string,
}

const Toggle = ({ value, setValue, label }: IToggleProps) => {
	return (
		<FormControlLabel
			control={(
				<Switch
					checked={value}
					// TODO: Fix to type safety
					onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
						setValue(checked)
						return true
					}}
					// value="checkedB"
					color="primary"
				/>
			)}
			label={label}
		/>
	)
}

export default Toggle
