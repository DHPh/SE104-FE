"use client";

import { useEffect as useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import Screen from "@/components/global/screen/screen";
import GetShiftList from "@/api/main/get-shift-list";
import GetRoomTypeList from "@/api/main/get-room-type-list";
import GetRoomList from "@/api/main/get-room-list";
import GetServiceList from "@/api/main/get-service-list";
import GetFoodList from "@/api/main/get-food-list";
import GetUserList from "@/api/main/get-user-list";

export default function Page({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        GetShiftList({ dispatch });
        GetRoomTypeList({ dispatch });
        GetRoomList({ dispatch });
        GetFoodList({ dispatch });
        GetServiceList({ dispatch });
        GetUserList(dispatch);
    }, []);
    return <Screen>{children}</Screen>;
}
