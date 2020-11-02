import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import models from './models'
import typeDefs from './types';
import resolvers from './resolvers';
import { getUser } from './util/auth';

const SECRET = process.env.SECRET || 'efepemano';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const apollo = new ApolloServer({
    schema,
    context: ({req}) => {
        const token = req.headers['x-token'];
        const { id, role } = getUser( token, SECRET );
        return {
            models,
            SECRET,
            user: {
                id,
                role
            }
        }
    }
})

const PORT = process.env.PORT || '4000';

// sync({force: true}) <- fuerza a que borre y cree la base de datos
models.sequelize.sync().then( () => {
    apollo.listen(PORT).then(({ url }) => {
        console.log(`Servidor corriendo en: ${url}`);
    });
});
