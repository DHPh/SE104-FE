"use client";

import Image from "next/image";
import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logoutSuccess } from "@/redux/slice/auth-slice";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, Input, FormHelperText } from "@mui/material";
import React from "react";
import postLogin from "@/api/auth/post-login";
import customCss from "./login.module.css";

export default function LoginForm() {
    const dispatch = useDispatch();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [apiCalling, setApiCalling] = React.useState(false);
    async function handleLogin(email: string, password: string) {
        setApiCalling(true);
        setShowError(false);
        const response = await postLogin(email, password);
        if (typeof response === "object" && response.status === 200) {
            dispatch(
                loginSuccess(await response.data)
            );
            setApiCalling(false);
            window.location.replace("/");
        } else {
            setShowError(true);
            setApiCalling(false);
        }
    }

    return (
        <>
            <main className={`${customCss.Background}`}>
                <span className={`${customCss.BgrCircleBot}`}></span>
                <span className={`${customCss.BgrCircleTop}`}></span>
                <div className={`${customCss.LoginBox}`}>
                    <div className={`${customCss.Form}`}>
                        <h1 className="flex w-full font-black text-[28px] text-black mb-[32px]">
                            Đăng nhập
                        </h1>

                        <TextField
                            label="Email"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setEmail(e.target.value)}
                            className = {`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                            required
                            sx = {{mb: "12px", border: "1px"}}
                            variant="outlined"
                            color="secondary"
                            type="email"
                            fullWidth
                            value={email}
                            error={emailError}
                            autoComplete="tel-national username"
                        />
                        <TextField
                            label="Password"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                            required
                            variant="outlined"
                            color="secondary"
                            type="password"
                            value={password}
                            error={passwordError}
                            fullWidth
                            sx={{ mb: "12px", border: "1px" }}
                            autoComplete="tel-national username"
                        />
                        <small className="flex text-black w-full mb-[24px] hover:underline">
                            <Link href="/reset-password">Quên mật khẩu?</Link>
                        </small>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleLogin(email, password);
                            }}
                            disabled={apiCalling}
                            className={`flex w-full items-center justify-center`}
                        >
                            Đăng nhập
                        </Button>
                        <small className={`flex w-full mt-[12px] justify-center ${showError ? "text-red-500" : "text-transparent"}`}>
                            Email hoặc mật khẩu không đúng!
                        </small>

                        <div className="flex text-gray-500 w-full justify-center mt-[20px] text-[16px]">
                            Chưa có tài khoản?&nbsp;
                            <Link href="/register" className="text-blue-500 hover:underline">
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
