"use client";

import { useState, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import fetchAPI from "@/api/api-utils";
import { loginSuccess, logoutSuccess } from "../slice/auth-slice";
import { FullPageLoading } from "@/components/global/loading/loading";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    async function checkAuth() {
        try {
            const res = await fetchAPI("/user/profile");
            if (res.status === 200) {
                const data = await res.json();
                const pages = ["/login"];
                dispatch(loginSuccess({ email: data.email, role: data.role }));
                if (pages.includes(window.location.pathname)) {
                    window.location.replace("/");
                } else {
                    setLoading(false);
                }
            } else {
                dispatch(logoutSuccess());
                window.location.replace("/login");
            }
        } catch (error) {
            dispatch(logoutSuccess());
            window.location.replace("/login");
        }
    }

    useLayoutEffect(() => {
        checkAuth();
    }, []);

    if (loading) {
        return <FullPageLoading />;
    }

    return children;
}
