/* eslint-disable no-param-reassign */
/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setNewWedding, NewWedding } from "@/redux/slice/wedding-slice";
import { formatDateFromISOString } from "@/functions/convert-data";

export default async function PostCreateWedding({
    dispatch,
    wedding_info,
}: {
    dispatch: Dispatch<AnyAction>;
    wedding_info: NewWedding;
}) {
    return new Promise(async (resolve, reject) => {
        const tempInfo = { ...wedding_info };
        tempInfo.wedding_date = formatDateFromISOString(wedding_info.wedding_date);
        try {
            const res = await fetchAPI("/wedding/create", {
                method: "POST",
                body: tempInfo,
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                const newWedding = { ...wedding_info, wedding_id: data.data };
                console.log(newWedding);
                dispatch(setNewWedding(newWedding));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
