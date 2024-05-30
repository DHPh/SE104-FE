export async function fetchAuth (
    url: string, 
    {
        method='GET',
        body=null,
    }: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: | { [key: string]: string }
            | string
            | URLSearchParams
            | FormData
            | Blob
            | ArrayBuffer
            | ReadableStream
            | null;
    } = {}): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
            let res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : undefined,
                credentials: "include",
            })
            if (res.status === 200) {
                resolve(res);
            } else {
                let data = await res.json();
                reject(data);
            }
        } catch (error) {
            reject(error);
        }
    });
}