"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { ServiceList } from "@/redux/slice/wedding-slice";

export default function Page() {
    const serviceList = useSelector((state: RootState) => state.wedding.serviceList);

    const tableHead = [{ label: "Tên dịch vụ" }, { label: "Đơn giá" }];

    return (
        <ScreenContent
            buttonAction={() => {
                console.log("Button clicked");
            }}
            buttonText="THÊM DỊCH VỤ"
        >
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {
                    console.log("Select all clicked");
                }}
                numSelected={0}
                rowCount={serviceList.length}
                useCheckbox={false}
            />
            {serviceList.map((service: ServiceList) => (
                <DefaultTableRow
                    key={service.service_id}
                    columns={[
                        { id: "name", value: service.service_name },
                        { id: "price", value: service.service_price },
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
