/* eslint-disable react/require-default-props */
import loading from "./loading.module.css";

export default function Loading({ className }: { className?: string }) {
    return (
        <div className={`${loading.Loading} ${className}`} data-testid="loading-spinner">
            <div />
            <div />
            <div />
            <div />
        </div>
    );
}

export function FullPageLoading() {
    return (
        <div className="relative w-screen h-screen grid place-items-center">
            <Loading className="w-32 p-2" />
        </div>
    );
}
