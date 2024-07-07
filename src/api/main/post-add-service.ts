/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setAddService } from "@/redux/slice/wedding-slice";
import { generateRandomId } from "@/functions/random";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default async function PostAddService(
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
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI("/service/new", {
                method: "POST",
                body: {
                    service_id: service_id || generateRandomId(),
                    service_name,
                    service_price,
                    service_note,
                },
            });
            if (!response.ok) {
                const data = await response.json();
                dispatch(setError(data.message_vi));
                reject(response.statusText);
                return;
            }
            dispatch(setSuccess("Thêm dịch vụ thành công"));
            dispatch(
                setAddService({
                    service_id: service_id || generateRandomId(),
                    service_name,
                    service_price,
                    note: service_note,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }),
            );
            resolve();
        } catch (error) {
            dispatch(setError(error as string));
            reject(error);
        }
    });
}
