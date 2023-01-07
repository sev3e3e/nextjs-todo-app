import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../pages/api/auth/[...nextauth]";
import LogoutButton from "./logout";
import LoginButton from "./login";
import { Session } from "next-auth";
import TaskItem from "../components/taskitem";
import prisma from "../prisma/client";
import DebugButton from "./debugButton";
import superjson from "superjson";

async function Page() {
    const session: Session | null = await unstable_getServerSession(
        AuthOptions
    );
    // const { data: session } = useSession();

    if (session) {
        const tasks = await prisma?.task.findMany({
            where: { userId: session!.user?.id },
            include: {
                priority: true,
                status: true,
                tags: true,
            },
        });

        return (
            <>
                <div>Signed in as {session!.user?.email}</div>
                <div></div>
                <LogoutButton />

                <DebugButton />

                <div className="py-10">
                    <div className="flex flex-col gap-3">
                        {tasks?.map((task) => {
                            return (
                                <div key={`taskitem-${task.id}`}>
                                    <TaskItem task={task} data-superjson />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <LoginButton />
        </>
    );
}

export default Page;
