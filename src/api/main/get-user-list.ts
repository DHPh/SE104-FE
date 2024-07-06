import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUserList } from "@/redux/slice/wedding-slice";

export default async function GetUserList(dispatch: Dispatch<AnyAction>) {
    try {
        const res = await fetchAPI("/user/list");
        if (res.status === 200) {
            const data = await res.json();
            dispatch(setUserList(data.data));
        }
    } catch (error) {
        console.error(error);
    }
}
