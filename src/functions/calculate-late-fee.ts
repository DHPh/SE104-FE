import dayjs from "dayjs";

const lateFeeCharge = 0.1;

// Increase 1% per day
export default function calculateLateFee(invoiceDate: string, paymentAt: string, total: number) {
    const days = dayjs(paymentAt).diff(dayjs(invoiceDate), "day");
    if (days <= 0) return 0;
    return total * days * lateFeeCharge;
}
