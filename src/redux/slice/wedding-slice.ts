/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { convertDateToServerFormat } from "@/functions/convert-data";

export interface Wedding {
    wedding_id: string;
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    room_id: string;
    shift_name: string;
    num_table: number;
    created_at: string; // "2024-06-02 15:12:30"
    updated_at: string; // "2024-06-02 15:12:30"
    selected?: boolean;
}

export interface TableWedding {
    data: { id: string; value: string }[];
    selected: boolean | undefined;
    id: string;
}

export interface ShiftList {
    shift_name: string;
    note: string;
    activate: number;
    created_at: string; // "2024-05-26 14:30:44"
    updated_at: string; // "2024-05-26 14:30:44"
}

export interface RoomTypeList {
    rt_id: string;
    rt_name: string;
    rt_price: number;
    created_at: string; // "2024-05-26 14:30:44"
    updated_at: string; // "2024-05-26 14:30:44"
}

export interface RoomList {
    room_id: string;
    room_name: string;
    room_type: string;
    max_table: number;
    min_table: number;
    note: string;
    created_at: string; // "2024-05-26 14:30:44"
    updated_at: string; // "2024-05-26 14:30:44"
}

export interface WeddingDetail {
    wedding_info: {
        created_by: string;
        confirm_by: string;
        groom_name: string;
        bride_name: string;
        phone_number: string;
        room_id: string;
        shift_name: string;
        note: string;
        num_table: number;
        wedding_date: string;
        delete_status: number;
        created_at: string;
        updated_at: string;
        room_name: string;
        room_type: string;
        room_type_name: string;
        room_type_price: number;
    };
    food_orders: {
        fo_id: string;
        fo_note: string;
        fo_price: number;
    }[];
    service_orders: {
        service_id: string;
        note: string;
        num: number;
        service_price: number;
    }[];
    invoice: {
        total: number;
        payment_status: number;
        invoice_date: string;
        invoice_tax: number;
    };
}

export interface ServiceList {
    service_id: string;
    service_name: string;
    service_price: number;
    note: string;
    created_at: string;
    updated_at: string;
}

export interface FoodList {
    food_id: string;
    food_name: string;
    food_price: number;
    note: string;
    created_at: string;
    updated_at: string;
}

export interface UpdatedWedding {
    wedding_id: string;
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    phone_number: string;
    room_id: string;
    shift_name: string;
    num_table: number;
    payment_status: number;
    note: string;
    food_orders: {
        fo_id: string;
        fo_note: string;
        fo_price: number;
    }[];
    service_orders: {
        service_id: string;
        note: string;
        num: number;
        service_price: number;
    }[];
}

export interface WeddingState {
    weddingList: {
        tableData: TableWedding[];
        fullData: Wedding[];
        count: number;
    };
    selectedWedding: {
        count: number;
        data: Wedding[];
    };
    shiftList: ShiftList[];
    roomTypeList: RoomTypeList[];
    roomList: RoomList[];
    serviceList: ServiceList[];
    foodList: FoodList[];
    weddingDetail?: WeddingDetail | undefined;
}

const initialState: WeddingState = {
    weddingList: {
        tableData: [],
        fullData: [],
        count: 0,
    },
    selectedWedding: {
        count: 0,
        data: [],
    },
    shiftList: [],
    roomTypeList: [],
    roomList: [],
    serviceList: [],
    foodList: [],
    weddingDetail: undefined,
};

