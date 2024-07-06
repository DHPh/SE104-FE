"use client";

import { useState, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import fetchAPI from "@/api/api-utils";
import { loginSuccess, logoutSuccess } from "../slice/auth-slice";
import { FullPageLoading } from "@/components/global/loading/loading";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const pages = ["/login"];

    async function checkAuth() {
        try {
            const res = await fetchAPI("/user/profile");
            if (res.status === 200) {
                const data = await res.json();
                dispatch(loginSuccess({ email: data.data.email, role: data.data.role }));
                if (pages.includes(window.location.pathname)) {
                    window.location.replace("/");
                } else {
                    setLoading(false);
                }
            } else {
                dispatch(logoutSuccess());
                if (!pages.includes(window.location.pathname)) {
                    window.location.replace("/login");
                } else {
                    setLoading(false);
                }
            }
        } catch (error) {
            dispatch(logoutSuccess());
            if (!pages.includes(window.location.pathname)) {
                window.location.replace("/login");
            } else {
                setLoading(false);
            }
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
