/* eslint-disable no-async-promise-executor */
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setWeddingList } from "@/redux/slice/wedding-slice";

export default async function GetWeddingList({
    dispatch,
    page,
    limit,
    startdate,
    enddate,
}: {
    dispatch: Dispatch<AnyAction>;
    page: number;
    limit: number;
    startdate: string;
    enddate: string;
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/wedding/list", {
                method: "POST",
                body: {
                    page,
                    limit,
                    start_date: startdate,
                    end_date: enddate,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
                dispatch(setWeddingList(data.data));
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
