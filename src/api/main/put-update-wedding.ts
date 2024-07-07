/* eslint-disable no-param-reassign */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateWedding, UpdatedWedding } from "@/redux/slice/wedding-slice";
import { formatDateFromISOString } from "@/functions/convert-data";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default async function PutUpdateWedding({
    dispatch,
    wedding_id,
    wedding_info,
}: {
    dispatch: Dispatch<AnyAction>;
    wedding_id: string;
    wedding_info: UpdatedWedding;
}) {
    return new Promise(async (resolve, reject) => {
        wedding_info.wedding_id = wedding_id;

        const tempInfo = { ...wedding_info };
        tempInfo.wedding_date = formatDateFromISOString(wedding_info.wedding_date);
        try {
            const res = await fetchAPI(`/wedding/${wedding_id}/update`, {
                method: "PUT",
                body: tempInfo,
            });
            const data = await res.json();
            if (res.status === 200) {
                dispatch(setSuccess("Cập nhật thông tin tiệc cưới thành công"));
                resolve(data.data);
                dispatch(setUpdateWedding(wedding_info));
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
