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

// {
//   "email": "string@gma.com",
//   "password": "string1",
//   "role": "user",
//   "full_name": "testing",
//   "phone_number": "0346577886",
//   "birthday": "15/01/2024",
//   "id": ""
// }
export async function PostSignup(
    email: string,
    password: string,
    full_name: string,
    phone_number: string,
    birthday: string,
) {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const res = await fetchAPI("/user/create", {
                method: "POST",
                body: {
                    email,
                    password,
                    full_name,
                    phone_number,
                    birthday,
                    role: "user",
                    id: "",
                },
            });
            if (res.status === 200) {
                resolve(true);
            }
        } catch (error) {
            reject(error);
        }
    });
}
