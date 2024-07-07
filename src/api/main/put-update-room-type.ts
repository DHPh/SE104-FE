/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { RoomTypeList, setUpdateRoomType } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default async function PutUpdateRoomType(
    dispatch: Dispatch<AnyAction>,
    roomType: RoomTypeList,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/room_type/update", {
                method: "PUT",
                body: {
                    rt_id: roomType.rt_id,
                    rt_name: roomType.rt_name,
                    rt_price: roomType.rt_price,
                },
            });
            if (res.status === 200) {
                dispatch(setSuccess("Cập nhật loại sảnh thành công"));
                dispatch(setUpdateRoomType(roomType));
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
