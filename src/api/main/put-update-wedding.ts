/* eslint-disable no-param-reassign */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateWedding, UpdatedWedding } from "@/redux/slice/wedding-slice";
import { convertDateToServerFormat } from "@/functions/convert-data";

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
        const tempInfo = wedding_info;
        wedding_info.wedding_id = wedding_id;
        wedding_info.wedding_date = convertDateToServerFormat(wedding_info.wedding_date);
        try {
            const res = await fetchAPI(`/wedding/${wedding_id}/update`, {
                method: "PUT",
                body: wedding_info,
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setUpdateWedding(tempInfo));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
