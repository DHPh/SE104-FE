/* eslint-disable no-nested-ternary */

"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, InputLabel, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import dayjs from "dayjs";
import { RootState } from "@/redux/store/store";
import { ScreenContent } from "@/components/global/screen/screen";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import GetWeddingList from "@/api/main/get-wedding-list";
import GetWeddingInfo from "@/api/main/get-wedding-info";
import PutUpdateWedding from "@/api/main/put-update-wedding";
import {
    Wedding,
    WeddingDetail,
    TableWedding,
    toggleWedding,
    selectAllWedding,
    UpdatedWedding,
} from "@/redux/slice/wedding-slice";
import {
    getFoodName,
    getServiceName,
    formatPrice,
    handleVNDInput,
    convertWeddingDetail,
} from "@/functions/convert-data";
import SetLoadingCursor from "@/functions/loading-cursor";

export default function Page() {
    const dispatch = useDispatch();
    const [currentWedding, setCurrentWedding] = useState<
        | {
              fullData: Wedding;
              tableData: TableWedding;
          }
        | undefined
    >(undefined);

    const [updatedWedding, setUpdatedWedding] = useState<UpdatedWedding | undefined>(undefined);
    const [updateStatus, setUpdateStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle",
    );

    const weddingDetail = useSelector((state: RootState) => state.wedding.weddingDetail);

    const fullWeddingList = useSelector((state: RootState) => state.wedding.weddingList.fullData);
    const tableWeddingList = useSelector((state: RootState) => state.wedding.weddingList.tableData);
    const countWeddings = useSelector((state: RootState) => state.wedding.weddingList.count);
    const selectedWeddingCount = useSelector(
        (state: RootState) => state.wedding.selectedWedding.count,
    );
    const shiftList = useSelector((state: RootState) => state.wedding.shiftList);
    const roomList = useSelector((state: RootState) => state.wedding.roomList);
    const foodList = useSelector((state: RootState) => state.wedding.foodList);
    const serviceList = useSelector((state: RootState) => state.wedding.serviceList);

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

    useEffect(() => {
        if (!weddingDetail) {
            return;
        }
        setUpdatedWedding(
            convertWeddingDetail(currentWedding?.fullData.wedding_id || "", weddingDetail),
        );
    }, [weddingDetail]);

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

    const handleWeddingInfoChange = (
        field: keyof WeddingDetail["wedding_info"],
        value: string | number,
    ) => {
        setUpdatedWedding((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    [field]: value,
                };
            }
            return prevState;
        });
    };

    const handleChangeFoodDetail = (
        foodId: string,
        value: {
            note: string;
            price: number;
        },
    ) => {
        setUpdatedWedding((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    food_orders: prevState.food_orders.map((foodOrder) => {
                        if (foodOrder.fo_id === foodId) {
                            return {
                                ...foodOrder,
                                fo_note: value.note,
                                fo_price: value.price,
                            };
                        }
                        return foodOrder;
                    }),
                };
            }
            return prevState;
        });
    };

    const handleChangeServiceDetail = (
        serviceId: string,
        value: {
            note: string;
            num: number;
            price: number;
        },
    ) => {
        setUpdatedWedding((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    service_orders: prevState.service_orders.map((serviceOrder) => {
                        if (serviceOrder.service_id === serviceId) {
                            return {
                                ...serviceOrder,
                                note: value.note,
                                num: value.num,
                                service_price: value.price,
                            };
                        }
                        return serviceOrder;
                    }),
                };
            }
            return prevState;
        });
    };

    async function handleUpdateWedding() {
        console.log(updatedWedding && currentWedding);
        if (updatedWedding && currentWedding) {
            console.log("cc");
            try {
                setUpdateStatus("loading");
                const res = await PutUpdateWedding({
                    dispatch,
                    wedding_id: currentWedding.fullData.wedding_id,
                    wedding_info: updatedWedding,
                });
                if (res) {
                    setUpdateStatus("success");
                    setTimeout(() => {
                        setUpdateStatus("idle");
                    }, 3000);
                } else {
                    setUpdateStatus("error");
                    setTimeout(() => {
                        setUpdateStatus("idle");
                    }, 3000);
                }
            } catch (error) {
                setUpdateStatus("error");
                console.error(error);
                setTimeout(() => {
                    setUpdateStatus("idle");
                }, 3000);
            }
        }
    }

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
                        onItemClicked={() => {
                            SetLoadingCursor();

                            GetWeddingInfo({
                                dispatch,
                                wedding_id: row.id,
                            })
                                .then(() => {
                                    const wed = fullWeddingList.find(
                                        (w) => w.wedding_id === row.id,
                                    );
                                    const tb = tableWeddingList.find((w) => w.id === row.id);
                                    if (!wed || !tb) {
                                        return;
                                    }
                                    setCurrentWedding({
                                        fullData: wed,
                                        tableData: tb,
                                    });

                                    SetLoadingCursor(false);
                                })
                                .catch(() => {
                                    SetLoadingCursor(false); // Set cursor back to normal in case of error
                                });
                        }}
                    />
                ))}
            </div>
            {currentWedding && weddingDetail && (
                <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm">
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#FFF",
                            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
                            width: "800px",
                            height: "600px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <span className="text-2xl font-[700]">THÔNG TIN TIỆC CƯỚI</span>
                        <div className="w-full h-full overflow-auto p-4">
                            {currentWedding && (
                                <>
                                    <span className="font-bold">THAY ĐỔI THÔNG TIN</span>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <TextField
                                            label="Chú rể"
                                            id="groom_name"
                                            defaultValue={currentWedding.fullData.groom_name}
                                            onChange={(e) => {
                                                handleWeddingInfoChange(
                                                    "groom_name",
                                                    e.target.value,
                                                );
                                            }}
                                        />
                                        <TextField
                                            label="Cô dâu"
                                            id="bride_name"
                                            defaultValue={currentWedding.fullData.bride_name}
                                            onChange={(e) => {
                                                handleWeddingInfoChange(
                                                    "bride_name",
                                                    e.target.value,
                                                );
                                            }}
                                        />
                                        <TextField
                                            label="Số điện thoại"
                                            id="phone_number"
                                            defaultValue={weddingDetail.wedding_info.phone_number}
                                            onChange={(e) => {
                                                handleWeddingInfoChange(
                                                    "phone_number",
                                                    e.target.value,
                                                );
                                            }}
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDateTimePicker
                                                label="Ngày cưới"
                                                defaultValue={dayjs(
                                                    currentWedding.fullData.wedding_date,
                                                )}
                                                ampm={false}
                                                format="DD/MM/YYYY HH:mm"
                                                onChange={(date) => {
                                                    if (!date) {
                                                        console.error("Invalid date");
                                                        return;
                                                    }
                                                    handleWeddingInfoChange(
                                                        "wedding_date",
                                                        date.toISOString(),
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                        <FormControl fullWidth>
                                            <InputLabel id="room_id-label">Sảnh</InputLabel>
                                            <Select
                                                labelId="room_id-label"
                                                id="room_id"
                                                label="Sảnh"
                                                defaultValue={currentWedding.fullData.room_id}
                                                onChange={(e) => {
                                                    handleWeddingInfoChange(
                                                        "room_id",
                                                        e.target.value,
                                                    );
                                                }}
                                            >
                                                {roomList.map((room) => (
                                                    <MenuItem
                                                        key={room.room_id}
                                                        value={room.room_id}
                                                    >
                                                        {room.room_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="shift_id-label">Ca</InputLabel>
                                            <Select
                                                labelId="shift_id-label"
                                                id="shift_id"
                                                label="Ca"
                                                defaultValue={currentWedding.fullData.shift_name}
                                                onChange={(e) => {
                                                    handleWeddingInfoChange(
                                                        "shift_name",
                                                        e.target.value,
                                                    );
                                                }}
                                            >
                                                {shiftList.map((shift) => (
                                                    <MenuItem
                                                        key={shift.shift_name}
                                                        value={shift.shift_name}
                                                    >
                                                        {shift.note}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Số bàn"
                                            id="num_table"
                                            defaultValue={currentWedding.fullData.num_table}
                                            onChange={(e) => {
                                                handleWeddingInfoChange(
                                                    "num_table",
                                                    e.target.value,
                                                );
                                            }}
                                        />
                                        <TextField
                                            label="Ghi chú"
                                            id="note"
                                            defaultValue={weddingDetail.wedding_info.note}
                                            onChange={(e) => {
                                                handleWeddingInfoChange("note", e.target.value);
                                            }}
                                        />
                                    </div>
                                    <br />
                                    <span className="font-bold">THÔNG TIN CỐ ĐỊNH</span>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <TextField
                                            label="Loại sảnh"
                                            id="room_type_name"
                                            defaultValue={weddingDetail.wedding_info.room_type_name}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="ID"
                                            id="wedding_id"
                                            defaultValue={currentWedding.fullData.wedding_id}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Tạo bởi"
                                            id="created_by"
                                            defaultValue={weddingDetail.wedding_info.created_by}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Xác nhận bởi"
                                            id="confirmed_by"
                                            defaultValue={weddingDetail.wedding_info.confirm_by}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            label="Ngày tạo"
                                            id="created_at"
                                            defaultValue={currentWedding.fullData.created_at}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            label="Ngày cập nhật"
                                            id="updated_at"
                                            defaultValue={currentWedding.fullData.updated_at}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            label="Giá sảnh"
                                            id="room_type_price"
                                            defaultValue={formatPrice(
                                                weddingDetail.wedding_info.room_type_price,
                                            )}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            label="Thuế (%)"
                                            id="invoice_tax"
                                            defaultValue={weddingDetail.invoice.invoice_tax}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            // onChange={(e) => {
                                            //     setUpdatedWedding((prevState) => {
                                            //         if (prevState) {
                                            //             return {
                                            //                 ...prevState,
                                            //                 invoice: {
                                            //                     ...prevState.invoice,
                                            //                     invoice_tax: Number(e.target.value),
                                            //                 },
                                            //             };
                                            //         }
                                            //         return prevState;
                                            //     });
                                            // }}
                                        />
                                        <TextField
                                            label="Ngày thanh toán"
                                            id="invoice_date"
                                            defaultValue={weddingDetail.invoice.invoice_date}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            label="Tình trạng (%)"
                                            id="payment_status"
                                            defaultValue={weddingDetail.invoice.payment_status}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            label="Tổng tiền"
                                            id="total"
                                            defaultValue={formatPrice(weddingDetail.invoice.total)}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </div>
                                    <br />
                                    <Divider />
                                    <br />
                                    <span className="font-bold">THÔNG TIN MÓN ĂN</span>
                                    <div>
                                        {weddingDetail.food_orders.map((foodOrder) => (
                                            <React.Fragment key={foodOrder.fo_id}>
                                                <br />
                                                <div className="flex flex-col">
                                                    <span className="font-bold">
                                                        Món ăn:{" "}
                                                        {getFoodName(foodList, foodOrder.fo_id)}
                                                    </span>
                                                    <TextField
                                                        label="Ghi chú"
                                                        multiline
                                                        rows={4}
                                                        defaultValue={foodOrder.fo_note}
                                                        variant="outlined"
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            handleChangeFoodDetail(
                                                                foodOrder.fo_id,
                                                                {
                                                                    note: e.target.value,
                                                                    price: foodOrder.fo_price,
                                                                },
                                                            );
                                                        }}
                                                    />
                                                    <TextField
                                                        label="Giá món ăn"
                                                        value={formatPrice(
                                                            updatedWedding?.food_orders.find(
                                                                (f) => f.fo_id === foodOrder.fo_id,
                                                            )?.fo_price || 0,
                                                        )}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            const extractedPrice = handleVNDInput(
                                                                e.target.value,
                                                            );

                                                            handleChangeFoodDetail(
                                                                foodOrder.fo_id,
                                                                {
                                                                    note: foodOrder.fo_note,
                                                                    price: extractedPrice,
                                                                },
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        ))}
                                        <br />
                                        <Divider />
                                        <br />
                                        <div className="flex flex-row gap-10">
                                            <FormControl className="w-full">
                                                <InputLabel id="food_id-label">Món ăn</InputLabel>
                                                <Select
                                                    labelId="food_id-label"
                                                    id="add-food_id"
                                                    label="Món ăn"
                                                    onChange={() => {}}
                                                >
                                                    {foodList.map((food, index) => (
                                                        <MenuItem
                                                            key={food.food_id}
                                                            value={food.food_id}
                                                            selected={index === 0}
                                                        >
                                                            {food.food_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="flex-shrink-0"
                                            >
                                                THÊM MÓN ĂN
                                            </Button>
                                        </div>
                                    </div>
                                    <br />
                                    <Divider />
                                    <br />
                                    <span className="font-bold">THÔNG TIN DỊCH VỤ</span>
                                    <div>
                                        {weddingDetail.service_orders.map((serviceOrder) => (
                                            <React.Fragment key={serviceOrder.service_id}>
                                                <br />
                                                <div className="flex flex-col">
                                                    <span className="font-bold">
                                                        Dịch vụ:{" "}
                                                        {getServiceName(
                                                            serviceList,
                                                            serviceOrder.service_id,
                                                        )}
                                                    </span>
                                                    <TextField
                                                        label="Số lượng"
                                                        defaultValue={serviceOrder.num}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            handleChangeServiceDetail(
                                                                serviceOrder.service_id,
                                                                {
                                                                    note: serviceOrder.note,
                                                                    num: Number(e.target.value),
                                                                    price: serviceOrder.service_price,
                                                                },
                                                            );
                                                        }}
                                                    />
                                                    <TextField
                                                        label="Ghi chú"
                                                        multiline
                                                        rows={4}
                                                        defaultValue={serviceOrder.note}
                                                        variant="outlined"
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            handleChangeServiceDetail(
                                                                serviceOrder.service_id,
                                                                {
                                                                    note: e.target.value,
                                                                    num: serviceOrder.num,
                                                                    price: serviceOrder.service_price,
                                                                },
                                                            );
                                                        }}
                                                    />
                                                    <TextField
                                                        label="Giá dịch vụ"
                                                        defaultValue={formatPrice(
                                                            serviceOrder.service_price,
                                                        )}
                                                        margin="normal"
                                                        onChange={(e) => {
                                                            handleChangeServiceDetail(
                                                                serviceOrder.service_id,
                                                                {
                                                                    note: serviceOrder.note,
                                                                    num: serviceOrder.num,
                                                                    price: Number(e.target.value),
                                                                },
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        ))}
                                        <br />
                                        <Divider />
                                        <br />
                                        <div className="flex flex-row gap-10">
                                            <FormControl className="w-full">
                                                <InputLabel id="service_id-label">
                                                    Dịch vụ
                                                </InputLabel>
                                                <Select
                                                    labelId="service_id-label"
                                                    id="add-service_id"
                                                    label="Dịch vụ"
                                                    onChange={() => {}}
                                                >
                                                    {serviceList.map((service, index) => (
                                                        <MenuItem
                                                            key={service.service_id}
                                                            value={service.service_id}
                                                            selected={index === 0}
                                                        >
                                                            {service.service_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className="flex-shrink-0"
                                            >
                                                THÊM DỊCH VỤ
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex gap-7">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentWedding(undefined);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                color={
                                    updateStatus === "loading"
                                        ? "secondary"
                                        : updateStatus === "success"
                                        ? "success"
                                        : updateStatus === "error"
                                        ? "error"
                                        : "primary"
                                }
                                onClick={() => {
                                    handleUpdateWedding();
                                }}
                            >
                                CẬP NHẬT
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ScreenContent>
    );
}
