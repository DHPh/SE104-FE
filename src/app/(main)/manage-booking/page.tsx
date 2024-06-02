"use client";

import { ScreenContent } from "@/components/global/screen/screen";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";

export default function Page() {
    const cc = 10;
    const tableHeadColumns = [
        {
            id: "hallType",
            label: "ID loại sảnh",
        },
        {
            id: "hallTypeName",
            label: "Tên loại sảnh",
        },
        {
            id: "hallPrice",
            label: "Giá tiền",
        },
        {
            id: "hallCreatedDate",
            label: "Ngày tạo",
        },
        {
            id: "hallUpdatedDate",
            label: "Ngày cập nhật",
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
                        console.log("cc");
                    }}
                    rowCount={10}
                    numSelected={8}
                />
                {Array.from({ length: cc }).map((_, index) => (
                    <DefaultTableRow
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        columns={tableHeadColumns}
                        selected={index % 2 === 0}
                        onSelectClick={() => {}}
                    />
                ))}
            </div>
        </ScreenContent>
    );
}
