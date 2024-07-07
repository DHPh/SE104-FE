/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteFood } from "@/redux/slice/wedding-slice";

export default async function DeleteDeleteFood(dispatch: Dispatch<AnyAction>, foodId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/food/delete?food_id=${foodId}`, {
                method: "DELETE",
            });
            if (res.status === 200) {
                dispatch(setDeleteFood(foodId));
                resolve(res);
            } else {
                reject(res);
            }
        } catch (error) {
            console.log("Error: ", error);
            reject(error);
        }
    });
}
