"use client";

import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import signupSuccess from "@/redux/slice/auth-slice";
import { PostSignup } from "@/api/auth/post-login";
import customCss from "./signup.module.css";
import {
    DesktopDatePicker,
    DesktopDateTimePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { User } from "@/redux/slice/wedding-slice";

export default function SignupForm() {
    const [newUser, setNewUser] = React.useState<User>({
        id: "",
        email: "",
        full_name: "",
        phone_number: "",
        role: "staff",
        birthday: "",
        created_at: "",
        updated_at: "",
    });
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [apiCalling, setApiCalling] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    async function handleSignup(
        InputEmail: string,
        InputPassword: string,
        InputConfirmPassword: string,
        InputFullName: string,
        InputPhoneNumber: string,
        InputBirthday: string,
    ) {
        setApiCalling(true);
        setShowError(false);
        if (InputPassword !== InputConfirmPassword || InputPassword.length < 6) {
            setShowError(true);
            setApiCalling(false);
            return;
        }
        if (InputPhoneNumber.length !== 10) {
            setShowError(true);
            setApiCalling(false);
            return;
        }
        try {
            const response = await PostSignup(
                InputEmail,
                InputPassword,
                InputFullName,
                InputPhoneNumber,
                InputBirthday,
            );
            if (response) {
                setApiCalling(false);
                window.location.replace("/");
            } else {
                setShowError(true);
                setApiCalling(false);
            }
        } catch (error) {
            setShowError(true);
            setApiCalling(false);
        }
    }

    return (
        <main className={`${customCss.Background}`}>
            <span className={`${customCss.BgrCircleBot}`} />
            <span className={`${customCss.BgrCircleTop}`} />
            <div className={`${customCss.SignupBox}`}>
                <div className={`${customCss.LoginForm}`}>
                    <h1 className="flex w-full font-black text-[28px] text-black mb-[32px]">
                        Đăng ký
                    </h1>

                    <TextField
                        label="Email"
                        // InputLabelProps={{ shrink: true }}
                        onChange={(e) =>
                            setNewUser({
                                ...newUser,
                                email: e.target.value,
                            })
                        }
                        className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                        required
                        sx={{ mb: "12px", border: "1px" }}
                        variant="outlined"
                        color="secondary"
                        type="email"
                        fullWidth
                        value={newUser.email}
                        error={showError}
                        autoComplete="tel-national username"
                    />
                    <TextField
                        label="Họ và tên"
                        // InputLabelProps={{ shrink: true }}
                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                        required
                        variant="outlined"
                        color="secondary"
                        error={showError}
                        value={newUser.full_name}
                        fullWidth
                        sx={{ mb: "12px", border: "1px" }}
                        autoComplete="tel-national username"
                    />
                    <TextField
                        label="Số điện thoại"
                        // InputLabelProps={{ shrink: true }}
                        onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                        className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                        required
                        type="number"
                        variant="outlined"
                        color="secondary"
                        error={showError}
                        value={newUser.phone_number}
                        fullWidth
                        sx={{ mb: "12px", border: "1px" }}
                        autoComplete="tel-national username"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Ngày sinh"
                            format="DD/MM/YYYY"
                            onChange={(date) => {
                                if (!date) {
                                    console.error("Invalid date");
                                    return;
                                }

                                setNewUser({
                                    ...newUser,
                                    birthday: date.format("DD/MM/YYYY"),
                                });
                            }}
                            sx={{
                                mb: "12px",
                                width: "100%",
                                border: showError ? "1px solid #ef4444" : "",
                                borderRadius: "5px",
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Password"
                        // InputLabelProps={{ shrink: true }}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                        required
                        variant="outlined"
                        color="secondary"
                        type="password"
                        value={password}
                        error={showError}
                        fullWidth
                        sx={{ mb: "12px", border: "1px" }}
                        autoComplete="tel-national username"
                    />
                    <TextField
                        label="Confirm Password"
                        // InputLabelProps={{ shrink: true }}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                        required
                        variant="outlined"
                        color="secondary"
                        type="password"
                        value={confirmPassword}
                        error={showError}
                        fullWidth
                        sx={{ mb: "12px", border: "1px" }}
                        autoComplete="tel-national username"
                    />
                    <small
                        className={`flex w-full mb-[12px] ${showError ? "text-red-500" : "hidden"}`}
                    >
                        Thông tin đăng ký không hợp lệ
                    </small>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleSignup(
                                newUser.email,
                                password,
                                confirmPassword,
                                newUser.full_name,
                                newUser.phone_number,
                                newUser.birthday,
                            );
                        }}
                        disabled={apiCalling}
                        className="flex w-full items-center justify-center h-[42px]"
                    >
                        Đăng ký
                    </Button>

                    <div className="flex text-gray-500 w-full justify-center mt-[20px] text-[16px]">
                        Đã có tài khoản?&nbsp;
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
