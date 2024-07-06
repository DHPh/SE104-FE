/* eslint-disable no-async-promise-executor */
import fetchAPI from "../api-utils";

export default async function PutResetPassword(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/reset-password", {
                method: "PUT",
                body: {
                    email,
                    new_password: password,
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                resolve(data);
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
