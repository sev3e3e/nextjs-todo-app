import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../auth/[...nextauth]";
import { Session } from "next-auth";
import prisma from "../../../prisma/client";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    if (method === "POST") {
        const session: Session | null = await unstable_getServerSession(
            req,
            res,
            AuthOptions
        );

        if (!session) {
            res.status(403).end();
            return;
        }

        const taskId = getRandomInt(1, 1000);
        const task = await prisma.task.create({
            data: {
                name: `生成されたテストタスク${taskId}`,
                body: `生成されたテストタスク${taskId}のbodyです。`,
                priority: {
                    connect: {
                        id: getRandomInt(1, 3),
                    },
                },
                status: {
                    connect: {
                        id: getRandomInt(1, 3),
                    },
                },
                user: {
                    connect: {
                        id: session.user?.id,
                    },
                },
                expire_at: new Date(),
            },
        });

        res.send(task);
    } else {
        res.status(400).end();
    }
}

export default handler;
