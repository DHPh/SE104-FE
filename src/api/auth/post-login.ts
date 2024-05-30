/* eslint-disable no-async-promise-executor */
import fetchAPI from "../api-utils";

interface PostLoginResponse {
    email: string;
    status: string;
}

export default async function PostLogin(email: string, password: string) {
    return new Promise<PostLoginResponse>(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/login", {
                method: "POST",
                body: {
                    email,
                    password,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                resolve(data.data);
            }
        } catch (error) {
            reject(error);
        }
    });
}
