import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../pages/api/auth/[...nextauth]";
import { useSession, signIn, signOut } from "next-auth/react";
import TaskList from "../components/taskList";
import { Suspense } from "react";
import LogoutButton from "./logout";
import LoginButton from "./login";

export default async function Page() {
    const session = await unstable_getServerSession(AuthOptions);
    // const { data: session } = useSession();

    if (session) {
        return (
            <>
                <div>Signed in as {session!.user?.email}</div>
                <div>
                    <Suspense fallback={null}>
                        <TaskList />
                    </Suspense>
                </div>
                <LogoutButton />
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
