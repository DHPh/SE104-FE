"use client";

import { useEffect as useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import Screen from "@/components/global/screen/screen";
import GetShiftList from "@/api/main/get-shift-list";
import GetRoomTypeList from "@/api/main/get-room-type-list";
import GetRoomList from "@/api/main/get-room-list";

export default function Page({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        GetShiftList({ dispatch });
        GetRoomTypeList({ dispatch });
        GetRoomList({ dispatch });
    }, []);
    return <Screen>{children}</Screen>;
}
