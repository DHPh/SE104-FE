/* eslint-disable react/jsx-key */

"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AirplayIcon from "@mui/icons-material/Airplay";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import DiningIcon from "@mui/icons-material/Dining";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ErrorPopup from "../error-popup/error-popup";

interface ScreenProps {
    children: React.ReactNode;
}

export default function Screen({ children }: ScreenProps) {
    const router = useRouter();
    const url = usePathname();
    const [currentPage, setCurrentPage] = React.useState(url);

    const pages = [
        "QUẢN LÍ ĐẶT TIỆC",
        "QUẢN LÍ SẢNH",
        "QUẢN LÍ DỊCH VỤ",
        "QUẢN LÍ THỰC ĐƠN",
        "THÔNG TIN SẢNH",
        "BÁO CÁO DOANH SỐ",
        "QUẢN LÍ NGƯỜI DÙNG",
    ];
    const urls = [
        "/manage-booking",
        "/manage-hall",
        "/manage-service",
        "/manage-menu",
        "/hall-info",
        "/revenue-report",
        "/manage-user",
    ];
    const icons = [
        <DateRangeIcon />,
        <AirplayIcon />,
        <AutoStoriesIcon />,
        <DiningIcon />,
        <AllInboxIcon />,
        <AttachMoneyIcon />,
        <ManageAccountsIcon />,
    ];

    const DrawerList = (
        <Box sx={{ width: 320 }} role="presentation">
            <span
                style={{
                    display: "flex",
                    padding: "0px 16px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    alignSelf: "stretch",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "48px",
                    letterSpacing: "0.1px",
                    color: "var(--text-secondary, rgba(0, 0, 0, 0.60))",
                }}
            >
                QUẢN LÍ TIỆC CƯỚI
            </span>
            <List disablePadding>
                {pages.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setCurrentPage(urls[index]);
                                router.push(urls[index]);
                            }}
                            className={`${currentPage === urls[index] && "!text-[#1570EF]"}`}
                        >
                            <ListItemIcon
                                style={{
                                    color: currentPage === urls[index] ? "#1570EF" : "inherit",
                                }}
                            >
                                {icons[index]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List disablePadding>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setCurrentPage("/account");
                            router.push("/account");
                        }}
                        className={`${currentPage === "/account" && "!text-[#1570EF]"}`}
                    >
                        <ListItemIcon
                            style={{
                                color: currentPage === "/account" ? "#1570EF" : "inherit",
                            }}
                        >
                            <SettingsApplicationsIcon />
                        </ListItemIcon>
                        <ListItemText primary="QUẢN LÍ TÀI KHOẢN" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div className="flex h-screen ">
            <ErrorPopup />
            <div>
                <div
                    style={{
                        width: "fit-content",
                        height: "100vh",
                        position: "relative",
                        boxShadow:
                            "0px 6px 30px 5px rgba(0, 0, 0, 0.12), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 8px 10px -5px rgba(0, 0, 0, 0.20)",
                    }}
                >
                    {DrawerList}
                </div>
            </div>
            <div className="relative w-full h-screen px-[48px] py-[35px] overflow-scroll">
                <div
                    style={{
                        color: "#000",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 900,
                        lineHeight: "normal",
                        marginBottom: "50px",
                    }}
                >
                    {pages[urls.indexOf(currentPage)] || "QUẢN LÍ TÀI KHOẢN"}
                </div>
                {children}
            </div>
        </div>
    );
}

interface ScreenContentProps {
    children: React.ReactNode;
    buttonAction?: () => void;
    buttonText?: string;
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
    useButton?: boolean;
}

export function ScreenContent({
    children,
    buttonAction,
    buttonText,
    color,
    useButton = true,
}: ScreenContentProps) {
    return (
        <>
            {useButton && (
                <Button
                    style={{ position: "absolute", right: 48, top: 25 }}
                    size="large"
                    variant="contained"
                    color={color || "primary"}
                    onClick={buttonAction}
                >
                    {buttonText || "Button"}
                </Button>
            )}
            {children}
        </>
    );
}
