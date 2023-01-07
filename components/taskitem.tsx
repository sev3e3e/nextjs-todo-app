"use client";

import { Task, TaskPriority, TaskStatus } from "@prisma/client";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";
import Link from "next/link";

dayjs.locale("ja");
dayjs.extend(utc);
dayjs.extend(timezone);

import { SyntheticEvent, useState, useTransition } from "react";
import { Fade, Modal } from "@mui/material";
import { deleteTask } from "../lib/db";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import superjson from "superjson";

type ExtendTask = Task & {
    priority: TaskPriority;
    status: TaskStatus;
};

export type formInputs = {
    id: number;
    priority: number;
    status: number;
    body: string;
    date: string;
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

    const [isEditDisabled, setIsEditDisabled] = useState(true);

    const { register, handleSubmit } = useForm<formInputs>();

    const onEdit = () => {
        setIsEditDisabled(!isEditDisabled);
    };

    const onDelete = async () => {
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

    const onSubmit = async (data: any) => {
        const task: ExtendTask = data;
        await fetch(`/api/task/${task.id}`, {
            method: "PATCH",
            body: JSON.stringify(task),
        });

        startTransition(() => {
            // Refresh the current route and fetch new data from the server without
            // losing client-side browser or React state.

            router.refresh();
        });
    };

    return (
        <form>
            <input
                type="hidden"
                {...register("id", {
                    value: task.id,
                })}
            />
            <div>{task.name}</div>
            <div>
                <select
                    disabled={isEditDisabled}
                    {...register("priority", {
                        value: task.priority.id,
                    })}
                >
                    <option value={1}>High</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Normal</option>
                    <option value={4}>Low</option>
                </select>
            </div>
            <div>
                <select
                    disabled={isEditDisabled}
                    {...register("status", {
                        value: task.status.id,
                    })}
                >
                    <option value={1}>Not started</option>
                    <option value={2}>In progress</option>
                    <option value={3}>Completed</option>
                </select>
            </div>
            <div>
                <textarea
                    disabled={isEditDisabled}
                    {...register("body", {
                        value: task.body || "",
                    })}
                />
            </div>
            <div>
                <input
                    type="datetime-local"
                    {...register("date", {
                        value: dayjs(task.expire_at)
                            .tz("Asia/Tokyo")
                            .format("YYYY-MM-DDTHH:mm"),
                    })}
                    disabled={isEditDisabled}
                />
            </div>
            <div>
                <div>
                    <button
                        onClick={() => {
                            setIsEditDisabled(!isEditDisabled);
                        }}
                        disabled={!isEditDisabled}
                    >
                        edit
                    </button>
                    <button type="button" onClick={handleOpen}>
                        remove
                    </button>
                </div>
                <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isEditDisabled}
                    hidden={isEditDisabled}
                >
                    {"適用"}
                </button>
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
                                <form onSubmit={handleSubmit(onDelete)}>
                                    <button>CANCEL</button>
                                    <button type="submit">DELETE</button>
                                </form>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </form>
    );
}

export default TaskItem;
