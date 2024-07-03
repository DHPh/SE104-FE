"use client";

import React, { useState, useEffect } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { RoomList } from "@/redux/slice/wedding-slice";
import GetRoomImage from "@/api/main/get-room-image";
import PutUpdateRoom from "@/api/main/put-update-room";
import PostUploadRoomImage from "@/api/main/post-upload-room-image";
import PostAddRoom from "@/api/main/post-add-room";

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<EventTarget>) => {
        const target = e.target as HTMLDivElement;
        const { left, top, width, height } = target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <div className="image-container z-[101]" onMouseMove={handleMouseMove}>
            <img
                src={src}
                alt={alt}
                style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transform: "scale(1.5)", // Ensure this matches the scale in your CSS
                    padding: "20px",
                }}
            />
        </div>
    );
}

export default function Page() {
    const dispatch = useDispatch();
    const roomList = useSelector((state: RootState) => state.wedding.roomList);
    const roomTypeList = useSelector((state: RootState) => state.wedding.roomTypeList);

    const [currentRoom, setCurrentRoom] = useState<RoomList | null>(null);
    const [currentRoomImage, setCurrentRoomImage] = useState<string | null | undefined>(null);

    const [showImage, setShowImage] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [newRoom, setNewRoom] = useState<RoomList>({
        room_id: "",
        room_name: "",
        room_type: "",
        max_table: 0,
        min_table: 0,
        note: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    const searchParams = new URLSearchParams(window.location.search);

    const tableHead = [
        { label: "Tên sảnh" },
        { label: "Loại sảnh" },
        { label: "Số lượng bàn tối đa" },
        { label: "Số lượng bàn tối thiểu" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            while (!roomList.length) {
                // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            if (searchParams.has("room_id")) {
                const room = roomList.find((r) => r.room_id === searchParams.get("room_id"));
                if (room) {
                    GetRoomImage(room.room_id)
                        .then((img) => {
                            setCurrentRoomImage(img);
                        })
                        .catch(() => {
                            setCurrentRoomImage(undefined);
                        });
                    setCurrentRoom(room);
                }
            }
        };

        fetchData();
    }, [searchParams, roomList]); // Added roomList to the dependency array as it's being used inside the effect

    async function handleUploadImage(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        PostUploadRoomImage(currentRoom?.room_id as string, formData).then(() => {
            GetRoomImage(currentRoom?.room_id as string)
                .then((img) => {
                    setCurrentRoomImage(img);
                })
                .catch(() => {
                    setCurrentRoomImage(undefined);
                });
        });
    }

    return (
        <ScreenContent
            buttonAction={() => {
                setIsCreating(true);
            }}
            buttonText="THÊM SẢNH"
        >
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {}}
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
                    onSelectClick={() => {}}
                    onItemClicked={() => {
                        GetRoomImage(room.room_id)
                            .then((img) => {
                                setCurrentRoomImage(img);
                            })
                            .catch(() => {
                                setCurrentRoomImage(undefined);
                            });
                        setCurrentRoom(room);
                    }}
                    useCheckbox={false}
                />
            ))}
            {currentRoom && (
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
                            height: "400px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <span className="text-xl font-bold pb-2">CẬP NHẬT SẢNH</span>
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <TextField
                                    label="Tên sảnh"
                                    variant="outlined"
                                    value={currentRoom.room_name}
                                    onChange={(e) => {
                                        setCurrentRoom({
                                            ...currentRoom,
                                            room_name: e.target.value,
                                        });
                                    }}
                                />
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="room-type">Loại sảnh</InputLabel>
                                    <Select
                                        labelId="room-type"
                                        value={currentRoom.room_type}
                                        onChange={(e) => {
                                            setCurrentRoom({
                                                ...currentRoom,
                                                room_type: e.target.value as string,
                                            });
                                        }}
                                        label="Loại sảnh"
                                    >
                                        {roomTypeList.map((roomType) => (
                                            <MenuItem key={roomType.rt_id} value={roomType.rt_name}>
                                                {roomType.rt_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Số lượng bàn tối đa"
                                    variant="outlined"
                                    type="number"
                                    value={currentRoom.max_table}
                                    onChange={(e) => {
                                        setCurrentRoom({
                                            ...currentRoom,
                                            max_table: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="Số lượng bàn tối thiểu"
                                    variant="outlined"
                                    type="number"
                                    value={currentRoom.min_table}
                                    onChange={(e) => {
                                        setCurrentRoom({
                                            ...currentRoom,
                                            min_table: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    value={currentRoom.room_id}
                                    disabled
                                />
                                <TextField
                                    label="Ghi chú"
                                    variant="outlined"
                                    value={currentRoom.note}
                                    onChange={(e) => {
                                        setCurrentRoom({
                                            ...currentRoom,
                                            note: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            {currentRoomImage === undefined ? (
                                <div className="pt-4">
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    <label className="text-blue-500 hover:underline cursor-pointer">
                                        Tải hình ảnh sảnh
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleUploadImage(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="text-blue-500 hover:underline cursor-pointer pt-4"
                                    onClick={() => {
                                        setShowImage(true);
                                    }}
                                >
                                    {currentRoomImage === undefined
                                        ? "Tải hình ảnh sảnh"
                                        : "Xem hình ảnh sảnh"}
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentRoomImage(null);
                                    setCurrentRoom(null);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    PutUpdateRoom(dispatch, {
                                        room_id: currentRoom.room_id,
                                        room_name: currentRoom.room_name,
                                        room_type: currentRoom.room_type,
                                        max_table: currentRoom.max_table,
                                        min_table: currentRoom.min_table,
                                        room_note: currentRoom.note,
                                    }).then(() => {
                                        setCurrentRoom(null);
                                    });
                                }}
                            >
                                LƯU
                            </Button>
                        </div>
                    </div>
                    {showImage && currentRoomImage && (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "#FFF",
                                boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
                                width: "700px",
                                height: "700px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                zIndex: "100",
                                objectFit: "contain",
                                padding: "20px",
                                gap: "20px",
                            }}
                        >
                            <div className="flex w-full justify-between">
                                <Button variant="contained" color="primary">
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    <label>
                                        CẬP NHẬT HÌNH ẢNH
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleUploadImage(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </Button>
                                <button
                                    type="button"
                                    className="w-[40px] h-[40px] z-[102]"
                                    onClick={() => setShowImage(false)}
                                >
                                    <CloseIcon className="!text-[40px]" />
                                </button>
                            </div>
                            <ZoomableImage src={currentRoomImage} alt="Room image" />
                        </div>
                    )}
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
                            height: "370px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <span className="text-xl font-bold pb-2">TẠO SẢNH MỚI</span>
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <TextField
                                    label="Tên sảnh"
                                    variant="outlined"
                                    value={newRoom.room_name}
                                    onChange={(e) => {
                                        setNewRoom({
                                            ...newRoom,
                                            room_name: e.target.value,
                                        });
                                    }}
                                />
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="room-type">Loại sảnh</InputLabel>
                                    <Select
                                        labelId="room-type"
                                        value={newRoom.room_type}
                                        onChange={(e) => {
                                            setNewRoom({
                                                ...newRoom,
                                                room_type: e.target.value as string,
                                            });
                                        }}
                                        label="Loại sảnh"
                                    >
                                        {roomTypeList.map((roomType) => (
                                            <MenuItem key={roomType.rt_id} value={roomType.rt_name}>
                                                {roomType.rt_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Số lượng bàn tối đa"
                                    variant="outlined"
                                    type="number"
                                    value={newRoom.max_table}
                                    onChange={(e) => {
                                        setNewRoom({
                                            ...newRoom,
                                            max_table: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="Số lượng bàn tối thiểu"
                                    variant="outlined"
                                    type="number"
                                    value={newRoom.min_table}
                                    onChange={(e) => {
                                        setNewRoom({
                                            ...newRoom,
                                            min_table: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    value={newRoom.room_id}
                                    onChange={(e) => {
                                        setNewRoom({
                                            ...newRoom,
                                            room_id: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Ghi chú"
                                    variant="outlined"
                                    value={newRoom.note}
                                    onChange={(e) => {
                                        setNewRoom({
                                            ...newRoom,
                                            note: e.target.value,
                                        });
                                    }}
                                />
                            </div>
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
                                    PostAddRoom(dispatch, {
                                        room_id: newRoom.room_id,
                                        room_name: newRoom.room_name,
                                        room_type: newRoom.room_type,
                                        max_table: newRoom.max_table,
                                        min_table: newRoom.min_table,
                                        room_note: newRoom.note,
                                    }).then(() => {
                                        setIsCreating(false);
                                    });
                                }}
                            >
                                TẠO
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ScreenContent>
    );
}
