import bcrypt from 'bcrypt';
import { createToken, tryLogin, refreshToken } from '../util/auth'

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
        signup: async ( _, args, { models, SECRET }) => {
            const user = args;
            user.password = await bcrypt.hash( user.password, 12 );
            const newUser = models.User.create( user )
            return { 
                user: newUser, 
                token: createToken(newUser.id, SECRET)
            };
        },
        login: async ( _, { email, password }, { models, SECRET }) => {
            return tryLogin( email, password, models, SECRET );
        },
        refreshToken: (_, { token }, { SECRET }) => {
            return refreshToken( token, SECRET );
        }
    }
}