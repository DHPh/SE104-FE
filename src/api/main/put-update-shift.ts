/* eslint-disable no-async-promise-executor */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateShift, ShiftList } from "@/redux/slice/wedding-slice";

export default async function PutUpdateShift({
    dispatch,
    shift,
}: {
    dispatch: Dispatch<AnyAction>;
    shift: ShiftList;
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/shift/update", {
                method: "PUT",
                body: {
                    shift_name: shift.shift_name,
                    status: shift.activate,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setUpdateShift(shift));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
