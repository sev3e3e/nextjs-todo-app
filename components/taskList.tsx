import prisma from "../prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import { AuthOptions } from "../pages/api/auth/[...nextauth]";

async function TaskList() {
    const session: Session | null = await unstable_getServerSession(
        AuthOptions
    );

    const data = await prisma.task.findMany({
        where: { userId: session?.user?.id },
    });

    // const data = superjson.stringify(_data);
    console.log(data);

    return (
        <div>
            {data.map((task) => {
                return (
                    <>
                        <div>{task.name}</div>
                    </>
                );
            })}
        </div>
    );
}

export default TaskList;
