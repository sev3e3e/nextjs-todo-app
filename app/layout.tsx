import { headers } from "next/headers";
import SessionProvider from "./SessionProvider";

import { Session } from "next-auth";

import "../styles/globals.css";

export async function getSession(cookie: string): Promise<Session | null> {
    const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/auth/session`,
        {
            headers: { cookie },
        }
    );

    if (!response?.ok) {
        return null;
    }

    const session = await response.json();
    return Object.keys(session).length > 0 ? session : null;
}

async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getSession(headers().get("cookie") ?? "");

    return (
        <html>
            <head />
            <body>
                <SessionProvider session={session}>{children}</SessionProvider>
            </body>
        </html>
    );
}

export default Layout;
