import fetchAPI from "../api-utils";

// wedding_id": "string",
//   "payment_status": 100,
//   "payment_at": "07/07/2024",
//   "late_fee": 0

export default async function PutPaymentInvoice(
    weddingID: string,
    paymentStatus: number,
    paymentAt: string,
    lateFee: number,
) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetchAPI(`/invoice/${weddingID}/payment`, {
                method: "PUT",
                body: {
                    wedding_id: weddingID,
                    payment_status: paymentStatus,
                    payment_at: paymentAt,
                    late_fee: lateFee,
                },
            });

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
