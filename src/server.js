import Http from 'http';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import models from './models'
import typeDefs from './types';
import resolvers from './resolvers';


const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const apollo = new ApolloServer({
    schema,
    context: {
        models
    }
})

const PORT = process.env.PORT || '4000';

// sync({force: true}) <- fuerza a que borre y cree la base de datos
models.sequelize.sync().then( () => {
    apollo.listen(PORT).then(({ url }) => {
        console.log(`Servidor corriendo en: ${url}`);
    });
});
