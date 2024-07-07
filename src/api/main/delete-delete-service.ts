/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteService } from "@/redux/slice/wedding-slice";

export default async function DeleteDeleteService(
    dispatch: Dispatch<AnyAction>,
    serviceId: string,
) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/service/delete?service_id=${serviceId}`, {
                method: "DELETE",
            });
            if (res.status === 200) {
                dispatch(setDeleteService(serviceId));
                resolve(res);
            } else {
                reject(res);
            }
        } catch (error) {
            console.log("Error: ", error);
            reject(error);
        }
    });
}
