/* eslint-disable no-async-promise-executor */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateShift, ShiftList } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

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
                dispatch(setSuccess("Cập nhật ca thành công"));
                resolve(data.data);
                dispatch(setUpdateShift(shift));
            } else {
                dispatch(setError(data.message_vi));
                reject(data.message_vi);
            }
        } catch (error) {
            dispatch(setError(error as string));
            reject(error);
        }
    });
}
