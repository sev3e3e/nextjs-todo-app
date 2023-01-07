import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTask } from "../../../lib/db";

import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../auth/[...nextauth]";
import { Session } from "next-auth";
import prisma from "../../../prisma/client";
import { Task, TaskPriority, TaskStatus } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja";

export type formInputs = {
    id: number;
    // htmlのselectのvalueオプションが文字列のみのため
    priority: string;
    status: string;

    body: string;
    date: string;
};

function isValidNumber(str: string): boolean {
    return !isNaN(Number(str));
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    const session: Session | null = await unstable_getServerSession(
        req,
        res,
        AuthOptions
    );

    switch (method) {
        case "DELETE":
            if (!id || Array.isArray(id) || !session) {
                res.status(400).end();
                break;
            }

            if (isValidNumber(id)) {
                const parsedId = Number.parseInt(id);
                const isExistTasks = !!prisma.user.findFirst({
                    where: {
                        tasks: {
                            every: {
                                id: parsedId,
                            },
                        },
                    },
                });
                if (!isExistTasks) {
                    res.status(403).end();
                }
                await deleteTask(parsedId);
                res.status(200).end();
            }

            break;

        case "PATCH":
            const task: formInputs = JSON.parse(req.body);
            console.log(task);

            const prismaResponse = await prisma.task.update({
                where: {
                    id: task.id,
                },
                data: {
                    body: task.body,

                    status: {
                        connect: {
                            id: parseInt(task.status),
                        },
                    },
                    priority: {
                        connect: {
                            id: parseInt(task.priority),
                        },
                    },
                    expire_at: dayjs(task.date).toDate(),
                },
                include: {
                    status: true,
                    priority: true,
                },
            });
            res.json(prismaResponse);
            break;
        default:
            res.status(400).end();
            break;
    }
}

export default handler;
