/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setAddUser, User } from "@/redux/slice/wedding-slice";

export default async function PostCreateUser(
    dispatch: Dispatch<AnyAction>,
    user: User,
    password: string,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/create", {
                method: "POST",
                body: {
                    email: user.email,
                    password,
                    role: user.role,
                    full_name: user.full_name,
                    phone_number: user.phone_number,
                    birthday: user.birthday,
                    id: user.id,
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                dispatch(setAddUser(user));
                resolve(data);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
