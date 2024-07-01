"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { RoomList } from "@/redux/slice/wedding-slice";

export default function Page() {
    const roomList = useSelector((state: RootState) => state.wedding.roomList);

    const tableHead = [
        { label: "Tên sảnh" },
        { label: "Loại sảnh" },
        { label: "Số lượng bàn tối đa" },
        { label: "Số lượng bàn tối thiểu" },
    ];

    return (
        <ScreenContent
            buttonAction={() => {
                console.log("Button clicked");
            }}
            buttonText="THÊM SẢNH"
        >
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {
                    console.log("Select all clicked");
                }}
                numSelected={0}
                rowCount={roomList.length}
                useCheckbox={false}
            />
            {roomList.map((room: RoomList) => (
                <DefaultTableRow
                    key={room.room_id}
                    columns={[
                        { id: "name", value: room.room_name },
                        { id: "type", value: room.room_type },
                        { id: "max_table", value: room.max_table },
                        { id: "min_table", value: room.min_table },
                    ]}
                    selected={false}
                    onSelectClick={() => {
                        console.log("Select clicked");
                    }}
                    onItemClicked={() => {
                        console.log("Item clicked");
                    }}
                    useCheckbox={false}
                />
            ))}
        </ScreenContent>
    );
}
