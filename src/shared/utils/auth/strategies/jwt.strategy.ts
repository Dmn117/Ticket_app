import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt";
import { JWT_PUBLIC_KEY } from "../../../config/constants";
import { JwtPayload } from "jsonwebtoken";
import User from "../../../../features/users/models/User.model";
import { Roles } from "../../../config/enumerates";
import Application from "../../../../features/applications/models/Application.model";


const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_PUBLIC_KEY
};


const JwtStrategy: Strategy = new Strategy(options, async (payload: JwtPayload, done) => {
    try {
        const entity = (payload.role || '') === Roles.APPLICATION ? Application : User;

        await entity.auth(payload.sub || '');

        return done(null, payload);
    }
    catch (error){ 
        return done(error, false);
    }
});


export default JwtStrategy;