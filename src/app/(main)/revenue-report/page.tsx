"use client";

import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Button } from "@mui/material";
import { DateRange } from "@mui/x-date-pickers-pro"; // Import Dayjs type
import { Dayjs } from "dayjs";
import { ScreenContent } from "@/components/global/screen/screen";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import fetchAPI from "@/api/api-utils";
import { formatPrice } from "@/functions/convert-data";

export default function Page() {
    const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]); // Use Dayjs type

    const [data, setData] = useState<
        {
            date: string;
            revenue: number;
            wedding_count: number;
        }[]
    >([]);

    const tableHead = [{ label: "Ngày" }, { label: "Doanh thu" }, { label: "Số lượng đặt tiệc" }];

    const handleGetReport = async () => {
        const response = await fetchAPI("/revenue", {
            method: "POST",
            body: {
                start_date: dateRange[0]?.format("DD/MM/YYYY"),
                end_date: dateRange[1]?.format("DD/MM/YYYY"),
            },
        });
        const res = await response.json();
        setData(res.data);
        // [
        //     {
        //       "date": "01/01/2024",
        //       "revenue": null,
        //       "wedding_count": 0
        //     },
        //     {
        //       "date": "02/01/2024",
        //       "revenue": null,
        //       "wedding_count": 0
        //     },
        // ]
    };

    return (
        <ScreenContent>
            <div className="flex flex-row w-full flex-shrink-0 items-center gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateRangePicker"]}>
                        <DateRangePicker
                            localeText={{ start: "Ngày bắt đầu", end: "Ngày kết thúc" }}
                            value={dateRange} // Pass the dateRange state
                            onChange={setDateRange} // Pass the setDateRange function
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <div className="h-full">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleGetReport();
                        }}
                    >
                        Xuất báo cáo
                    </Button>
                </div>
            </div>
            <br />
            <span className="text-2xl text-gray-500 mt-2">
                Báo cáo doanh thu theo ngày từ ngày {dateRange[0]?.format("DD/MM/YYYY")} đến ngày{" "}
                {dateRange[1]?.format("DD/MM/YYYY")}
            </span>
            <br />
            <br />
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {}}
                numSelected={0}
                rowCount={0}
                useCheckbox={false}
            />
            {data.map((row) => (
                <DefaultTableRow
                    key={row.date}
                    columns={[
                        { value: row.date },
                        { value: formatPrice(row.revenue || 0) },
                        { value: row.wedding_count },
                    ]}
                    onItemClicked={() => {}}
                    onSelectClick={() => {}}
                    useCheckbox={false}
                    selected={false}
                />
            ))}
        </ScreenContent>
    );
}
