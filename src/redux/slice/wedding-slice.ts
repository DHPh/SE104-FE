/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
};

const weddingSlice = createSlice({
    name: "wedding",
    initialState,
    reducers: {
        setWeddingList: (state, action: PayloadAction<Wedding[]>) => {
            state.weddingList.fullData = action.payload;
            state.weddingList.tableData = action.payload.map((wedding) => {
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
                            value: wedding.room_id,
                        },
                        {
                            id: "shift",
                            value: wedding.shift_name,
                        },
                        {
                            id: "created-date",
                            value: wedding.created_at,
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
    },
});

export const { setWeddingList, toggleWedding, selectAllWedding } = weddingSlice.actions;
export default weddingSlice.reducer;
