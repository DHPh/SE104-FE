/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteRoom } from "@/redux/slice/wedding-slice";

export default async function DeleteDeleteRoom(dispatch: Dispatch<AnyAction>, roomId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/room/delete", {
                method: "DELETE",
                body: {
                    room_id: roomId,
                },
            });
            if (res.status === 200) {
                dispatch(setDeleteRoom(roomId));
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
