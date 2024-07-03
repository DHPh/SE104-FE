import fetchAPI from "../api-utils";

export default async function PostUploadServiceImage(
    serviceId: string,
    formData: FormData,
): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetchAPI(`/service/image/${serviceId}`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                reject(response.statusText);
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
