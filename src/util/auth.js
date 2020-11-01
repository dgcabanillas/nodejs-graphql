import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';

const createTokens = async(user, secret) => {
    const createToken = jwt.sign({
        user: _.pick(user, ['id'])
    }, secret, {
        expiresIn: '15d'
    });

    return Promise.all([createToken]);
}

export const tryLogin = async(email, password, models, SECRET) => {
    const user = await models.User.findOne({ where: {email}, raw: true });
    if( !user ) {
        throw new AuthenticationError('Esta cuenta no existe');
    }

    const valid = await bcrypt.compare( password, user.password );
    if( !valid ) {
        throw new AuthenticationError('La cuenta o contraseña es incorrecta');
    }

    const [token] = await createTokens(user, SECRET);
    return { token };
} 