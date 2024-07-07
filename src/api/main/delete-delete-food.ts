/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteFood } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default async function DeleteDeleteFood(dispatch: Dispatch<AnyAction>, foodId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/food/delete?food_id=${foodId}`, {
                method: "DELETE",
            });
            if (res.status === 200) {
                dispatch(setDeleteFood(foodId));
                dispatch(setSuccess("Xóa món ăn thành công"));
                resolve(res);
            } else {
                const data = await res.json();
                dispatch(setError(data.message_vi));
                reject(res);
            }
        } catch (error) {
            dispatch(setError(error as string));
            console.log("Error: ", error);
            reject(error);
        }
    });
}
