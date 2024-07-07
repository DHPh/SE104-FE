"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { FoodList } from "@/redux/slice/wedding-slice";
import PostAddFood from "@/api/main/post-add-food";
import PutUpdateFood from "@/api/main/put-update-food";
import PostUploadFoodImage from "@/api/main/post-upload-food-image";
import GetFoodImage from "@/api/main/get-food-image";
import { formatPrice } from "@/functions/convert-data";
import DeleteDeleteFood from "@/api/main/delete-delete-food";

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
    const foodList = useSelector((state: RootState) => state.wedding.foodList);

    const [currentFood, setCurrentFood] = useState<FoodList | null>(null);

    const [currentFoodImage, setCurrentFoodImage] = useState<string | null | undefined>(null);
    const [showImage, setShowImage] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [newFood, setNewFood] = useState<FoodList>({
        food_id: "",
        food_name: "",
        food_price: 0,
        created_at: "",
        updated_at: "",
        note: "",
    });

    const tableHead = [{ label: "Tên món ăn" }, { label: "Đơn giá" }];

    async function handleUploadImage(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        PostUploadFoodImage(currentFood?.food_id as string, formData).then(() => {
            GetFoodImage(currentFood?.food_id as string)
                .then((img) => {
                    setCurrentFoodImage(img);
                })
                .catch(() => {
                    setCurrentFoodImage(undefined);
                });
        });
    }

    return (
        <ScreenContent
            buttonAction={() => {
                setIsCreating(true);
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
                        { id: "type", value: formatPrice(food.food_price) },
                    ]}
                    selected={false}
                    onSelectClick={() => {}}
                    onItemClicked={() => {
                        GetFoodImage(currentFood?.food_id as string)
                            .then((img) => {
                                setCurrentFoodImage(img);
                            })
                            .catch(() => {
                                setCurrentFoodImage(undefined);
                            });
                        setCurrentFood(food);
                    }}
                    useCheckbox={false}
                />
            ))}
            {currentFood && (
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
                        <div className="flex w-full justify-between pb-2">
                            <span className="text-xl font-bold">CẬP NHẬT MÓN ĂN</span>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    DeleteDeleteFood(dispatch, currentFood.food_id).then(() => {
                                        setCurrentFood(null);
                                    });
                                }}
                            >
                                XOÁ MÓN ĂN
                            </Button>
                        </div>
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <TextField
                                    label="Tên món ăn"
                                    variant="outlined"
                                    value={currentFood.food_name}
                                    onChange={(e) => {
                                        setCurrentFood({
                                            ...currentFood,
                                            food_name: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Đơn giá"
                                    variant="outlined"
                                    value={currentFood.food_price}
                                    onChange={(e) => {
                                        setCurrentFood({
                                            ...currentFood,
                                            food_price: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    value={currentFood.food_id}
                                    disabled
                                />
                                <TextField
                                    label="Ngày tạo"
                                    variant="outlined"
                                    value={currentFood.created_at}
                                    disabled
                                />
                                <TextField
                                    label="Ngày cập nhật"
                                    variant="outlined"
                                    value={currentFood.updated_at}
                                    disabled
                                />
                                <TextField
                                    label="Ghi chú"
                                    variant="outlined"
                                    value={currentFood.note}
                                    onChange={(e) => {
                                        setCurrentFood({
                                            ...currentFood,
                                            note: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            {currentFoodImage === undefined ? (
                                <div className="pt-4">
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    <label className="text-blue-500 hover:underline cursor-pointer">
                                        Tải hình ảnh món ăn
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
                                    Xem hình ảnh món ăn
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentFoodImage(null);
                                    setCurrentFood(null);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    PutUpdateFood(dispatch, {
                                        food_id: currentFood.food_id,
                                        food_name: currentFood.food_name,
                                        food_price: currentFood.food_price,
                                        food_note: currentFood.note || "",
                                    }).then(() => {
                                        setCurrentFood(null);
                                    });
                                }}
                            >
                                LƯU
                            </Button>
                        </div>
                    </div>
                    {showImage && currentFoodImage && (
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
                            <ZoomableImage src={currentFoodImage} alt="Room image" />
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
                            height: "300px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <span className="text-xl font-bold pb-2">THÊM MÓN ĂN MỚI</span>
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <TextField
                                    label="Tên món ăn"
                                    variant="outlined"
                                    value={newFood.food_name}
                                    onChange={(e) => {
                                        setNewFood({
                                            ...newFood,
                                            food_name: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Đơn giá"
                                    type="number"
                                    variant="outlined"
                                    value={newFood.food_price}
                                    onChange={(e) => {
                                        setNewFood({
                                            ...newFood,
                                            food_price: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    value={newFood.food_id}
                                    onChange={(e) => {
                                        setNewFood({
                                            ...newFood,
                                            food_id: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Ghi chú"
                                    variant="outlined"
                                    value={newFood.note}
                                    onChange={(e) => {
                                        setNewFood({
                                            ...newFood,
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
                                    PostAddFood(dispatch, {
                                        food_id: newFood.food_id,
                                        food_name: newFood.food_name,
                                        food_price: newFood.food_price,
                                        food_note: newFood.note || "",
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
