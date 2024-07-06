/* eslint-disable camelcase */
/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateUser } from "@/redux/slice/wedding-slice";

// "email": "string",
//   "full_name": "string",
//   "phone_number": "string",
//   "birthday": "15/01/2024",
//   "id": "string"

export default async function PostUpdateUser(
    dispatch: Dispatch<AnyAction>,
    {
        email,
        full_name,
        phone_number,
        birthday,
        id,
    }: {
        email: string;
        full_name: string;
        phone_number: string;
        birthday: string;
        id: string;
    },
) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/update", {
                method: "POST",
                body: {
                    email,
                    full_name,
                    phone_number,
                    birthday,
                    id,
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                dispatch(
                    setUpdateUser({
                        email,
                        full_name,
                        phone_number,
                        birthday,
                        id,
                    }),
                );
                resolve(data);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
