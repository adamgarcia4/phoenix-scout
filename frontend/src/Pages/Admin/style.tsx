import styled from 'styled-components'
import PaperSection from '../../ui/PaperSection'
import Button from '@material-ui/core/Button'


export const EventSettingsSection = styled(PaperSection)`
	width: 30%;
	margin: 0 auto;
`

export const FlexContainer = styled.div`
	display: flex;
	justify-content: center;
`

export const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
`

export const FlexItem = styled.div`
	flex: 1;
`

export const FlexButton = styled(Button)`
	&& {
		flex: 1;
		margin-bottom: 5px;
		:last-of-type {
			margin-bottom: 0px;
		}
	}
`

export const Test = 'hi'
export const Yo = 'hi'