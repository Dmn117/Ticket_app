import boom from '@hapi/boom';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt";

import User from "../../../../features/users/models/User.model";
import { JWT_PUBLIC_KEY } from "../../../config/constants";


const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_PUBLIC_KEY
};


const JwtStrategy = new Strategy(options, async (payload: JwtPayload, done) => {
    try {
        const user = await User.findById(payload.sub || '', true);

        if (!user.validated) {
            done(boom.unauthorized('Cuenta no verificada, es necesario verificar tu correo'), false);
            return;
        }
        else if (!user.enabled) {
            done(boom.unauthorized('Cuenta deshabilitada por tu organizacion. Contacta con Soporte Tecnico'), false);
            return;
        }

        return done(null, User.getShortUser(user));
    }
    catch (error) {
        return done(error, false);
    }
});


export default JwtStrategy;