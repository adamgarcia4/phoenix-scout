import React, { useState, useEffect } from 'react'
import { TeamInterface } from '../Interfaces'
import Table from '../ui/Table'

const Teams = () => {
	const [teams, setTeams] = useState<TeamInterface[]>([])

	const headers = [
		{
			name: '#',
			key: 'team_number',
		},
		{
			name: 'Name',
			key: 'nickname',
		},
	]
	return (
		<div>
			<Table headers={headers} data={teams} />
		</div>
	)
}

export default Teams
