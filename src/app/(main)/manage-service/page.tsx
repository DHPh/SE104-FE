"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "@/redux/store/store";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { ScreenContent } from "@/components/global/screen/screen";
import { ServiceList } from "@/redux/slice/wedding-slice";
import PostAddService from "@/api/main/post-add-service";
import PutUpdateService from "@/api/main/put-update-service";
import PostUploadServiceImage from "@/api/main/post-upload-service-image";
import GetServiceImage from "@/api/main/get-service-image";
import { formatPrice } from "@/functions/convert-data";

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
    const serviceList = useSelector((state: RootState) => state.wedding.serviceList);

    const [currentService, setCurrentService] = useState<ServiceList | null>(null);

    const [currentServiceImage, setCurrentServiceImage] = useState<string | null | undefined>(null);
    const [showImage, setShowImage] = useState(false);

    const [isCreating, setIsCreating] = useState(false);
    const [newService, setNewService] = useState<ServiceList>({
        service_id: "",
        service_name: "",
        service_price: 0,
        created_at: "",
        updated_at: "",
        note: "",
    });

    const tableHead = [{ label: "Tên dịch vụ" }, { label: "Đơn giá" }];

    async function handleUploadImage(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        PostUploadServiceImage(currentService?.service_id as string, formData).then(() => {
            GetServiceImage(currentService?.service_id as string)
                .then((img) => {
                    setCurrentServiceImage(img);
                })
                .catch(() => {
                    setCurrentServiceImage(undefined);
                });
        });
    }

    return (
        <ScreenContent
            buttonAction={() => {
                setIsCreating(true);
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
                        { id: "price", value: formatPrice(service.service_price) },
                    ]}
                    selected={false}
                    onSelectClick={() => {}}
                    onItemClicked={() => {
                        GetServiceImage(currentService?.service_id as string)
                            .then((img) => {
                                setCurrentServiceImage(img);
                            })
                            .catch(() => {
                                setCurrentServiceImage(undefined);
                            });
                        setCurrentService(service);
                    }}
                    useCheckbox={false}
                />
            ))}
            {currentService && (
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
                        <span className="text-xl font-bold pb-2">CẬP NHẬT DỊCH VỤ</span>
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <TextField
                                    label="Tên dịch vụ"
                                    variant="outlined"
                                    value={currentService.service_name}
                                    onChange={(e) => {
                                        setCurrentService({
                                            ...currentService,
                                            service_name: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Đơn giá"
                                    variant="outlined"
                                    value={currentService.service_price}
                                    onChange={(e) => {
                                        setCurrentService({
                                            ...currentService,
                                            service_price: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    value={currentService.service_id}
                                    disabled
                                />
                                <TextField
                                    label="Ngày tạo"
                                    variant="outlined"
                                    value={currentService.created_at}
                                    disabled
                                />
                                <TextField
                                    label="Ngày cập nhật"
                                    variant="outlined"
                                    value={currentService.updated_at}
                                    disabled
                                />
                                <TextField
                                    label="Ghi chú"
                                    variant="outlined"
                                    value={currentService.note}
                                    onChange={(e) => {
                                        setCurrentService({
                                            ...currentService,
                                            note: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            {currentServiceImage === undefined ? (
                                <div className="pt-4">
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    <label className="text-blue-500 hover:underline cursor-pointer">
                                        Tải hình ảnh dịch vụ
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
                                    Xem hình ảnh dịch vụ
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentServiceImage(null);
                                    setCurrentService(null);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    PutUpdateService(dispatch, {
                                        service_id: currentService.service_id,
                                        service_name: currentService.service_name,
                                        service_price: currentService.service_price,
                                        service_note: currentService.note,
                                    }).then(() => {
                                        setCurrentService(null);
                                    });
                                }}
                            >
                                LƯU
                            </Button>
                        </div>
                    </div>
                    {showImage && currentServiceImage && (
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
                            <ZoomableImage src={currentServiceImage} alt="Room image" />
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
                        <span className="text-xl font-bold pb-2">THÊM DỊCH VỤ MỚI</span>
                        <div className="w-full">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <TextField
                                    label="Tên dịch vụ"
                                    variant="outlined"
                                    value={newService.service_name}
                                    onChange={(e) => {
                                        setNewService({
                                            ...newService,
                                            service_name: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Đơn giá"
                                    type="number"
                                    variant="outlined"
                                    value={newService.service_price}
                                    onChange={(e) => {
                                        setNewService({
                                            ...newService,
                                            service_price: Number(e.target.value),
                                        });
                                    }}
                                />
                                <TextField
                                    label="ID"
                                    variant="outlined"
                                    value={newService.service_id}
                                    onChange={(e) => {
                                        setNewService({
                                            ...newService,
                                            service_id: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    label="Ghi chú"
                                    variant="outlined"
                                    value={newService.note}
                                    onChange={(e) => {
                                        setNewService({
                                            ...newService,
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
                                    PostAddService(dispatch, {
                                        service_id: newService.service_id,
                                        service_name: newService.service_name,
                                        service_price: newService.service_price,
                                        service_note: newService.note,
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