const weddingSlice = createSlice({
    name: "wedding",
    initialState,
    reducers: {
        setWeddingList: (state, action: PayloadAction<Wedding[]>) => {
            state.weddingList.fullData = action.payload;
            state.weddingList.tableData = action.payload.map((wedding) => {
                const roomName = state.roomList.find((r) => r.room_id === wedding.room_id)
                    ?.room_name;
                const shiftName = state.shiftList.find((s) => s.shift_name === wedding.shift_name)
                    ?.note;

                return {
                    data: [
                        {
                            id: "groom-name",
                            value: wedding.groom_name,
                        },
                        {
                            id: "bride-name",
                            value: wedding.bride_name,
                        },
                        {
                            id: "room",
                            value: roomName || wedding.room_id,
                        },
                        {
                            id: "shift",
                            value: shiftName || wedding.shift_name,
                        },
                        {
                            id: "wedding-date",
                            value: convertDateToServerFormat(wedding.wedding_date),
                        },
                    ],
                    selected: wedding.selected,
                    id: wedding.wedding_id,
                };
            });
            state.weddingList.count = action.payload.length;
            state.selectedWedding.count = 0;
            state.selectedWedding.data = [];
        },
        toggleWedding: (state, action: PayloadAction<{ id: string; select: boolean }>) => {
            const w1 = state.weddingList.fullData.find((w) => w.wedding_id === action.payload.id);
            if (w1) {
                if (action.payload.select) {
                    w1.selected = true;
                    state.selectedWedding.data.push(w1);
                    state.selectedWedding.count += 1;
                } else {
                    w1.selected = false;
                    const index = state.selectedWedding.data.findIndex(
                        (w) => w.wedding_id === action.payload.id,
                    );
                    if (index > -1) {
                        state.selectedWedding.data.splice(index, 1);
                        state.selectedWedding.count -= 1;
                    }
                }
            }
            const w2 = state.weddingList.tableData.find((w) => w.id === action.payload.id);
            if (w2) {
                if (action.payload.select) {
                    w2.selected = true;
                } else {
                    w2.selected = false;
                }
            }
        },
        selectAllWedding: (state, action: PayloadAction<boolean>) => {
            state.weddingList.fullData.forEach((w) => {
                w.selected = action.payload;
            });
            state.weddingList.tableData.forEach((w) => {
                w.selected = action.payload;
            });
            if (action.payload) {
                state.selectedWedding.data = state.weddingList.fullData;
                state.selectedWedding.count = state.weddingList.count;
            } else {
                state.selectedWedding.data = [];
                state.selectedWedding.count = 0;
            }
        },
        setShiftList: (state, action: PayloadAction<ShiftList[]>) => {
            state.shiftList = action.payload;
        },
        setRoomTypeList: (state, action: PayloadAction<RoomTypeList[]>) => {
            state.roomTypeList = action.payload;
        },
        setRoomList: (state, action: PayloadAction<RoomList[]>) => {
            state.roomList = action.payload;
        },
        setWeddingDetail: (state, action: PayloadAction<WeddingDetail>) => {
            state.weddingDetail = action.payload;
        },
        setServiceList: (state, action: PayloadAction<ServiceList[]>) => {
            state.serviceList = action.payload;
        },
        setFoodList: (state, action: PayloadAction<FoodList[]>) => {
            state.foodList = action.payload;
        },
        setUpdateWedding: (state, action: PayloadAction<UpdatedWedding>) => {
            const wedding = state.weddingList.fullData.find(
                (w) => w.wedding_id === action.payload.wedding_id,
            );
            if (wedding) {
                wedding.groom_name = action.payload.groom_name;
                wedding.bride_name = action.payload.bride_name;
                wedding.wedding_date = action.payload.wedding_date;
                wedding.room_id = action.payload.room_id;
                wedding.shift_name = action.payload.shift_name;
                wedding.num_table = action.payload.num_table;
            }
            const tableWedding = state.weddingList.tableData.find(
                (w) => w.id === action.payload.wedding_id,
            );
            const roomName = state.roomList.find((r) => r.room_id === action.payload.room_id)
                ?.room_name;
            const shiftName = state.shiftList.find(
                (s) => s.shift_name === action.payload.shift_name,
            )?.note;
            if (tableWedding) {
                tableWedding.data = [
                    {
                        id: "groom-name",
                        value: action.payload.groom_name,
                    },
                    {
                        id: "bride-name",
                        value: action.payload.bride_name,
                    },
                    {
                        id: "room",
                        value: roomName || action.payload.room_id,
                    },
                    {
                        id: "shift",
                        value: shiftName || action.payload.shift_name,
                    },
                    {
                        id: "wedding-date",
                        value: convertDateToServerFormat(action.payload.wedding_date),
                    },
                ];
            }
        },
    },
});

export const {
    setWeddingList,
    toggleWedding,
    selectAllWedding,
    setShiftList,
    setRoomTypeList,
    setRoomList,
    setWeddingDetail,
    setServiceList,
    setFoodList,
    setUpdateWedding,
} = weddingSlice.actions;
export default weddingSlice.reducer;
