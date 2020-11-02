import bcrypt from 'bcrypt';
import { 
    createToken, 
    tryLogin, 
    refreshToken, 
    autentication,
    validateRole 
} from '../util/auth'

export default {
    Query: {
        allUsers: autentication (
            validateRole('NORMAL')(
                (_, args, { models }) => {
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
            )
        )
    },
    Mutation: {
        signup: async ( _, args, { models, SECRET }) => {
            const user = args;
            user.password = await bcrypt.hash( user.password, 12 );
            const newUser = models.User.create( user );
            return { 
                user: newUser, 
                token: createToken(newUser.id, newUser.role, SECRET)
            };
        },
        login: async ( _, { email, password }, { models, SECRET }) => {
            return tryLogin( email, password, models, SECRET );
        },
        refreshToken: (_, { token }, { SECRET }) => {
            return refreshToken( token, SECRET );
        },
        userEdit: async (_, args, { models }) => {
            const newUser = await models.User.update(
                args.dataEdit, 
                { where: { id: args.id}, returning:true }
            ).then( usr => {
                return usr[1][0];
            }).catch( err => {
                return new Error( err.errors[0].message )
            });
            return newUser;
        }
    }
}