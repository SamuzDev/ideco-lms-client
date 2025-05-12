import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"

export const { useSession, signIn, signOut, signUp, getSession, resetPassword, forgetPassword, twoFactor, listAccounts } = createAuthClient({
    baseURL: `${import.meta.env.VITE_URL_SERVER as string}`,
    redirectTo: "/",
    plugins: [
        twoFactorClient()
    ]
})