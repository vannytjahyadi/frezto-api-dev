import { getRepository } from "typeorm";

import { User } from "@entity/User.entity";

import { ErrorService } from "@service/Error.service";

export class RegisterController {
    
    constructor() {}

    async register(req:any, res:any) {

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({email: req.body.email});

        if (user) {
            const userToken = await user.userToken;

            if (user['is_verified']) {
                ErrorService.sendErrorResponse(res, 50001);
                return false;
            } else {
                User.sendOtp(user, userToken['otp_code']);
            }
        } else {
           const newUser = await User.createUser(req.body);
           User.sendOtp(newUser, newUser['userToken']['otp_code']);
        }

        res.status(200).json({
            result: "Success"
        });
    }
}