/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteRoom } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

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
                dispatch(setSuccess("Xóa sảnh thành công"));
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
