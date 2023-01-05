"use client";

import { Task, TaskPriority, TaskStatus } from "@prisma/client";

import dayjs from "dayjs";
import "dayjs/locale/ja";
import Link from "next/link";
dayjs.locale("ja");

import { useState, useTransition } from "react";
import { Fade, Modal } from "@mui/material";
import { deleteTask } from "../lib/db";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import superjson from "superjson";

type ExtendTask = Task & {
    priority: TaskPriority;
    status: TaskStatus;
};

function TaskItem({ task }: { task: ExtendTask }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        router.refresh();
    };

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);

    const { handleSubmit } = useForm();

    const onSubmit = async () => {
        setIsFetching(true);

        await fetch(`/api/task/${task.id}`, {
            method: "DELETE",
        });

        setIsFetching(false);

        startTransition(() => {
            // Refresh the current route and fetch new data from the server without
            // losing client-side browser or React state.
            handleClose();

            // router.refresh();
        });
    };

    return (
        <div>
            <div>{task.name}</div>
            <div>{task.priority.priority}</div>
            <div>{task.status.status}</div>
            <div>{task.body}</div>
            <div>{dayjs(task.expire_at).format()}</div>
            <div>
                <Link href={`task/${task.id}/edit`}>edit</Link>
                <button onClick={handleOpen}>remove</button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                >
                    <Fade in={open}>
                        <div className="bg-white">
                            <div id="transition-modal-title">
                                削除しますか？
                            </div>
                            <div id="transition-modal-description">
                                タスク「{task.name}
                                」を削除しようとしています。この操作は取り消せません。
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <button>CANCEL</button>
                                    <button type="submit">DELETE</button>
                                </form>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </div>
    );
}

export default TaskItem;
