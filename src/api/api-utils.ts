/* eslint-disable no-async-promise-executor */

export default async function fetchAPI(
    url: string,
    {
        method = "GET",
        body = null,
    }: {
        method?:
            | "GET"
            | "POST"
            | "DELETE"
            | "PUT"
            | "PATCH"
            | "OPTIONS"
            | "HEAD"
            | "CONNECT"
            | "TRACE";
        body?:
            | object
            | { [key: string]: string | number }
            | string
            | URLSearchParams
            | FormData
            | Blob
            | ArrayBuffer
            | ReadableStream
            | null;
    } = {},
): Promise<Response> {
    const api = "http://localhost:5000";

    let processedBody: BodyInit | null = null;
    let contentType;

    //* Handle method
    const validMethods = [
        "GET",
        "POST",
        "DELETE",
        "PUT",
        "PATCH",
        "OPTIONS",
        "HEAD",
        "CONNECT",
        "TRACE",
    ];
    if (!validMethods.includes(method)) {
        return new Promise((resolve, reject) => {
            reject(new Error(`Method must be one of ${validMethods.join(", ")}`));
        });
    }

    //* Handle body
    if (method !== "GET") {
        if (typeof body === "string") {
            processedBody = body;
            contentType = "text/plain";
        } else if (body instanceof URLSearchParams) {
            processedBody = body.toString();
            contentType = "application/x-www-form-urlencoded";
        } else if (body instanceof FormData) {
            processedBody = body;
            contentType = "multipart/form-data";
        } else if (
            body instanceof Blob ||
            body instanceof ArrayBuffer ||
            ArrayBuffer.isView(body)
        ) {
            processedBody = new Blob([body], { type: "application/octet-stream" });
            contentType = "application/octet-stream";
        } else if (body instanceof ReadableStream) {
            processedBody = body;
            contentType = "application/octet-stream";
        } else if (body !== null && typeof body === "object") {
            processedBody = JSON.stringify(body);
            contentType = "application/json";
        } else {
            processedBody = String(body);
            contentType = "text/plain";
        }
    }

    const headers: { [key: string]: string } = {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
    };

    // `contentType` must not be equal to `"multipart/form-data"`.
    // This is because when you're sending a `FormData` object with an HTTP request,
    // the browser automatically sets the `Content-Type` to `"multipart/form-data"`
    // and also appropriately sets the `boundary` parameter,which is needed for this content type.
    // If you manually set the `Content-Type` to `"multipart/form-data"`,
    // you would also need to manually set the `boundary` parameter, which can be complex.
    if (contentType !== "multipart/form-data" && contentType) {
        headers["Content-Type"] = contentType;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(api + url, {
                method,
                headers,
                credentials: "include",
                body: processedBody,
            });
            if (res.status === 200) {
                resolve(res);
            } else {
                // First request failed
                const data = await res.json();
                reject(data.message_vi);
            }
        } catch (error) {
            // General error
            reject(error);
        }
    });
}
