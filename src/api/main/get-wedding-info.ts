/* eslint-disable camelcase */
/* eslint-disable no-async-promise-executor */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setWeddingDetail } from "@/redux/slice/wedding-slice";

export default async function GetWeddingInfo({
    dispatch,
    wedding_id,
}: {
    dispatch: Dispatch<AnyAction>;
    wedding_id: string;
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/wedding/${wedding_id}`, {
                method: "GET",
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setWeddingDetail(data.data));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
