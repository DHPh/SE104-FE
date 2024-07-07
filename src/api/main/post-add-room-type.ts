/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { RoomTypeList, setAddRoomType } from "@/redux/slice/wedding-slice";
import { generateRandomId } from "@/functions/random";

export default async function PostAddRoomType(
    dispatch: Dispatch<AnyAction>,
    roomType: RoomTypeList,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const id = roomType.rt_id || generateRandomId();
            const res = await fetchAPI("/room_type/new", {
                method: "POST",
                body: {
                    rt_id: id,
                    rt_name: roomType.rt_name,
                    rt_price: roomType.rt_price,
                },
            });
            if (res.status === 200) {
                const res2 = await fetchAPI(`/room_type/info/${id}`, {
                    method: "GET",
                });
                const data = await res2.json();
                dispatch(setAddRoomType(data.data));
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
