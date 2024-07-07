/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setAddFood } from "@/redux/slice/wedding-slice";
import { generateRandomId } from "@/functions/random";
import { setError, setSuccess } from "@/redux/slice/error-slice";

// "food_id": "string",
// "food_name": "string",
// "food_price": 0,
// "food_note": "string"

export default async function PostAddFood(
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
        const randomId = generateRandomId();
        try {
            const response = await fetchAPI("/food/new", {
                method: "POST",
                body: {
                    food_id: food_id || randomId,
                    food_name,
                    food_price,
                    food_note,
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(
                    setAddFood({
                        food_id: food_id || randomId,
                        food_name,
                        food_price,
                        note: food_note,
                        created_at: "",
                        updated_at: "",
                    }),
                );
                dispatch(setSuccess("Thêm món ăn thành công"));
                resolve(data);
            } else {
                const data = await response.json();
                dispatch(setError(data.message_vi));
                reject(response);
            }
        } catch (error) {
            dispatch(setError(error as string));
            reject(error);
        }
    });
}
