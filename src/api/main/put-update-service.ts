/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateService } from "@/redux/slice/wedding-slice";

// "service_id": "string",
// "service_name": "string",
// "service_price": 0,
// "service_note": "string"

export default async function PutUpdateService(
    dispatch: Dispatch<AnyAction>,
    {
        service_id,
        service_name,
        service_price,
        service_note,
    }: {
        service_id: string;
        service_name: string;
        service_price: number;
        service_note: string;
    },
) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI("/service/update", {
                method: "PUT",
                body: {
                    service_id,
                    service_name,
                    service_price,
                    service_note,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                dispatch(
                    setUpdateService({
                        service_id,
                        service_name,
                        service_price,
                        note: service_note,
                        updated_at: "",
                        created_at: "",
                    }),
                );
                resolve(data);
            } else {
                reject(response.statusText);
            }
        } catch (error) {
            reject(error);
        }
    });
}
