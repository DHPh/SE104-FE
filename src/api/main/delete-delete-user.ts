/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteUser } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default async function DeleteDeleteUser(dispatch: Dispatch<AnyAction>, email: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/delete", {
                method: "DELETE",
                body: email,
            });
            if (res.status === 200) {
                dispatch(setDeleteUser(email));
                dispatch(setSuccess("Xóa người dùng thành công"));
                resolve(email);
            } else {
                const data = await res.json();
                dispatch(setError(data.message_vi));
                reject(res);
            }
        } catch (error) {
            dispatch(setError(error as string));
            console.error(error);
            reject(error);
        }
    });
}
