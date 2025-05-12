
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth-client";
import { Github } from "lucide-react";

export const SocialLogin = () => {
    const { toast } = useToast();

    // const handleSocialLogin = (provider: string) => {
    //     console.log(`Logging in with ${provider}...`);
    // };

    const handleGoogleLogin = async () => {
        try {
            await signIn.social({ provider: "google", callbackURL: "http://localhost:5173/dashboard" });
        } catch (error) {
            toast({
                title: "Error de inicio de sesión",
                description: "No se pudo iniciar sesión con Google",
                variant: "destructive",
            });
        }
    }

    const handleGithubLogin = async () => {
        try {
            await signIn.social({ provider: "github", callbackURL: "http://localhost:5173/dashboard" });
        } catch (error) {
            toast({
                title: "Error de inicio de sesión",
                description: "No se pudo iniciar sesión con Google",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="flex flex-col space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center">
                <div className="flex-1 border-t border-gray-600"></div>
                <div className="px-3 text-sm text-gray-400">or continue with</div>
                <div className="flex-1 border-t border-gray-600"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors text-gray-200"
                    onClick={() => handleGithubLogin()}
                >
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors text-gray-200"
                    onClick={() => handleGoogleLogin()}
                >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    Google
                </Button>
            </div>
        </div>
    );
};
