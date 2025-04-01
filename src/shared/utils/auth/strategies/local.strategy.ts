import bcrypt from 'bcrypt';
import boom from '@hapi/boom';
import { Strategy } from "passport-local";

import User from "../../../../features/users/models/User.model";
import IUser from "../../../../features/users/interfaces/User.interfaces";


const LocalStrategy: Strategy = new Strategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            let user: IUser = (await User.findByEmail(email, true));
            const isMatch: boolean = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                done(boom.unauthorized('La Contraseña proporcionada es incorrecta'), false);
                return;
            }
            else if (!user.validated) {
                done(boom.locked('Cuenta no verificada, es necesario verificar tu correo'), false);
                return;
            }
            else if (!user.enabled) {
                done(boom.forbidden('Cuenta deshabilitada por tu organizacion. Contacta con Soporte Tecnico'), false);
                return;
            }

            user = await User.findById(user._id.toString(), false);
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    }
);


export default LocalStrategy;