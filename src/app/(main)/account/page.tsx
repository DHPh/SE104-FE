"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { ScreenContent } from "@/components/global/screen/screen";
import fetchAPI from "@/api/api-utils";
import { setError } from "@/redux/slice/error-slice";

export default function Page() {
    const dispatch = useDispatch();
    const [password, setPassword] = useState<{
        old_password: string;
        new_password: string;
        confirm_password: string;
    }>({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleChangePassword = async () => {
        if (password.new_password !== password.confirm_password) {
            dispatch(setError("Mật khẩu mới không khớp"));
            return;
        }

        try {
            const res = await fetchAPI("/user/change-password", {
                method: "PUT",
                body: {
                    old_password: password.old_password,
                    new_password: password.new_password,
                },
            });
            if (res.status === 200) {
                alert("Đổi mật khẩu thành công");
                window.location.reload();
            } else {
                const data = await res.json();
                dispatch(setError(data.message_vi));
            }
        } catch (error) {
            dispatch(setError(error as string));
            console.error(error);
        }
    };

    return (
        <ScreenContent
            color="warning"
            buttonText="ĐĂNG XUẤT"
            buttonAction={async () => {
                try {
                    const res = await fetchAPI("/user/logout");
                    if (res.status === 200) {
                        window.location.href = "/login";
                    }
                } catch (error) {
                    console.error(error);
                }
            }}
        >
            <div className="flex flex-col w-full items-center">
                <div className="flex flex-col w-[300px] flex-shrink-0 items-center gap-4">
                    <span className="text-2xl font-bold">Đổi mật khẩu</span>
                    <TextField
                        type="password"
                        label="Mật khẩu cũ"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                            setPassword({ ...password, old_password: e.target.value });
                        }}
                    />
                    <TextField
                        type="password"
                        label="Mật khẩu mới"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                            setPassword({ ...password, new_password: e.target.value });
                        }}
                    />
                    <TextField
                        type="password"
                        label="Nhập lại mật khẩu mới"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                            setPassword({ ...password, confirm_password: e.target.value });
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleChangePassword();
                        }}
                    >
                        ĐỔI MẬT KHẨU
                    </Button>
                </div>
            </div>
        </ScreenContent>
    );
}
