/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import fetchAPI from "../api-utils";
import { setAddFood } from "@/redux/slice/wedding-slice";
import { generateRandomId } from "@/functions/random";

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
        try {
            const response = await fetchAPI("/food/new", {
                method: "POST",
                body: {
                    food_id: food_id || generateRandomId(),
                    food_name,
                    food_price,
                    food_note,
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(
                    setAddFood({
                        food_id: food_id || generateRandomId(),
                        food_name,
                        food_price,
                        note: food_note,
                        created_at: "",
                        updated_at: "",
                    }),
                );
                resolve(data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            reject(error);
        }
    });
}
