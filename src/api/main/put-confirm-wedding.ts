/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import fetchAPI from "../api-utils";

export default async function PutConfirmWedding(wedding_id: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/wedding/${wedding_id}/confirm`, {
                method: "PUT",
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
            } else {
                reject(data.message_vi);
            }
        } catch (error) {
            reject(error);
        }
    });
}
