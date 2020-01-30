import { ApolloServer } from "apollo-server";
import * as dotenv from "dotenv";
import { Model } from '@shared/model'

import resolvers from './resolvers'
import typeDefs from './type-defs'

dotenv.config()
console.log('process.env:', process.env)

console.log('Model.title:', new Model().title)

const server = new ApolloServer({ resolvers, typeDefs })
server.listen(process.env.SERVER_PORT).then(({ url }) => console.log(`Server ready at ${url}`))

if (module.hot) {
	module.hot.accept()
	module.hot.dispose(() => console.log('Module Disposed. '))
}