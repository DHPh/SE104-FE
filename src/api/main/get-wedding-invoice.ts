import fetchAPI from "../api-utils";

interface WeddingInvoice {
    total: number;
    payment_status: number;
    invoice_date: string;
    invoice_tax: number;
    payment_at: string;
    note: string | null;
}

export default async function GetWeddingInvoice(weddingID: string) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<WeddingInvoice>(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/invoice/${weddingID}`);

            if (res.status === 200) {
                const data = await res.json();
                resolve(data.data);
            } else {
                reject(res);
            }
        } catch (error) {
            reject(error);
        }
    });
}
