"use client";

import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    router.replace("/manage-booking");
    return null;
}
