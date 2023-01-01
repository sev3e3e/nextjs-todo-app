import superjson from "superjson";
import prisma from "../prisma/client";
import { Session, unstable_getServerSession } from "next-auth";
import { AuthOptions } from "../pages/api/auth/[...nextauth]";

export default async function TaskList() {
    const session: Session | null = await unstable_getServerSession(
        AuthOptions
    );

    const data = await prisma.task.findMany({
        where: { userId: session?.user?.id },
    });

    // const data = superjson.stringify(_data);
    console.log(data);

    var list = [];
    for (var d in data) {
        list.push();
    }

    return <div className="text-4xl">woah</div>;
}
