import { IResolvers, IResolverObject } from "apollo-server";
import { ScoutedMatch } from "@shared/Interfaces"
import { ScoutedMatchModel } from './models'

interface ScoutedMatchArgs {
	filter?: {
		team?: string,
	}
}

const resolverMap: IResolvers = {
	Query: {
		testMessage: (): string => 'Hello World!',
		scoutedMatches: (parent, args: ScoutedMatchArgs, context, info): ScoutedMatch[]=> {
			const { team = '' } = args?.filter ?? {}
			
			if (Object.keys(args).length === 0) {
				return ScoutedMatchModel.get()
			}

			return ScoutedMatchModel.get((match => {
				if (team && match.team === team) {
					return true
				}

				return false
			}))
		}
	}
}

export default resolverMap