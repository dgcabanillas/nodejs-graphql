import Http from 'http';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';

const typeDefs = `
    type Hola {
        message: String!
    }
    type Query {
        hola(name: String!):Hola!
    }
`;

const resolvers = {
    Query: {
        hola: (_, {name}) => {
            return { message: `hola ${name}`}
        }
    }
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const apollo = new ApolloServer({
    schema
})

const PORT = process.env.PORT || '4000';

apollo.listen(PORT).then(({ url }) => {
    console.log(`Servidor corriendo en: ${url}`);
});