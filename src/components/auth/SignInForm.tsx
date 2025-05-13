import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "./AuthLayout";
import { SocialLogin } from "./SocialLogin";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { signIn } from "@/lib/auth-client";

const formSchema = z.object({
    email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type FormData = z.infer<typeof formSchema>;

export const SignInForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        const { email, password } = data;

        if (!email || !password) {
            toast({
                title: "Campos requeridos",
                description: "Por favor complete todos los campos",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await signIn.email(
                {
                    email,
                    password,
                    callbackURL: "/dashboard",
                    rememberMe: true,
                },
                {
                    onRequest: () => {
                        console.log("Iniciando sesión...");
                    },
                    onSuccess: async (ctx) => {
                        if (ctx.data?.twoFactorRedirect) {
                            // Redirige al usuario a la página de verificación 2FA
                            window.location.href = "/2fa";
                            return;
                        }

                        toast({
                            title: "Sesión iniciada",
                            description: "Redirigiendo al dashboard...",
                        });

                        // Redirige al dashboard si no se requiere 2FA
                        window.location.href = "/dashboard";
                    },
                    onError: (ctx) => {
                        toast({
                            title: "Error de inicio de sesión",
                            description: ctx.error.message || "Credenciales incorrectas",
                            variant: "destructive",
                        });
                    },
                }
            );
        } catch (error) {
            toast({
                title: "Error de red",
                description: "No se pudo conectar al servidor.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const Footer = (
        <>
            <div className="text-sm text-center">
                <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
            <div className="text-sm text-center">
                ¿No tienes una cuenta?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                    Regístrate
                </Link>
            </div>
        </>
    );

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            description="Ingresa tus credenciales para acceder a tu cuenta"
            footer={Footer}
        >
            <div className="relative">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-slide-up relative">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="ejemplo@email.com"
                                            type="email"
                                            autoComplete="email"
                                            className="pl-10 bg-gray-900/40 border-gray-700 hover:border-blue-500/70 transition-all focus-visible:ring-1 focus-visible:ring-blue-500/80"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="••••••"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            className="pl-10 pr-10 bg-gray-900/40 border-gray-700 hover:border-blue-500/70 transition-all focus-visible:ring-1 focus-visible:ring-blue-500/80"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200 transition-colors"
                                            onClick={togglePasswordVisibility}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                                            ) : (
                                                <Eye className="h-4 w-4" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                Iniciar sesión <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        )}
                    </Button>
                </form>
            </Form>

            <SocialLogin />
        </AuthLayout>
    );
};
