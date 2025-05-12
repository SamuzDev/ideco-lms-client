import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"

export const { useSession, signIn, signOut, signUp, getSession, resetPassword, forgetPassword, twoFactor, listAccounts } = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL as string,
    redirectTo: "/",
    plugins: [
        twoFactorClient()
    ]
})