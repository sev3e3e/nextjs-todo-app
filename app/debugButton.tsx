"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function DebugButton() {
    const { handleSubmit } = useForm();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onSubmit = async () => {
        await fetch("/api/task", { method: "POST" });

        startTransition(() => {
            // Refresh the current route and fetch new data from the server without
            // losing client-side browser or React state.
            router.refresh();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <button type="submit">Add random Task</button>
        </form>
    );
}

export default DebugButton;
