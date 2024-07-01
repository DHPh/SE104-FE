/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteRoomType } from "@/redux/slice/wedding-slice";

export default async function DeleteDeleteRoomType(
    dispatch: Dispatch<AnyAction>,
    roomTypeId: string,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/room_type/delete", {
                method: "DELETE",
                body: {
                    rt_id: roomTypeId,
                },
            });
            if (res.status === 200) {
                dispatch(setDeleteRoomType(roomTypeId));
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
