/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteUser } from "@/redux/slice/wedding-slice";

export default async function DeleteDeleteUser(dispatch: Dispatch<AnyAction>, email: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/delete", {
                method: "DELETE",
                body: email,
            });
            if (res.status === 200) {
                dispatch(setDeleteUser(email));
                resolve(email);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
