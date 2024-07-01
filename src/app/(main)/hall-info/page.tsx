"use client";

import { useState } from "react";
import { Button, FormControlLabel, styled, Switch, SwitchProps, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { RoomTypeList, ShiftList } from "@/redux/slice/wedding-slice";
import PutUpdateShift from "@/api/main/put-update-shift";
import PostAddRoomType from "@/api/main/post-add-room-type";
import PutUpdateRoomType from "@/api/main/put-update-room-type";
import DeleteDeleteRoomType from "@/api/main/delete-delete-room-type";
import { convertDateToServerFormat, formatPrice, getPriceNumber } from "@/functions/convert-data";

const IOSSwitch = styled((props: SwitchProps) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
                opacity: 1,
                border: 0,
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
            },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
            color:
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
    },
    "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
    },
    "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500,
        }),
    },
}));

export default function Page() {
    const dispatch = useDispatch();

    const roomTypeList = useSelector((state: RootState) => state.wedding.roomTypeList);
    const shiftList = useSelector((state: RootState) => state.wedding.shiftList);

    const [currentRoomType, setCurrentRoomType] = useState<RoomTypeList | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [newRoomType, setNewRoomType] = useState<RoomTypeList>({
        rt_id: "",
        rt_name: "",
        rt_price: 0,
        created_at: "",
        updated_at: "",
    });

    const tableHead = [
        { label: "Tên loại sảnh" },
        { label: "Giá" },
        { label: "Ngày tạo" },
        { label: "Ngày cập nhật" },
    ];

    return (
        <ScreenContent
            buttonAction={() => {
                setIsCreating(true);
            }}
            buttonText="THÊM LOẠI SẢNH"
        >
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {
                    console.log("Select all clicked");
                }}
                numSelected={0}
                rowCount={roomTypeList.length}
                useCheckbox={false}
            />
            {roomTypeList.map((roomType: RoomTypeList) => (
                <DefaultTableRow
                    key={roomType.rt_id}
                    columns={[
                        { id: "name", value: roomType.rt_name },
                        { id: "price", value: formatPrice(roomType.rt_price) },
                        { id: "created", value: convertDateToServerFormat(roomType.created_at) },
                        { id: "updated", value: convertDateToServerFormat(roomType.updated_at) },
                    ]}
                    selected={false}
                    onSelectClick={() => {}}
                    onItemClicked={() => {
                        setCurrentRoomType(roomType);
                    }}
                    useCheckbox={false}
                />
            ))}
            {currentRoomType && (
                <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-50">
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#FFF",
                            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
                            width: "600px",
                            height: "300px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <div className="flex w-full justify-between pb-2">
                            <span className="text-xl font-bold">CẬP NHẬT LOẠI SẢNH</span>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    DeleteDeleteRoomType(dispatch, currentRoomType.rt_id);
                                    setCurrentRoomType(null);
                                }}
                            >
                                XOÁ LOẠI SẢNH
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Tên loại sảnh"
                                defaultValue={currentRoomType.rt_name}
                                variant="outlined"
                                onChange={(e) => {
                                    setCurrentRoomType({
                                        ...currentRoomType,
                                        rt_name: e.target.value,
                                    });
                                }}
                            />
                            <TextField
                                label="Giá"
                                defaultValue={formatPrice(currentRoomType.rt_price)}
                                variant="outlined"
                                onChange={(e) => {
                                    setCurrentRoomType({
                                        ...currentRoomType,
                                        rt_price: getPriceNumber(e.target.value),
                                    });
                                }}
                            />
                            <TextField
                                label="ID"
                                defaultValue={currentRoomType.rt_id}
                                variant="outlined"
                                disabled
                            />
                            <TextField
                                label="Ngày tạo"
                                defaultValue={convertDateToServerFormat(currentRoomType.created_at)}
                                variant="outlined"
                                disabled
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentRoomType(null);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    PutUpdateRoomType(dispatch, {
                                        rt_id: currentRoomType.rt_id,
                                        rt_name: currentRoomType.rt_name,
                                        rt_price: currentRoomType.rt_price,
                                        created_at: currentRoomType.created_at,
                                        updated_at: currentRoomType.updated_at,
                                    }).then(() => {
                                        setCurrentRoomType(null);
                                    });
                                }}
                            >
                                LƯU
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {isCreating && (
                <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-50">
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#FFF",
                            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
                            width: "600px",
                            height: "300px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <div className="flex w-full justify-between pb-2">
                            <span className="text-xl font-bold">THÊM LOẠI SẢNH</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Tên loại sảnh"
                                defaultValue={newRoomType.rt_name}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewRoomType({
                                        ...newRoomType,
                                        rt_name: e.target.value,
                                    });
                                }}
                            />
                            <TextField
                                label="Giá"
                                defaultValue={formatPrice(newRoomType.rt_price)}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewRoomType({
                                        ...newRoomType,
                                        rt_price: getPriceNumber(e.target.value),
                                    });
                                }}
                            />
                            <TextField
                                label="ID"
                                defaultValue={newRoomType.rt_id}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewRoomType({
                                        ...newRoomType,
                                        rt_id: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setIsCreating(false);
                                }}
                            >
                                HUỶ
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    PostAddRoomType(dispatch, {
                                        rt_id: newRoomType.rt_id,
                                        rt_name: newRoomType.rt_name,
                                        rt_price: newRoomType.rt_price,
                                        created_at: newRoomType.created_at,
                                        updated_at: newRoomType.updated_at,
                                    }).then(() => {
                                        setIsCreating(false);
                                    });
                                }}
                            >
                                THÊM
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <br />
            <br />
            <br />
            <span className="font-bold text-xl">CA LÀM VIỆC</span>
            <br />
            <br />
            <DefaultTableHead
                columns={[{ label: "Tên ca" }, { label: "ID" }, { label: "Hoạt động" }]}
                onSelectAllClick={() => {
                    console.log("Select all clicked");
                }}
                numSelected={0}
                rowCount={shiftList.length}
                useCheckbox={false}
            />
            {shiftList.map((shift: ShiftList) => {
                let { activate } = shift;

                return (
                    <DefaultTableRow
                        key={shift.shift_name}
                        columns={[
                            { id: "name", value: shift.note },
                            { id: "id", value: shift.shift_name },
                            {
                                id: "start",
                                value: (
                                    <FormControlLabel
                                        control={
                                            <IOSSwitch
                                                sx={{ m: 1 }}
                                                defaultChecked={activate === 1}
                                                onChange={(e) => {
                                                    const { checked } = e.target;
                                                    activate = checked ? 1 : 0;

                                                    PutUpdateShift({
                                                        dispatch,
                                                        shift: {
                                                            note: shift.note,
                                                            shift_name: shift.shift_name,
                                                            activate: checked ? 1 : 0,
                                                            created_at: shift.created_at,
                                                            updated_at: shift.updated_at,
                                                        },
                                                    });
                                                }}
                                            />
                                        }
                                        label={activate ? "Hoạt động" : "Không hoạt động"}
                                    />
                                ),
                            },
                        ]}
                        selected={false}
                        onSelectClick={() => {}}
                        onItemClicked={() => {}}
                        useCheckbox={false}
                    />
                );
            })}
        </ScreenContent>
    );
}
