import { fetchAuth } from "../api-utils";

export default async function postLogin (
    email: string, 
    password: string
) {
    let response;
    try {
        const res = await fetchAuth("http://localhost:34000/user/login", {
            method: "POST",
            body: {
                email,
                password,
            },
        });
        const data = res.json();

        response = {
            status: res.status,
            data,
        };
        if (response.status === 200) {
            console.log("Login success")
        } else {
            throw new Error("Login failed")
        }
    } catch (error) {
        response = "Login failed"
    }
    return response;
}
