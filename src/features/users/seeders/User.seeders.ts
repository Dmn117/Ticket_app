import { ADMIN_DEFAULT_EMAIL, ADMIN_EMAIL, ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_PASSWORD } from "../../../shared/config/constants";
import { Roles } from "../../../shared/config/enumerates";
import User from "../models/User.model";
import UserSchema from "../schemas/User.schema";





class UserSeeders {

    //! Private

    //! Public


    //? Generate Admin User
    public static adminUser = async (): Promise<void> => {
        try {
            const exists = await UserSchema.exists({ email: ADMIN_EMAIL });

            if (exists) return;

            await User.create({
                firstName: ADMIN_FIRST_NAME,
                lastName: ADMIN_LAST_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: Roles.ADMIN,
                reporter: true,
                validated: ADMIN_EMAIL === ADMIN_DEFAULT_EMAIL ? true : false
            });
            console.log(`✔️ Admin User \x1b[32mcreated successfully\x1b[0m`);
        }
        catch(error) {
            console.log(`❌ Admin User \x1b[31mhas could not be created\x1b[0m ${error}`);
        }
    };
}



export default UserSeeders;