import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';

export const createToken = async(userId, secret) => {
    const token = jwt.sign({
        userId: userId
    }, secret, {
        expiresIn: "15d"
    });
    return token;
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

    const token = await createToken(user.id, SECRET);
    return { user, token };
} 

export const refreshToken = (token, SECRET) => {
    if( !token ) {
        throw new AuthenticationError("No se ha proporcionado un token");
    }
    return jwt.compare(token, SECRET, (error, decoded) => {
        if( !error ) return token;
        if( error.name === "TokenExpiredError" ) {
            const { payload } = jwt.decode( token, { complete: true })
            if( !payload.userId ) {
                throw new AuthenticationError("No se ha proporcionado un token");
            }
            const newToken = createToken( payload.userId, SECRET );
            return newToken;
        } else {
            throw new AuthenticationError("El token no es válido");
        }
    });
}