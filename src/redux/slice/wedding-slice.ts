/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { convertDateToServerFormat } from "@/functions/convert-data";

export interface User {
    email: string;
    role: string;
    full_name: string;
    phone_number: string;
    birthday: string;
    id: string;
    created_at: string;
    updated_at: string;
}

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

export interface NewWedding {
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    phone_number: string;
    room_id: string;
    shift_name: string;
    num_table: number;
    note: string;
    payment_status: number;
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
    selectedWeddingIDList: string[];
    userList: User[];
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
    selectedWeddingIDList: [],
    userList: [],
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
                    state.selectedWeddingIDList.push(w1.wedding_id);
                } else {
                    w1.selected = false;
                    const index = state.selectedWedding.data.findIndex(
                        (w) => w.wedding_id === action.payload.id,
                    );
                    if (index > -1) {
                        state.selectedWedding.data.splice(index, 1);
                        state.selectedWedding.count -= 1;
                        const index2 = state.selectedWeddingIDList.findIndex(
                            (id) => id === action.payload.id,
                        );
                        if (index2 > -1) {
                            state.selectedWeddingIDList.splice(index2, 1);
                        }
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
                state.selectedWeddingIDList = state.weddingList.fullData.map((w) => w.wedding_id);
            } else {
                state.selectedWedding.data = [];
                state.selectedWedding.count = 0;
                state.selectedWeddingIDList = [];
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
        setNewWedding: (state, action: PayloadAction<UpdatedWedding>) => {
            // Push to top of the list
            state.weddingList.fullData.unshift({
                wedding_id: action.payload.wedding_id,
                groom_name: action.payload.groom_name,
                bride_name: action.payload.bride_name,
                wedding_date: action.payload.wedding_date,
                room_id: action.payload.room_id,
                shift_name: action.payload.shift_name,
                num_table: action.payload.num_table,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
            const roomName = state.roomList.find((r) => r.room_id === action.payload.room_id)
                ?.room_name;
            const shiftName = state.shiftList.find(
                (s) => s.shift_name === action.payload.shift_name,
            )?.note;
            state.weddingList.tableData.unshift({
                data: [
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
                ],
                selected: false,
                id: action.payload.wedding_id,
            });
            state.weddingList.count += 1;
        },
        setDeleteWedding: (state, action: PayloadAction<string>) => {
            const index = state.weddingList.fullData.findIndex(
                (w) => w.wedding_id === action.payload,
            );
            if (index > -1) {
                state.weddingList.fullData.splice(index, 1);
                state.weddingList.tableData.splice(index, 1);
                state.weddingList.count -= 1;

                // Set count to 0
                state.selectedWedding.count = 0;
                state.weddingList.count = state.weddingList.fullData.length;
            }
        },
        setUpdateShift: (state, action: PayloadAction<ShiftList>) => {
            const shift = state.shiftList.find((s) => s.shift_name === action.payload.shift_name);
            if (shift) {
                shift.activate = action.payload.activate;
            }
        },
        setAddRoomType: (state, action: PayloadAction<RoomTypeList>) => {
            state.roomTypeList.push(action.payload);
        },
        setUpdateRoomType: (state, action: PayloadAction<RoomTypeList>) => {
            const roomType = state.roomTypeList.find((rt) => rt.rt_id === action.payload.rt_id);
            if (roomType) {
                roomType.rt_name = action.payload.rt_name;
                roomType.rt_price = action.payload.rt_price;
                roomType.updated_at = new Date().toISOString();
            }
        },
        setDeleteRoomType: (state, action: PayloadAction<string>) => {
            const index = state.roomTypeList.findIndex((rt) => rt.rt_id === action.payload);
            if (index > -1) {
                state.roomTypeList.splice(index, 1);
            }
        },
        setAddRoom: (state, action: PayloadAction<RoomList>) => {
            state.roomList.push(action.payload);
        },
        setUpdateRoom: (state, action: PayloadAction<RoomList>) => {
            const room = state.roomList.find((r) => r.room_id === action.payload.room_id);
            if (room) {
                room.room_name = action.payload.room_name;
                room.room_type = action.payload.room_type;
                room.max_table = action.payload.max_table;
                room.min_table = action.payload.min_table;
                room.note = action.payload.note;
                room.updated_at = new Date().toISOString();
            }
        },
        setDeleteRoom: (state, action: PayloadAction<string>) => {
            const index = state.roomList.findIndex((r) => r.room_id === action.payload);
            if (index > -1) {
                state.roomList.splice(index, 1);
            }
        },
        setAddFood: (state, action: PayloadAction<FoodList>) => {
            state.foodList.push(action.payload);
        },
        setUpdateFood: (state, action: PayloadAction<FoodList>) => {
            const food = state.foodList.find((f) => f.food_id === action.payload.food_id);
            if (food) {
                food.food_name = action.payload.food_name;
                food.food_price = action.payload.food_price;
                food.note = action.payload.note;
                food.updated_at = new Date().toISOString();
            }
        },
        setDeleteFood: (state, action: PayloadAction<string>) => {
            const index = state.foodList.findIndex((f) => f.food_id === action.payload);
            if (index > -1) {
                state.foodList.splice(index, 1);
            }
        },
        setAddService: (state, action: PayloadAction<ServiceList>) => {
            state.serviceList.push(action.payload);
        },
        setUpdateService: (state, action: PayloadAction<ServiceList>) => {
            const service = state.serviceList.find(
                (s) => s.service_id === action.payload.service_id,
            );
            if (service) {
                service.service_name = action.payload.service_name;
                service.service_price = action.payload.service_price;
                service.note = action.payload.note;
                service.updated_at = new Date().toISOString();
            }
        },
        setDeleteService: (state, action: PayloadAction<string>) => {
            const index = state.serviceList.findIndex((s) => s.service_id === action.payload);
            if (index > -1) {
                state.serviceList.splice(index, 1);
            }
        },
        setUserList: (state, action: PayloadAction<User[]>) => {
            state.userList = action.payload;
        },
        setAddUser: (state, action: PayloadAction<User>) => {
            state.userList.push(action.payload);
        },
        setUpdateUser: (
            state,
            action: PayloadAction<{
                email: string;
                full_name: string;
                phone_number: string;
                birthday: string;
                id: string;
            }>,
        ) => {
            const user = state.userList.find((u) => u.id === action.payload.id);
            if (user) {
                user.email = action.payload.email;
                user.full_name = action.payload.full_name;
                user.phone_number = action.payload.phone_number;
                user.birthday = action.payload.birthday;
            }
        },
        setDeleteUser: (state, action: PayloadAction<string>) => {
            const index = state.userList.findIndex((u) => u.email === action.payload);
            if (index > -1) {
                state.userList.splice(index, 1);
            }
        },
        setUpdatePaymentStatus: (state, action: PayloadAction<number>) => {
            if (state.weddingDetail) {
                state.weddingDetail.invoice.payment_status = action.payload;
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
    setNewWedding,
    setDeleteWedding,
    setUpdateShift,
    setAddRoomType,
    setUpdateRoomType,
    setDeleteRoomType,
    setAddRoom,
    setUpdateRoom,
    setDeleteRoom,
    setAddFood,
    setUpdateFood,
    setDeleteFood,
    setAddService,
    setUpdateService,
    setDeleteService,
    setUserList,
    setAddUser,
    setUpdateUser,
    setDeleteUser,
    setUpdatePaymentStatus,
} = weddingSlice.actions;
export default weddingSlice.reducer;
