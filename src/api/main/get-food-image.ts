import fetchAPI from "../api-utils";

export default async function GetFoodImage(foodId: string): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI(`/food/image/${foodId}`);
            if (!response.ok) {
                reject(response.statusText);
            }
            const blob = await response.blob();
            resolve(URL.createObjectURL(blob));
        } catch (error) {
            reject(error);
        }
    });
}
