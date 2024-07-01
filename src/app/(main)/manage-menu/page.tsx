"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { FoodList } from "@/redux/slice/wedding-slice";

export default function Page() {
    const foodList = useSelector((state: RootState) => state.wedding.foodList);

    const tableHead = [{ label: "Tên món ăn" }, { label: "Đơn giá" }];

    return (
        <ScreenContent
            buttonAction={() => {
                console.log("Button clicked");
            }}
            buttonText="THÊM MÓN ĂN"
        >
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {
                    console.log("Select all clicked");
                }}
                numSelected={0}
                rowCount={foodList.length}
                useCheckbox={false}
            />
            {foodList.map((food: FoodList) => (
                <DefaultTableRow
                    key={food.food_id}
                    columns={[
                        { id: "name", value: food.food_name },
                        { id: "type", value: food.food_price },
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
