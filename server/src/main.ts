import { ApolloServer } from "apollo-server";
import * as dotenv from "dotenv";
import { ScoutedMatch } from '@shared/Interfaces'

import resolvers from './resolvers'
import typeDefs from './type-defs'

dotenv.config()

const server = new ApolloServer({ resolvers, typeDefs })
server.listen(process.env.SERVER_PORT).then(({ url }) => console.log(`Server ready at ${url}`))

if (module.hot) {
	module.hot.accept()
	module.hot.dispose(() => console.log('Module Disposed. '))
}