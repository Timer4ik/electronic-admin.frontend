
import { ReactNode } from "react"

import { Header, Aside, Footer } from "@/components/layout"

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <main className="main-login">
            <div className="login">
                {children}
            </div>
        </main>
    )
}

