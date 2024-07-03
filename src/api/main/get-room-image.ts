/* eslint-disable no-async-promise-executor */
import fetchAPI from "../api-utils";

export default async function GetRoomImage(roomId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI(`/room/image/${roomId}`);
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
