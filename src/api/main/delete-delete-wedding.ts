/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteWedding } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

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
                dispatch(setSuccess("Xóa tiệc cưới thành công"));
                resolve(data.data);
                dispatch(setDeleteWedding(wedding_id));
            } else {
                dispatch(setError(data.message_vi));
                reject(data.message_vi);
            }
        } catch (error) {
            dispatch(setError(error as string));
            reject(error);
        }
    });
}
