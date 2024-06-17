import { useRef, useEffect } from "react";

export default function useHandleClickOutside<T extends HTMLElement>(
    callback: () => void,
    exceptionRefs: React.RefObject<T>[] = [],
) {
    const ref = useRef<T>(null) as unknown as React.RefObject<HTMLDivElement>;
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                // Check if the click is inside any of the exception refs
                const isInsideExceptionRef = exceptionRefs.some(
                    (exceptionRef) => exceptionRef.current?.contains(event.target as Node),
                );
                if (!isInsideExceptionRef) {
                    callback();
                }
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [ref, callback, exceptionRefs]);
    return ref;
}
