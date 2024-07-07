/* eslint-disable camelcase */
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
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "@/redux/store/store";
import { ScreenContent } from "@/components/global/screen/screen";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import GetWeddingList from "@/api/main/get-wedding-list";
import GetWeddingInfo from "@/api/main/get-wedding-info";
import PutUpdateWedding from "@/api/main/put-update-wedding";
import PostCreateWedding from "@/api/main/post-create-wedding";
import PutConfirmWedding from "@/api/main/put-confirm-wedding";
import DeleteDeleteWedding from "@/api/main/delete-delete-wedding";
import GetWeddingInvoice from "@/api/main/get-wedding-invoice";
import PutPaymentInvoice from "@/api/main/put-payment-invoice";
import {
    Wedding,
    TableWedding,
    toggleWedding,
    selectAllWedding,
    UpdatedWedding,
    setWeddingDetail,
    NewWedding,
} from "@/redux/slice/wedding-slice";
import {
    getFoodName,
    getServiceName,
    formatPrice,
    handleVNDInput,
    convertWeddingDetail,
    convertDateToServerFormat,
} from "@/functions/convert-data";
import SetLoadingCursor from "@/functions/loading-cursor";
import { setError, setSuccess } from "@/redux/slice/error-slice";

export default function Page() {
    const dispatch = useDispatch();
    const currentUserRole = useSelector((state: RootState) => state.auth.user?.role);
    const [currentWedding, setCurrentWedding] = useState<
        | {
              fullData: Wedding;
              tableData: TableWedding;
          }
        | undefined
    >(undefined);
    const [currentWeddingInvoice, setCurrentWeddingInvoice] = useState<
        | {
              total: number;
              payment_status: number;
              invoice_date: string;
              invoice_tax: number;
              payment_at: string;
              note: string | null;
          }
        | undefined
    >(undefined);

    const [updatedWeddingInvoice, setUpdatedWeddingInvoice] = useState<
        | {
              wedding_id: string;
              payment_status: number;
              payment_at: string;
              late_fee: number;
          }
        | undefined
    >({
        wedding_id: "",
        payment_status: 0,
        payment_at: "",
        late_fee: 0,
    });

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
    const fullShiftList = useSelector((state: RootState) => state.wedding.shiftList);
    const shiftList = fullShiftList.filter((shift) => shift.activate);

    const roomList = useSelector((state: RootState) => state.wedding.roomList);
    const roomTypeList = useSelector((state: RootState) => state.wedding.roomTypeList);
    const foodList = useSelector((state: RootState) => state.wedding.foodList);
    const serviceList = useSelector((state: RootState) => state.wedding.serviceList);

    const selectedWeddingIDList = useSelector(
        (state: RootState) => state.wedding.selectedWeddingIDList,
    );

    const [tableRange, setTableRange] = useState<{
        min_table: number;
        max_table: number;
    }>({
        min_table: 0,
        max_table: 100,
    });

    const [currentNewFood, setCurrentNewFood] = useState<string | undefined>(undefined);
    const [currentNewService, setCurrentNewService] = useState<string | undefined>(undefined);

    const [isCreatingNewWedding, setIsCreatingNewWedding] = useState(false);
    const [newWedding, setNewWedding] = useState<NewWedding | undefined>({
        groom_name: "",
        bride_name: "",
        room_id: "",
        shift_name: "",
        wedding_date: "",
        num_table: 0,
        phone_number: "",
        note: "",
        payment_status: 0,
        food_orders: [],
        service_orders: [],
    });

    const [creatingStatus, setCreatingStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle",
    );

    const [lateFee, setLateFee] = useState<number>(1);

    const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);

    useEffect(() => {
        if (fullShiftList.length === 0 || roomList.length === 0) {
            return;
        }
        GetWeddingList({
            dispatch,
            page: 1,
            limit: 1000000000,
            startdate: "01/01/2000",
            enddate: "30/12/2100",
        });
    }, [roomList, fullShiftList]);

    useEffect(() => {
        if (!weddingDetail) {
            return;
        }
        setUpdatedWedding(
            convertWeddingDetail(currentWedding?.fullData.wedding_id || "", weddingDetail),
        );
        const room = roomList.find((r) => r.room_id === weddingDetail.wedding_info.room_id);
        const min_table = room?.min_table || 0;
        const max_table = room?.max_table || 100;
        setTableRange({
            min_table,
            max_table,
        });
    }, [weddingDetail]);

    useEffect(() => {
        if (!updatedWedding) {
            return;
        }
        const room = roomList.find((r) => r.room_id === updatedWedding.room_id);
        const min_table = room?.min_table || 0;
        const max_table = room?.max_table || 100;
        setTableRange({
            min_table,
            max_table,
        });
    }, [updatedWedding, roomList]);

    useEffect(() => {
        if (!newWedding) {
            return;
        }
        const room = roomList.find((r) => r.room_id === newWedding.room_id);
        const min_table = room?.min_table || 0;
        const max_table = room?.max_table || 100;
        setTableRange({
            min_table,
            max_table,
        });
    }, [newWedding]);

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

    const handleInvoiceChange = (field: string, value: string | number) => {
        setUpdatedWeddingInvoice((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    [field]: value,
                };
            }
            return prevState;
        });
    };

    const handleWeddingInfoChange = (
        field: keyof UpdatedWedding,
        value: string | number,
        isNewWedding: boolean = false,
    ) => {
        if (isNewWedding) {
            setNewWedding((prevState) => {
                if (prevState) {
                    return {
                        ...prevState,
                        [field]: value,
                    };
                }
                return prevState;
            });
            return;
        }

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
        isNewWedding: boolean = false,
    ) => {
        if (isNewWedding) {
            setNewWedding((prevState) => {
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
            return;
        }

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
        isNewWedding: boolean = false,
    ) => {
        if (isNewWedding) {
            setNewWedding((prevState) => {
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
            return;
        }

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

    const handleUpdateFoodOrder = (
        type: "delete" | "add",
        {
            foodId,
            note,
            price,
        }: {
            foodId: string;
            note: string;
            price: number;
        },
        isNewWedding: boolean = false,
    ) => {
        if (isNewWedding) {
            if (
                type === "add" &&
                newWedding &&
                newWedding.food_orders.find((f) => f.fo_id === foodId)
            ) {
                dispatch(setError("Món ăn đã tồn tại"));
                return;
            }
            console.log("New wedding");
            setNewWedding((prevState) => {
                if (prevState) {
                    if (type === "delete") {
                        return {
                            ...prevState,
                            food_orders: prevState.food_orders.filter(
                                (foodOrder) => foodOrder.fo_id !== foodId,
                            ),
                        };
                    }
                    return {
                        ...prevState,
                        food_orders: [
                            ...prevState.food_orders,
                            {
                                fo_id: foodId,
                                fo_note: note,
                                fo_price: price,
                            },
                        ],
                    };
                }
                return prevState;
            });
            return;
        }

        if (
            type === "add" &&
            updatedWedding &&
            updatedWedding.food_orders.find((f) => f.fo_id === foodId)
        ) {
            dispatch(setError("Món ăn đã tồn tại"));
            return;
        }

        setUpdatedWedding((prevState) => {
            if (prevState) {
                if (type === "delete") {
                    return {
                        ...prevState,
                        food_orders: prevState.food_orders.filter(
                            (foodOrder) => foodOrder.fo_id !== foodId,
                        ),
                    };
                }
                return {
                    ...prevState,
                    food_orders: [
                        ...prevState.food_orders,
                        {
                            fo_id: foodId,
                            fo_note: note,
                            fo_price: price,
                        },
                    ],
                };
            }
            return prevState;
        });

        if (weddingDetail) {
            dispatch(
                setWeddingDetail({
                    ...weddingDetail,
                    food_orders:
                        type === "delete"
                            ? weddingDetail.food_orders.filter(
                                  (foodOrder) => foodOrder.fo_id !== foodId,
                              )
                            : [
                                  ...weddingDetail.food_orders,
                                  {
                                      fo_id: foodId,
                                      fo_note: note,
                                      fo_price: price,
                                  },
                              ],
                }),
            );
        }
    };

    const handleUpdateServiceOrder = (
        type: "delete" | "add",
        {
            serviceId,
            note,
            num,
            price,
        }: {
            serviceId: string;
            note: string;
            num: number;
            price: number;
        },
        isNewWedding: boolean = false,
    ) => {
        if (isNewWedding) {
            if (
                type === "add" &&
                newWedding &&
                newWedding.service_orders.find((s) => s.service_id === serviceId)
            ) {
                dispatch(setError("Dịch vụ đã tồn tại"));
                return;
            }
            setNewWedding((prevState) => {
                if (prevState) {
                    if (type === "delete") {
                        return {
                            ...prevState,
                            service_orders: prevState.service_orders.filter(
                                (serviceOrder) => serviceOrder.service_id !== serviceId,
                            ),
                        };
                    }
                    return {
                        ...prevState,
                        service_orders: [
                            ...prevState.service_orders,
                            {
                                service_id: serviceId,
                                note,
                                num,
                                service_price: price,
                            },
                        ],
                    };
                }
                return prevState;
            });
            return;
        }

        if (
            type === "add" &&
            updatedWedding &&
            updatedWedding.service_orders.find((s) => s.service_id === serviceId)
        ) {
            dispatch(setError("Dịch vụ đã tồn tại"));
            return;
        }

        setUpdatedWedding((prevState) => {
            if (prevState) {
                if (type === "delete") {
                    return {
                        ...prevState,
                        service_orders: prevState.service_orders.filter(
                            (serviceOrder) => serviceOrder.service_id !== serviceId,
                        ),
                    };
                }
                return {
                    ...prevState,
                    service_orders: [
                        ...prevState.service_orders,
                        {
                            service_id: serviceId,
                            note,
                            num,
                            service_price: price,
                        },
                    ],
                };
            }
            return prevState;
        });

        if (weddingDetail) {
            dispatch(
                setWeddingDetail({
                    ...weddingDetail,
                    service_orders:
                        type === "delete"
                            ? weddingDetail.service_orders.filter(
                                  (serviceOrder) => serviceOrder.service_id !== serviceId,
                              )
                            : [
                                  ...weddingDetail.service_orders,
                                  {
                                      service_id: serviceId,
                                      note,
                                      num,
                                      service_price: price,
                                  },
                              ],
                }),
            );
        }
    };

    async function handleUpdateWedding() {
        if (updatedWedding && currentWedding) {
            const date = new Date(updatedWedding.wedding_date);
            // Get today's date with the time cleared
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Create a new date object for the day after tomorrow
            const dayAfterTomorrow = new Date(today);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

            // Check if the wedding date is before the day after tomorrow
            if (date < dayAfterTomorrow) {
                console.log("Invalid date");
                dispatch(setError("Ngày cưới phải sau ngày hôm nay và ngày mai"));
                // If the date is today, tomorrow, or in the past, return early
                return;
            }

            try {
                setUpdateStatus("loading");
                const res = await PutUpdateWedding({
                    dispatch,
                    wedding_id: currentWedding.fullData.wedding_id,
                    wedding_info: updatedWedding,
                });
                if (res) {
                    setUpdateStatus("success");
                    setUpdatedWedding({
                        ...updatedWedding,
                        food_orders: [],
                        service_orders: [],
                    });
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

    async function handleCreateWedding() {
        if (newWedding) {
            const date = new Date(newWedding.wedding_date);
            // Get today's date with the time cleared
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Create a new date object for the day after tomorrow
            const dayAfterTomorrow = new Date(today);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

            // Check if the wedding date is before the day after tomorrow
            if (date < dayAfterTomorrow) {
                dispatch(setError("Ngày cưới phải sau ngày hôm nay và ngày mai"));
                // If the date is today, tomorrow, or in the past, return early
                return;
            }

            try {
                setCreatingStatus("loading");
                const res = await PostCreateWedding({
                    dispatch,
                    wedding_info: newWedding,
                });
                if (res) {
                    setCreatingStatus("success");
                    setNewWedding({
                        ...newWedding,
                        food_orders: [],
                        service_orders: [],
                    });
                    setTimeout(() => {
                        setCreatingStatus("idle");
                    }, 3000);
                } else {
                    setCreatingStatus("error");
                    setTimeout(() => {
                        setCreatingStatus("idle");
                    }, 3000);
                }
            } catch (error) {
                setCreatingStatus("error");
                console.error(error);
                setTimeout(() => {
                    setCreatingStatus("idle");
                }, 3000);
            }
        }
    }

    const handleConfirmWedding = async () => {
        if (selectedWeddingIDList.length > 0) {
            try {
                SetLoadingCursor();
                await Promise.all(
                    selectedWeddingIDList.map(async (wedding_id) => {
                        await PutConfirmWedding(wedding_id);
                    }),
                );
                SetLoadingCursor(false);
            } catch (error) {
                console.error(error);
                SetLoadingCursor(false);
            }
        }
    };

    const handleDeleteWedding = async () => {
        if (selectedWeddingIDList.length > 0) {
            try {
                SetLoadingCursor();
                await Promise.all(
                    selectedWeddingIDList.map(async (wedding_id) => {
                        await DeleteDeleteWedding(dispatch, wedding_id);
                    }),
                );
                SetLoadingCursor(false);
            } catch (error) {
                console.error(error);
                SetLoadingCursor(false);
            }
        }
    };

    return (
        <ScreenContent
            buttonAction={() => {
                setIsCreatingNewWedding(true);
            }}
            buttonText="ĐẶT TIỆC CƯỚI"
        >
            <div className="flex flex-row gap-4">
                <Button
                    variant="contained"
                    disabled={selectedWeddingCount <= 0}
                    onClick={() => {
                        handleConfirmWedding();
                    }}
                >
                    XÁC NHẬN
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    disabled={selectedWeddingCount <= 0}
                    onClick={() => {
                        handleDeleteWedding();
                    }}
                >
                    XOÁ
                </Button>
            </div>
            <br />
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
            {/* <div className="w-full overflow-y-auto" style={{ height: "calc(100% - 220px)" }}> */}
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

                        GetWeddingInvoice(row.id).then((data) => {
                            setCurrentWeddingInvoice(data);
                            console.log(data);
                        });

                        GetWeddingInfo({
                            dispatch,
                            wedding_id: row.id,
                        })
                            .then(() => {
                                const wed = fullWeddingList.find((w) => w.wedding_id === row.id);
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
            {/* </div> */}
            {currentWedding && weddingDetail && (
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm">
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
                        <div className="flex w-full justify-between pb-2">
                            <span className="text-2xl font-[700]">THÔNG TIN TIỆC CƯỚI</span>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={() => {
                                    setShowPaymentForm(true);
                                }}
                            >
                                XEM HOÁ ĐƠN
                            </Button>
                        </div>
                        <div className="w-full h-full overflow-auto p-4">
                            <span className="font-bold">THAY ĐỔI THÔNG TIN</span>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <TextField
                                    label="Chú rể"
                                    id="groom_name"
                                    defaultValue={currentWedding.fullData.groom_name}
                                    onChange={(e) => {
                                        handleWeddingInfoChange("groom_name", e.target.value);
                                    }}
                                />
                                <TextField
                                    label="Cô dâu"
                                    id="bride_name"
                                    defaultValue={currentWedding.fullData.bride_name}
                                    onChange={(e) => {
                                        handleWeddingInfoChange("bride_name", e.target.value);
                                    }}
                                />
                                <TextField
                                    label="Số điện thoại"
                                    id="phone_number"
                                    defaultValue={weddingDetail.wedding_info.phone_number}
                                    onChange={(e) => {
                                        handleWeddingInfoChange("phone_number", e.target.value);
                                    }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDateTimePicker
                                        label="Ngày cưới"
                                        defaultValue={dayjs(currentWedding.fullData.wedding_date)}
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
                                            handleWeddingInfoChange("room_id", e.target.value);
                                        }}
                                    >
                                        {roomList.map((room) => (
                                            <MenuItem key={room.room_id} value={room.room_id}>
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
                                            handleWeddingInfoChange("shift_name", e.target.value);
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
                                <FormControl fullWidth>
                                    <InputLabel id="num_table-label">Số bàn</InputLabel>
                                    <Select
                                        labelId="num_table-label"
                                        id="num_table"
                                        label="Số bàn"
                                        defaultValue={currentWedding.fullData.num_table}
                                        onChange={(e) => {
                                            handleWeddingInfoChange("num_table", e.target.value);
                                        }}
                                    >
                                        {tableRange.min_table && tableRange.max_table ? (
                                            Array.from(
                                                {
                                                    length:
                                                        tableRange.max_table -
                                                        tableRange.min_table +
                                                        1,
                                                },
                                                (_, i) => i + tableRange.min_table,
                                            ).map((num) => (
                                                <MenuItem key={num} value={num}>
                                                    {num}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value={0}>0</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
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
                                    label="Tổng tiền"
                                    id="total"
                                    defaultValue={formatPrice(weddingDetail.invoice.total)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </div>
                            {currentUserRole !== "user" && (
                                <>
                                    <br />
                                    <span className="font-bold">TRẠNG THÁI THANH TOÁN</span>
                                    <div className="grid grid-cols-3 gap-4 pt-4">
                                        <TextField
                                            label="Tình trạng thanh toán (%)"
                                            type="number"
                                            defaultValue={currentWeddingInvoice?.payment_status}
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onChange={function (e) {
                                                // Check if value is between 0 and 100
                                                if (Number(e.target.value) < 0) {
                                                    e.target.value = "0";
                                                    handleInvoiceChange("payment_status", 0);
                                                    return;
                                                }
                                                if (Number(e.target.value) > 100) {
                                                    e.target.value = "100";
                                                    handleInvoiceChange("payment_status", 100);
                                                    return;
                                                }
                                                handleInvoiceChange(
                                                    "payment_status",
                                                    Number(e.target.value),
                                                );
                                            }}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0,
                                                    max: 100,
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Phí chậm trễ (%)"
                                            type="number"
                                            defaultValue={1}
                                            onChange={(e) => {
                                                if (Number(e.target.value) < 0) {
                                                    e.target.value = "0";
                                                    setLateFee(0);
                                                    return;
                                                }
                                                if (Number(e.target.value) > 100) {
                                                    e.target.value = "100";
                                                    setLateFee(100);
                                                    return;
                                                }
                                                setLateFee(Number(e.target.value));
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => {
                                                if (updatedWeddingInvoice) {
                                                    const date = new Date();
                                                    const day = date
                                                        .getDate()
                                                        .toString()
                                                        .padStart(2, "0");
                                                    const month = (date.getMonth() + 1)
                                                        .toString()
                                                        .padStart(2, "0"); // getMonth() is zero-based
                                                    const year = date.getFullYear().toString();

                                                    const formattedDate = `${day}/${month}/${year}`;

                                                    PutPaymentInvoice(
                                                        currentWedding.fullData.wedding_id,
                                                        updatedWeddingInvoice.payment_status,
                                                        formattedDate,
                                                        lateFee,
                                                    )
                                                        .then(() => {
                                                            dispatch(
                                                                setSuccess("Thanh toán thành công"),
                                                            );
                                                        })
                                                        .catch((error) => {
                                                            dispatch(setError(error));
                                                        });
                                                } else {
                                                    console.error("Invalid updatedWeddingInvoice");
                                                }
                                            }}
                                        >
                                            XÁC NHẬN THANH TOÁN
                                        </Button>
                                    </div>
                                </>
                            )}
                            <br />
                            <Divider />
                            <br />
                            <span className="font-bold">THÔNG TIN MÓN ĂN</span>
                            <br />
                            <span className="font-bold">
                                Số lượng: {weddingDetail.food_orders.length}
                            </span>
                            <div>
                                {weddingDetail.food_orders.map((foodOrder, index) => (
                                    <React.Fragment key={foodOrder.fo_id}>
                                        <br />
                                        <div className="flex flex-col">
                                            <span className="font-bold flex flex-row justify-between">
                                                {index + 1} - Món ăn:{" "}
                                                {getFoodName(foodList, foodOrder.fo_id)}
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    className="flex-shrink-0"
                                                    onClick={() => {
                                                        handleUpdateFoodOrder("delete", {
                                                            foodId: foodOrder.fo_id,
                                                            note: foodOrder.fo_note,
                                                            price: foodOrder.fo_price,
                                                        });
                                                    }}
                                                >
                                                    Xoá
                                                </Button>
                                            </span>
                                            <TextField
                                                label="Ghi chú"
                                                multiline
                                                rows={4}
                                                defaultValue={foodOrder.fo_note}
                                                variant="outlined"
                                                margin="normal"
                                                onChange={(e) => {
                                                    handleChangeFoodDetail(foodOrder.fo_id, {
                                                        note: e.target.value,
                                                        price: foodOrder.fo_price,
                                                    });
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

                                                    handleChangeFoodDetail(foodOrder.fo_id, {
                                                        note: foodOrder.fo_note,
                                                        price: extractedPrice,
                                                    });
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
                                            onChange={(e) => {
                                                setCurrentNewFood(String(e.target.value));
                                            }}
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
                                        onClick={() => {
                                            if (!currentNewFood) {
                                                return;
                                            }
                                            handleUpdateFoodOrder("add", {
                                                foodId: currentNewFood,
                                                note: "",
                                                price:
                                                    foodList.find(
                                                        (f) => f.food_id === currentNewFood,
                                                    )?.food_price || 0,
                                            });
                                        }}
                                    >
                                        THÊM MÓN ĂN
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <Divider />
                            <br />
                            <span className="font-bold">THÔNG TIN DỊCH VỤ</span>
                            <br />
                            <span className="font-bold">
                                Số lượng: {weddingDetail.service_orders.length}
                            </span>
                            <div>
                                {weddingDetail.service_orders.map((serviceOrder, index) => (
                                    <React.Fragment key={serviceOrder.service_id}>
                                        <br />
                                        <div className="flex flex-col">
                                            <span className="font-bold flex flex-row justify-between">
                                                {index + 1} - Dịch vụ:{" "}
                                                {getServiceName(
                                                    serviceList,
                                                    serviceOrder.service_id,
                                                )}
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    className="flex-shrink-0"
                                                    onClick={() => {
                                                        handleUpdateServiceOrder("delete", {
                                                            serviceId: serviceOrder.service_id,
                                                            note: serviceOrder.note,
                                                            num: serviceOrder.num,
                                                            price: serviceOrder.service_price,
                                                        });
                                                    }}
                                                >
                                                    Xoá
                                                </Button>
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
                                        <InputLabel id="service_id-label">Dịch vụ</InputLabel>
                                        <Select
                                            labelId="service_id-label"
                                            id="add-service_id"
                                            label="Dịch vụ"
                                            onChange={(e) => {
                                                setCurrentNewService(String(e.target.value));
                                            }}
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
                                        onClick={() => {
                                            if (!currentNewService) {
                                                return;
                                            }
                                            handleUpdateServiceOrder("add", {
                                                serviceId: currentNewService,
                                                note: "",
                                                num: 1,
                                                price:
                                                    serviceList.find(
                                                        (s) => s.service_id === currentNewService,
                                                    )?.service_price || 0,
                                            });
                                        }}
                                    >
                                        THÊM DỊCH VỤ
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-7">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentWedding(undefined);
                                    setCurrentNewFood(undefined);
                                    setUpdatedWedding(undefined);
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
            {showPaymentForm && currentWedding && weddingDetail && (
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm">
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#FFF",
                            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
                            width: "1400px",
                            height: "750px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <span className="text-2xl font-[700]">HOÁ ĐƠN THANH TOÁN</span>
                        <div className="absolute top-0 right-0">
                            <Button
                                variant="text"
                                onClick={() => {
                                    setShowPaymentForm(false);
                                }}
                            >
                                <CloseIcon />
                            </Button>
                        </div>
                        <div className="w-full h-full overflow-auto p-4">
                            <div className="grid grid-cols-3 gap-4 pt-4 text-[18px]">
                                <span>Tên chú rể: {currentWedding.fullData.groom_name}</span>
                                <span>Tên cô dâu: {currentWedding.fullData.bride_name}</span>
                                <span>
                                    Ngày thanh toán:{" "}
                                    {convertDateToServerFormat(weddingDetail?.invoice.invoice_date)}
                                </span>
                                <span>Số lượng bàn: {weddingDetail.wedding_info.num_table}</span>
                                <span>
                                    Đơn giá bàn:{" "}
                                    {formatPrice(
                                        roomTypeList.find(
                                            (roomType) =>
                                                roomType.rt_id ===
                                                weddingDetail.wedding_info.room_type,
                                        )?.rt_price || 0,
                                    )}
                                </span>
                                <span>
                                    Tổng tiền bàn:{" "}
                                    {formatPrice(
                                        (roomTypeList.find(
                                            (roomType) =>
                                                roomType.rt_id ===
                                                weddingDetail.wedding_info.room_type,
                                        )?.rt_price || 0) * weddingDetail.wedding_info.num_table,
                                    )}
                                </span>
                            </div>
                            <br />
                            <Divider />
                            <br />
                            <div>
                                <div className="grid grid-cols-11 font-bold">
                                    <span className="col-span-1">STT</span>
                                    <span className="col-span-2">Tên món ăn</span>
                                    <span className="col-span-2">Ghi chú</span>
                                    <span className="col-span-3">Giá</span>
                                    <span className="col-span-3">Thành tiền</span>
                                </div>
                                {weddingDetail.food_orders.map((foodOrder, index) => (
                                    <div key={foodOrder.fo_id} className="grid grid-cols-11">
                                        <span className="col-span-1">{index + 1}</span>
                                        <span className="col-span-2">
                                            {
                                                foodList.find(
                                                    (food) => food.food_id === foodOrder.fo_id,
                                                )?.food_name
                                            }
                                        </span>
                                        <span className="col-span-2">
                                            {foodOrder.fo_note || "Không"}
                                        </span>
                                        <span className="col-span-3">
                                            {formatPrice(foodOrder.fo_price)}
                                        </span>
                                        <span className="col-span-3">
                                            {formatPrice(
                                                foodOrder.fo_price *
                                                    weddingDetail.wedding_info.num_table,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <span className="font-bold">
                                Tổng tiền thực đơn:{" "}
                                {formatPrice(
                                    weddingDetail.food_orders.reduce((acc, cur) => {
                                        return (
                                            acc +
                                            cur.fo_price * weddingDetail.wedding_info.num_table
                                        );
                                    }, 0),
                                )}
                            </span>
                            <br />
                            <br />
                            <Divider />
                            <br />
                            <div>
                                <div className="grid grid-cols-11 font-bold">
                                    <span className="col-span-1">STT</span>
                                    <span className="col-span-2">Tên dịch vụ</span>
                                    <span className="col-span-2">Số lượng</span>
                                    <span className="col-span-3">Giá</span>
                                    <span className="col-span-3">Thành tiền</span>
                                </div>
                                {weddingDetail.service_orders.map((serviceOrder, index) => (
                                    <div
                                        key={serviceOrder.service_id}
                                        className="grid grid-cols-11"
                                    >
                                        <span className="col-span-1">{index + 1}</span>
                                        <span className="col-span-2">
                                            {
                                                serviceList.find(
                                                    (service) =>
                                                        service.service_id ===
                                                        serviceOrder.service_id,
                                                )?.service_name
                                            }
                                        </span>
                                        <span className="col-span-2">{serviceOrder.num}</span>
                                        <span className="col-span-3">
                                            {formatPrice(serviceOrder.service_price)}
                                        </span>
                                        <span className="col-span-3">
                                            {formatPrice(
                                                serviceOrder.service_price * serviceOrder.num,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <span className="font-bold">
                                Tổng tiền dịch vụ:{" "}
                                {formatPrice(
                                    weddingDetail.service_orders.reduce((acc, cur) => {
                                        return acc + cur.service_price * cur.num;
                                    }, 0),
                                )}
                            </span>
                            <br />
                            <br />
                            <span className="font-bold">
                                Tổng tiền hoá đơn:{" "}
                                {formatPrice(
                                    weddingDetail.food_orders.reduce((acc, cur) => {
                                        return (
                                            acc +
                                            cur.fo_price * weddingDetail.wedding_info.num_table
                                        );
                                    }, 0) +
                                        weddingDetail.service_orders.reduce((acc, cur) => {
                                            return acc + cur.service_price * cur.num;
                                        }, 0) +
                                        (roomTypeList.find(
                                            (roomType) =>
                                                roomType.rt_id ===
                                                weddingDetail.wedding_info.room_type,
                                        )?.rt_price || 0) *
                                            weddingDetail.wedding_info.num_table,
                                )}
                            </span>
                            <br />
                            <br />
                            <span className="font-bold">
                                Tiền đặt cọc:{" "}
                                {weddingDetail.invoice.payment_status !== 100
                                    ? formatPrice(
                                          (weddingDetail.invoice.total *
                                              weddingDetail.invoice.payment_status) /
                                              100,
                                      )
                                    : "Đã thanh toán"}
                            </span>
                            <br />
                            <br />
                            <span className="font-bold">
                                Tiền còn lại:{" "}
                                {weddingDetail.invoice.payment_status !== 100
                                    ? formatPrice(
                                          (weddingDetail.invoice.total *
                                              (100 - weddingDetail.invoice.payment_status)) /
                                              100,
                                      )
                                    : "Đã thanh toán"}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {isCreatingNewWedding && newWedding && (
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm">
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
                        <span className="text-2xl font-[700]">ĐẶT TIỆC CƯỚI</span>
                        <div className="w-full h-full overflow-auto p-4">
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <TextField
                                    label="Chú rể"
                                    id="groom_name"
                                    onChange={(e) => {
                                        handleWeddingInfoChange("groom_name", e.target.value, true);
                                    }}
                                />
                                <TextField
                                    label="Cô dâu"
                                    id="bride_name"
                                    onChange={(e) => {
                                        handleWeddingInfoChange("bride_name", e.target.value, true);
                                    }}
                                />
                                <TextField
                                    label="Số điện thoại"
                                    id="phone_number"
                                    onChange={(e) => {
                                        handleWeddingInfoChange(
                                            "phone_number",
                                            e.target.value,
                                            true,
                                        );
                                    }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDateTimePicker
                                        label="Ngày cưới"
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
                                                true,
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
                                        onChange={(e) => {
                                            handleWeddingInfoChange(
                                                "room_id",
                                                e.target.value as string,
                                                true,
                                            );
                                        }}
                                    >
                                        {roomList.map((room) => (
                                            <MenuItem key={room.room_id} value={room.room_id}>
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
                                        onChange={(e) => {
                                            handleWeddingInfoChange(
                                                "shift_name",
                                                e.target.value as string,
                                                true,
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
                                <FormControl fullWidth>
                                    <InputLabel id="num_table-label">Số bàn</InputLabel>
                                    <Select
                                        labelId="num_table-label"
                                        id="num_table"
                                        label="Số bàn"
                                        onChange={(e) => {
                                            handleWeddingInfoChange(
                                                "num_table",
                                                e.target.value as string,
                                                true,
                                            );
                                        }}
                                    >
                                        {tableRange.min_table && tableRange.max_table ? (
                                            Array.from(
                                                {
                                                    length:
                                                        tableRange.max_table -
                                                        tableRange.min_table +
                                                        1,
                                                },
                                                (_, i) => i + tableRange.min_table,
                                            ).map((num) => (
                                                <MenuItem key={num} value={num}>
                                                    {num}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value={0}>0</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Ghi chú"
                                    id="note"
                                    onChange={(e) => {
                                        handleWeddingInfoChange("note", e.target.value, true);
                                    }}
                                />
                            </div>
                            <br />
                            <Divider />
                            <br />
                            <span className="font-bold">THÔNG TIN MÓN ĂN</span>
                            <br />
                            <span className="font-bold">
                                Số lượng: {newWedding.food_orders.length}
                            </span>
                            <div>
                                {newWedding.food_orders.map((foodOrder, index) => (
                                    <React.Fragment key={foodOrder.fo_id}>
                                        <br />
                                        <div className="flex flex-col">
                                            <span className="font-bold flex flex-row justify-between">
                                                {index + 1} - Món ăn:{" "}
                                                {getFoodName(foodList, foodOrder.fo_id)}
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    className="flex-shrink-0"
                                                    onClick={() => {
                                                        handleUpdateFoodOrder(
                                                            "delete",
                                                            {
                                                                foodId: foodOrder.fo_id,
                                                                note: foodOrder.fo_note,
                                                                price: foodOrder.fo_price,
                                                            },
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Xoá
                                                </Button>
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
                                                        true,
                                                    );
                                                }}
                                            />
                                            <TextField
                                                label="Giá món ăn"
                                                value={formatPrice(foodOrder.fo_price)}
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
                                                        true,
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
                                            onChange={(e) => {
                                                setCurrentNewFood(String(e.target.value));
                                            }}
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
                                        onClick={() => {
                                            if (!currentNewFood) {
                                                return;
                                            }
                                            handleUpdateFoodOrder(
                                                "add",
                                                {
                                                    foodId: currentNewFood,
                                                    note: "",
                                                    price:
                                                        foodList.find(
                                                            (f) => f.food_id === currentNewFood,
                                                        )?.food_price || 0,
                                                },
                                                true,
                                            );
                                        }}
                                    >
                                        THÊM MÓN ĂN
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <Divider />
                            <br />
                            <span className="font-bold">THÔNG TIN DỊCH VỤ</span>
                            <br />
                            <span className="font-bold">
                                Số lượng: {newWedding.service_orders.length}
                            </span>
                            <div>
                                {newWedding.service_orders.map((serviceOrder, index) => (
                                    <React.Fragment key={serviceOrder.service_id}>
                                        <br />
                                        <div className="flex flex-col">
                                            <span className="font-bold flex flex-row justify-between">
                                                {index + 1} - Dịch vụ:{" "}
                                                {getServiceName(
                                                    serviceList,
                                                    serviceOrder.service_id,
                                                )}
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    className="flex-shrink-0"
                                                    onClick={() => {
                                                        handleUpdateServiceOrder(
                                                            "delete",
                                                            {
                                                                serviceId: serviceOrder.service_id,
                                                                note: serviceOrder.note,
                                                                num: serviceOrder.num,
                                                                price: serviceOrder.service_price,
                                                            },
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Xoá
                                                </Button>
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
                                                        true,
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
                                                        true,
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
                                                        true,
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
                                        <InputLabel id="service_id-label">Dịch vụ</InputLabel>
                                        <Select
                                            labelId="service_id-label"
                                            id="add-service_id"
                                            label="Dịch vụ"
                                            onChange={(e) => {
                                                setCurrentNewService(String(e.target.value));
                                            }}
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
                                        onClick={() => {
                                            if (!currentNewService) {
                                                return;
                                            }
                                            handleUpdateServiceOrder(
                                                "add",
                                                {
                                                    serviceId: currentNewService,
                                                    note: "",
                                                    num: 1,
                                                    price:
                                                        serviceList.find(
                                                            (s) =>
                                                                s.service_id === currentNewService,
                                                        )?.service_price || 0,
                                                },
                                                true,
                                            );
                                        }}
                                    >
                                        THÊM DỊCH VỤ
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-7">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setIsCreatingNewWedding(false);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                color={
                                    creatingStatus === "loading"
                                        ? "secondary"
                                        : creatingStatus === "success"
                                        ? "success"
                                        : creatingStatus === "error"
                                        ? "error"
                                        : "primary"
                                }
                                onClick={() => {
                                    handleCreateWedding();
                                }}
                            >
                                TẠO MỚI
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ScreenContent>
    );
}
