"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DesktopDateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RootState } from "@/redux/store/store";
import { ScreenContent } from "@/components/global/screen/screen";
import DefaultTableHead from "@/components/global/table/table-head/table-head";
import DefaultTableRow from "@/components/global/table/table-row/table-row";
import { User } from "@/redux/slice/wedding-slice";
import { convertDateToServerFormat } from "@/functions/convert-data";
import PostUpdateUser from "@/api/main/post-update-user";
import DeleteDeleteUser from "@/api/main/delete-delete-user";
import PostCreateUser from "@/api/main/post-create-user";

export default function Page() {
    const dispatch = useDispatch();

    const userList = useSelector((state: RootState) => state.wedding.userList);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [newUser, setNewUser] = useState<User>({
        id: "",
        email: "",
        full_name: "",
        phone_number: "",
        role: "staff",
        birthday: "",
        created_at: "",
        updated_at: "",
    });
    const [newUserPassword, setNewUserPassword] = useState("");
    const [isAddingUser, setIsAddingUser] = useState(false);

    const tableHead = [
        { label: "Email" },
        { label: "Tên" },
        { label: "SDT" },
        { label: "Loại tài khoản" },
    ];

    const generateRandomPassword = (length = 10) => {
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        // eslint-disable-next-line no-plusplus
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    };

    return (
        <ScreenContent
            buttonAction={() => {
                setNewUserPassword(generateRandomPassword()); // Generate random password
                setIsAddingUser(true);
            }}
            buttonText="THÊM NHÂN VIÊN"
        >
            <DefaultTableHead
                columns={tableHead}
                onSelectAllClick={() => {
                    console.log("Select all clicked");
                }}
                numSelected={0}
                rowCount={0}
                useCheckbox={false}
            />
            {userList.map((user: User) => (
                <DefaultTableRow
                    key={user.id}
                    columns={[
                        { value: user.email },
                        { value: user.full_name },
                        { value: user.phone_number },
                        { value: user.role },
                    ]}
                    selected={false}
                    onSelectClick={() => {}}
                    onItemClicked={() => {
                        setCurrentUser(user);
                    }}
                    useCheckbox={false}
                />
            ))}
            {currentUser && (
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
                            height: "450px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <div className="flex w-full justify-between pb-2">
                            <span className="text-xl font-bold">CẬP NHẬT NGƯỜI DÙNG</span>
                            {currentUser.role !== "admin" && (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        DeleteDeleteUser(dispatch, currentUser.email).then(() => {
                                            setCurrentUser(null);
                                        });
                                    }}
                                >
                                    XOÁ NGƯỜI DÙNG
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Tên"
                                defaultValue={currentUser.full_name}
                                variant="outlined"
                                onChange={(e) => {
                                    setCurrentUser({
                                        ...currentUser,
                                        full_name: e.target.value,
                                    });
                                }}
                            />
                            <TextField
                                label="Email"
                                defaultValue={currentUser.email}
                                variant="outlined"
                                disabled
                            />
                            <TextField
                                label="SĐT"
                                defaultValue={currentUser.phone_number}
                                variant="outlined"
                                onChange={(e) => {
                                    setCurrentUser({
                                        ...currentUser,
                                        phone_number: e.target.value,
                                    });
                                }}
                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Loại tài khoản</InputLabel>
                                <Select
                                    labelId="room-type"
                                    value={currentUser.role}
                                    onChange={(e) => {
                                        setCurrentUser({
                                            ...currentUser,
                                            role: e.target.value,
                                        });
                                    }}
                                    label="Loại tài khoản"
                                >
                                    <MenuItem value="admin">admin</MenuItem>
                                    <MenuItem value="staff">staff</MenuItem>
                                    <MenuItem value="user">user</MenuItem>
                                </Select>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDateTimePicker
                                    label="Ngày sinh"
                                    defaultValue={dayjs(
                                        currentUser.birthday || new Date().toISOString(),
                                    )}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    onChange={(date) => {
                                        if (!date) {
                                            console.error("Invalid date");
                                            return;
                                        }
                                        setCurrentUser({
                                            ...currentUser,
                                            birthday: date.toISOString(),
                                        });
                                    }}
                                />
                            </LocalizationProvider>
                            <TextField
                                label="ID"
                                defaultValue={currentUser.id}
                                variant="outlined"
                            />
                            <TextField
                                label="Ngày tạo"
                                defaultValue={convertDateToServerFormat(currentUser.created_at)}
                                variant="outlined"
                                disabled
                            />
                            <TextField
                                label="Ngày cập nhật"
                                defaultValue={convertDateToServerFormat(currentUser.updated_at)}
                                variant="outlined"
                                disabled
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setCurrentUser(null);
                                }}
                            >
                                THOÁT
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    const date = new Date(currentUser.birthday);
                                    const day = date.getDate().toString().padStart(2, "0");
                                    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-based
                                    const year = date.getFullYear().toString(); // Keep the full year

                                    const formattedDate = `${day}/${month}/${year}`;

                                    PostUpdateUser(dispatch, {
                                        email: currentUser.email,
                                        full_name: currentUser.full_name,
                                        phone_number: currentUser.phone_number,
                                        birthday: formattedDate,
                                        id: currentUser.id,
                                    }).then(() => {
                                        setCurrentUser(null);
                                    });
                                }}
                            >
                                LƯU
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {isAddingUser && (
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
                            height: "350px",
                            padding: "20px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            // overflowY: "auto",
                        }}
                    >
                        <span className="text-xl font-bold">THÊM NHÂN VIÊN</span>
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Tên"
                                defaultValue={newUser.full_name}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        full_name: e.target.value,
                                    });
                                }}
                            />
                            <TextField
                                label="Email"
                                defaultValue={newUser.email}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        email: e.target.value,
                                    });
                                }}
                            />
                            <TextField
                                label="SĐT"
                                defaultValue={newUser.phone_number}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        phone_number: e.target.value,
                                    });
                                }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDateTimePicker
                                    label="Ngày sinh"
                                    defaultValue={dayjs(
                                        newUser.birthday || new Date().toISOString(),
                                    )}
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    onChange={(d) => {
                                        if (!d) {
                                            console.error("Invalid date");
                                            return;
                                        }

                                        const date = new Date(d.toISOString());
                                        const day = date.getDate().toString().padStart(2, "0");
                                        const month = (date.getMonth() + 1)
                                            .toString()
                                            .padStart(2, "0"); // getMonth() is zero-based
                                        const year = date.getFullYear().toString(); // Keep the full year

                                        const formattedDate = `${day}/${month}/${year}`;

                                        setNewUser({
                                            ...newUser,
                                            birthday: formattedDate,
                                        });
                                    }}
                                />
                            </LocalizationProvider>
                            <TextField
                                label="ID"
                                defaultValue={newUser.id}
                                variant="outlined"
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        id: e.target.value,
                                    });
                                }}
                            />
                            <TextField
                                label="Mật khẩu"
                                variant="outlined"
                                defaultValue={newUserPassword}
                                onChange={(e) => {
                                    setNewUserPassword(e.target.value);
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                    setIsAddingUser(false);
                                }}
                            >
                                HUỶ
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    PostCreateUser(dispatch, newUser, newUserPassword).then(() => {
                                        setIsAddingUser(false);
                                    });
                                }}
                            >
                                LƯU
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ScreenContent>
    );
}
