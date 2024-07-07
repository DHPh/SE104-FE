/* eslint-disable no-async-promise-executor */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setDeleteService } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

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
                dispatch(setSuccess("Xóa dịch vụ thành công"));
                resolve(res);
            } else {
                const data = await res.json();
                dispatch(setError(data.message_vi));
                reject(res);
            }
        } catch (error) {
            dispatch(setError(error as string));
            console.log("Error: ", error);
            reject(error);
        }
    });
}
