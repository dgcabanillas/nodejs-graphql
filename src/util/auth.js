import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';

export const createToken = async(userId, role, secret) => {
    const token = jwt.sign({
        id: userId,
        role: role
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

    const token = await createToken(user.id, user.role, SECRET);
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
            if( !payload.id ) {
                throw new AuthenticationError("No se ha proporcionado un token");
            }
            const newToken = createToken( payload.id, payload.role, SECRET );
            return newToken;
        } else {
            throw new AuthenticationError("El token no es válido");
        }
    });
}

export const getUser = (token, SECRET) => {
    try {
        if( token ) {
            return jwt.verify( token, SECRET );
        }
        return -1;
    } catch ( error ) {
        throw new AuthenticationError( error.name );
    }
}

export const autentication = next => (_, args, context) => {
    if( !context.user.id ) {
        throw new AuthenticationError("Autenticacion inválida"); 
    }
    return next(_, args, context);
}

export const validateRole = role => next => (_, args, context) => {
    if( context.user.role === 'ADMIN' ) {
        return next(_, args, context);
    }
    if( context.user.role !== role ) {
        throw new AuthenticationError("No tiene los permisos necesarios");
    }
    return next(_, args, context);
}