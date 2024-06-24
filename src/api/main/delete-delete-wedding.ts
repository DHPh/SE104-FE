/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteWedding } from "@/redux/slice/wedding-slice";

export default async function DeleteDeleteWedding(
    dispatch: Dispatch<AnyAction>,
    wedding_id: string,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/wedding/${wedding_id}/delete`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setDeleteWedding(wedding_id));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
