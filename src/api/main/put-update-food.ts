/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setUpdateFood } from "@/redux/slice/wedding-slice";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default async function PutUpdateFood(
    dispatch: Dispatch<AnyAction>,
    {
        food_id,
        food_name,
        food_price,
        food_note,
    }: {
        food_id: string;
        food_name: string;
        food_price: number;
        food_note: string;
    },
) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI("/food/update", {
                method: "PUT",
                body: {
                    food_id,
                    food_name,
                    food_price,
                    food_note,
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setSuccess("Cập nhật món ăn thành công"));
                dispatch(
                    setUpdateFood({
                        food_id,
                        food_name,
                        food_price,
                        note: food_note,
                        created_at: "",
                        updated_at: "",
                    }),
                );
                resolve(data);
            } else {
                const data = await response.json();
                dispatch(setError(data.message_vi));
                reject(data.message_vi);
            }
        } catch (error) {
            dispatch(setError(error as string));
            reject(error);
        }
    });
}
