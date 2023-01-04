import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTask } from "../../../lib/db";

import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../auth/[...nextauth]";
import { Session } from "next-auth";
import prisma from "../../../prisma/client";

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
                // idがsession userの管理下か
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
        default:
            res.status(400).end();
            break;
    }
}

export default handler;
