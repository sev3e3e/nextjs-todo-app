"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

function ClientSessionProvider(props: SessionProviderProps) {
    return <SessionProvider {...props} />;
}

export default ClientSessionProvider;
