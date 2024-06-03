/* eslint-disable no-async-promise-executor */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setRoomList } from "@/redux/slice/wedding-slice";

export default async function GetRoomList({ dispatch }: { dispatch: Dispatch<AnyAction> }) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/room/list");
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setRoomList(data.data));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
