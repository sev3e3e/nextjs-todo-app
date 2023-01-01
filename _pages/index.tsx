import { GetServerSideProps } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

import { unstable_getServerSession } from "next-auth/next";

import { AuthOptions } from "./api/auth/[...nextauth]";

import prisma from "../prisma/client";
import { Session } from "next-auth";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session: Session | null = await unstable_getServerSession(
        context.req,
        context.res,
        AuthOptions
    );

    if (session) {
        const _data = await prisma.task.findMany({
            where: { userId: session.user?.id },
        });

        const data = superjson.stringify(_data);

        return { props: { data } };
    }

    return { props: {} };
};

export default function Index() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                Signed in as {session!.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}
