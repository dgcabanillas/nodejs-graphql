import bcrypt from 'bcrypt';
import { tryLogin } from '../util/auth'

export default {
    Query: {
        allUsers: (_, args, { models }) => {
            return models.User.findAll({
                include: [{
                    model: models.Article,
                    as: "articles",
                    include: [{
                        model: models.Tag,
                        as: "tags"
                    }]
                }]
            });
        }
    },
    Mutation: {
        signUp: async ( _, args, { models }) => {
            const user = args;
            user.password = await bcrypt.hash( user.password, 12 );
            return models.User.create( user );
        },
        login: async ( _, { email, password }, { models, SECRET }) => {
            return tryLogin( email, password, models, SECRET );
        }
    }
}