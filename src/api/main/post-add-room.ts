/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setAddRoom } from "@/redux/slice/wedding-slice";
import { generateRandomId } from "@/functions/random";

export default async function PostAddRoom(
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
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI("/room/new", {
                method: "POST",
                body: {
                    room_id: room_id || generateRandomId(),
                    room_name,
                    room_type,
                    max_table,
                    min_table,
                    room_note,
                },
            });
            if (!response.ok) {
                reject(response.statusText);
            }
            dispatch(
                setAddRoom({
                    room_id: room_id || generateRandomId(),
                    room_name,
                    room_type,
                    max_table,
                    min_table,
                    note: room_note,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }),
            );
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
