"use client";

// import React, { useLayoutEffect, useRef } from "react";
import { useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { clearError } from "@/redux/slice/error-slice";
// import { XIcon } from "@/components/svg/svg";
// import error from "./error.module.css";
import ShowToast from "../toast/toast";

export default function ErrorPopup() {
    const dispatch = useDispatch();

    const message = useSelector((state: RootState) => state.error.errorMessages);
    const isShow = useSelector((state: RootState) => state.error.showError);
    const checkpoint = useSelector((state: RootState) => state.error.checkpoint);
    const successMessage = useSelector((state: RootState) => state.error.successMessage);
    const showSuccess = useSelector((state: RootState) => state.error.showSuccess);

    const handleClose = () => {
        dispatch(clearError());
    };

    // const timeoutId = useRef<NodeJS.Timeout | null>(null);

    useLayoutEffect(() => {
        if (isShow) {
            // if (timeoutId.current) {
            //     clearTimeout(timeoutId.current);
            // }

            // timeoutId.current = setTimeout(() => {
            //     handleClose();
            // }, 3000);

            ShowToast({ message });
        }

        // return () => {
        //     if (timeoutId.current) {
        //         clearTimeout(timeoutId.current);
        //     }
        // };
    }, [isShow, handleClose, checkpoint]);

    useLayoutEffect(() => {
        if (showSuccess) {
            ShowToast({ message: successMessage, success: true });
        }
    }, [showSuccess, successMessage]);

    // return (
    //     <div
    //         className={`${error.ErrorPopUp} ${
    //             isShow ? "flex" : "hidden"
    //         } flex flex-row items-center justify-between max-h-fit py-[0.875em] px-[1.75em] gap-x-[1.75em]`}
    //     >
    //         <p className={`${error.Message} text-[1.2em] font-[600]`}>{message}</p>
    //         <button type="button" className="w-fit h-fit" onClick={handleClose}>
    //             <XIcon className="w-[1.2em] aspect-square" strokeColor="#F87171" />
    //         </button>
    //     </div>
    // );
    return null;
}
