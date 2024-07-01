/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import { FoodList, ServiceList, WeddingDetail, UpdatedWedding } from "@/redux/slice/wedding-slice";

export function getFoodName(foodList: FoodList[], foodId: string) {
    const food = foodList.find((f) => f.food_id === foodId);
    if (food) {
        return food.food_name;
    }
    return "Không xác định";
}

export function getServiceName(serviceList: ServiceList[], serviceId: string) {
    const service = serviceList.find((s) => s.service_id === serviceId);
    if (service) {
        return service.service_name;
    }
    return "Không xác định";
}

export function formatPrice(price: number) {
    return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}

export function handleVNDInput(inputValue: string) {
    let extractedPrice: number;

    // Check if the currency symbol is present
    if (!inputValue.includes("₫")) {
        // If the symbol is missing, remove the last digit from the numeric part
        const numericValue = inputValue.replace(/\D/g, "");
        const adjustedNumericValue = numericValue.slice(0, -1); // Remove last digit
        extractedPrice = Number(adjustedNumericValue);
    } else {
        // If the symbol is present, just extract the numeric value
        extractedPrice = Number(inputValue.replace(/\D/g, ""));
    }

    return extractedPrice;
}

export function getPriceNumber(price: string) {
    return Number(price.replace(/\D/g, ""));
}

export const formatDateFromISOString = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year} ${
        dateObj.getHours() < 10 ? `0${dateObj.getHours()}` : dateObj.getHours()
    }:${dateObj.getMinutes() < 10 ? `0${dateObj.getMinutes()}` : dateObj.getMinutes()}`;
};

export const convertDateToServerFormat = (date: string) => {
    // Convert from 2024-06-02 15:12:30 to 02/06/2024 15:12
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year} ${
        hours < 10 ? `0${hours}` : hours
    }:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const convertDateToClientFormat = (date: string) => {
    // Convert from 02/06/2024 15:12 to 2024-06-02 15:12:30
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${
        hours < 10 ? `0${hours}` : hours
    }:${minutes < 10 ? `0${minutes}` : minutes}:00`;
};

export const convertWeddingDetail = (wedding_id: string, weddingDetail: WeddingDetail) => {
    const updatedWeddingDetail: UpdatedWedding = {
        wedding_id,
        groom_name: weddingDetail.wedding_info.groom_name,
        bride_name: weddingDetail.wedding_info.bride_name,
        wedding_date: weddingDetail.wedding_info.wedding_date,
        phone_number: weddingDetail.wedding_info.phone_number,
        room_id: weddingDetail.wedding_info.room_id,
        shift_name: weddingDetail.wedding_info.shift_name,
        num_table: weddingDetail.wedding_info.num_table,
        payment_status: weddingDetail.invoice.payment_status,
        note: weddingDetail.wedding_info.note,
        food_orders: weddingDetail.food_orders,
        service_orders: weddingDetail.service_orders,
    };
    return updatedWeddingDetail;
};
