import Toastify from "./toastify";
import "./toastify.css";

interface ToastProps {
    message: string | null;
    success?: boolean;
}

export default function ShowToast({ message, success }: ToastProps) {
    new Toastify({
        text: message,
        duration: 3000,
        newWindow: false,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: { background: success ? "#4ade80" : "#ffecec" },
    }).showToast();
}
