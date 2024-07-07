/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteRoomType } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

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
                dispatch(setSuccess("Xóa loại sảnh thành công"));
                dispatch(setDeleteRoomType(roomTypeId));
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
