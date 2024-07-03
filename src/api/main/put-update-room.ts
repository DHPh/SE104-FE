/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateRoom } from "@/redux/slice/wedding-slice";

export default async function PutUpdateRoom(
    dispatch: Dispatch<AnyAction>,
    {
        room_id,
        room_name,
        room_type,
        max_table,
        min_table,
        room_note,
    }: {
        room_id: string;
        room_name: string;
        room_type: string;
        max_table: number;
        min_table: number;
        room_note: string;
    },
) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI("/room/update", {
                method: "PUT",
                body: {
                    room_id,
                    room_name,
                    room_type,
                    max_table,
                    min_table,
                    room_note,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                dispatch(setUpdateRoom(data));
                resolve(data);
            } else {
                reject(response.statusText);
            }
        } catch (error) {
            reject(error);
        }
    });
}
