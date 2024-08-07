/* eslint-disable camelcase */
/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateUser } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

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
                dispatch(setSuccess("Cập nhật thông tin người dùng thành công"));
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
            } else {
                const data = await res.json();
                dispatch(setError(data.message_vi));
                reject(data.message_vi);
            }
        } catch (error) {
            dispatch(setError(error as string));
            console.error(error);
            reject(error);
        }
    });
}
