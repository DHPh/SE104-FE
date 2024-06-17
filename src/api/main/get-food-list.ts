/* eslint-disable no-async-promise-executor */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setFoodList } from "@/redux/slice/wedding-slice";

export default async function GetFoodList({ dispatch }: { dispatch: Dispatch<AnyAction> }) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/food/list");
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setFoodList(data.data));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
