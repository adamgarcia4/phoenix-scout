import { gql } from 'apollo-server'

export default gql`
	enum MatchStatus {
		toBeAssigned
		assigned
		notScouted
		inProgress
		scouted
	}

	enum MatchType {
		qm
		ef
		qf
		sf
		f
	}

	type User {
		name: String,
	}

	type ScoutedMatch {
		key: String,
		status: MatchStatus,
		compLevel: MatchType,
		match: String,
		team: String,
		time: Float,
		assignedTo: User
	}

	type Query {
		scoutedMatches: [ScoutedMatch]
		"""
		Test Message
		"""
		testMessage: String!
	}
`