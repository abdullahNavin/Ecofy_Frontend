"use server"

import { userService } from "../service/user.service"


export const getSessionAction = async () => {
    const session = await userService.getSession()
    return session
}