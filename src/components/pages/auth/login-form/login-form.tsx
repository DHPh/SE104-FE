"use client";

import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { loginSuccess } from "@/redux/slice/auth-slice";
import PostLogin from "@/api/auth/post-login";
import customCss from "./login.module.css";

export default function LoginForm() {
    const dispatch = useDispatch();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [emailError, setEmailError] = React.useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [passwordError, setPasswordError] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [apiCalling, setApiCalling] = React.useState(false);

    async function handleLogin(InputEmail: string, InputPassword: string) {
        setApiCalling(true);
        setShowError(false);
        try {
            const response = await PostLogin(InputEmail, InputPassword);
            if (response) {
                dispatch(loginSuccess({ email: response.email, role: "" }));
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
            <div className={`${customCss.LoginBox}`}>
                <div className={`${customCss.LoginForm}`}>
                    <h1 className="flex w-full font-black text-[28px] text-black mb-[32px]">
                        Đăng nhập
                    </h1>

                    <TextField
                        label="Email"
                        // InputLabelProps={{ shrink: true }}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${showError ? "border-red-500 border-solid rounded-md" : ""}`}
                        required
                        sx={{ mb: "24px", border: "1px" }}
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
                        // InputLabelProps={{ shrink: true }}
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
                    <small
                        className={`flex w-full mb-[12px] ${showError ? "text-red-500" : "hidden"}`}
                    >
                        Email hoặc mật khẩu không đúng!
                    </small>
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
                        className="flex w-full items-center justify-center h-[42px]"
                    >
                        Đăng nhập
                    </Button>

                    <div className="flex text-gray-500 w-full justify-center mt-[20px] text-[16px]">
                        Chưa có tài khoản?&nbsp;
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
