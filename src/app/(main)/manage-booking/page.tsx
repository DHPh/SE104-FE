"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { ScreenContent } from "@/components/global/screen/screen";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import GetWeddingList from "@/api/main/get-wedding-list";
import { toggleWedding, selectAllWedding } from "@/redux/slice/wedding-slice";

export default function Page() {
    const dispatch = useDispatch();

    const tableWeddingList = useSelector((state: RootState) => state.wedding.weddingList.tableData);
    const countWeddings = useSelector((state: RootState) => state.wedding.weddingList.count);
    const selectedWeddingCount = useSelector(
        (state: RootState) => state.wedding.selectedWedding.count,
    );
    const shiftList = useSelector((state: RootState) => state.wedding.shiftList);
    const roomList = useSelector((state: RootState) => state.wedding.roomList);

    useEffect(() => {
        if (shiftList.length === 0 || roomList.length === 0) {
            return;
        }
        GetWeddingList({
            dispatch,
            page: 1,
            limit: 10,
            startdate: "30/05/2024",
            enddate: "16/06/2024",
        });
    }, [roomList, shiftList]);

    const tableHeadColumns = [
        {
            id: "groom-name",
            label: "Chú rể",
        },
        {
            id: "bride-name",
            label: "Cô dâu",
        },
        {
            id: "room",
            label: "Sảnh",
        },
        {
            id: "shift",
            label: "Ca",
        },
        {
            id: "wedding-date",
            label: "Ngày cưới",
        },
    ];

    return (
        <ScreenContent
            buttonAction={() => {
                console.log("cc");
            }}
            buttonText="NHẤN NÚT ĐÊ"
        >
            <div className="w-full overflow-y-auto">
                <DefaultTableHead
                    columns={tableHeadColumns}
                    onSelectAllClick={() => {
                        console.log("selectAllWedding");
                        if (selectedWeddingCount < countWeddings) {
                            dispatch(selectAllWedding(true));
                        } else if (selectedWeddingCount === countWeddings) {
                            dispatch(selectAllWedding(false));
                        }
                    }}
                    rowCount={countWeddings}
                    numSelected={selectedWeddingCount}
                />
                {tableWeddingList.map((row, index) => (
                    <DefaultTableRow
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        columns={row.data}
                        selected={row.selected || false}
                        onSelectClick={() => {
                            dispatch(toggleWedding({ id: row.id, select: !row.selected }));
                        }}
                    />
                ))}
            </div>
        </ScreenContent>
    );
}
