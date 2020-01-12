import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'

const Home: React.FC = () => {
	return (
		<Fragment>
			<h1>Welcome to Phoenix Scout Home!</h1>
			<Button variant='contained' color='primary'>
				My First button
			</Button>
		</Fragment>
	)
}

export default Home