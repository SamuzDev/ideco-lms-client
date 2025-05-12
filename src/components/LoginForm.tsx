import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { signIn } from '@/lib/auth-client';
import { Link } from 'react-router-dom';
import { RxGithubLogo } from 'react-icons/rx';

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Campos requeridos",
                description: "Por favor complete todos los campos",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
                rememberMe: true,
            }, {
                onRequest: () => {
                    console.log("Iniciando sesión...");
                },
                onSuccess: () => {
                    toast({
                        title: "Sesión iniciada",
                        description: "Redirigiendo al dashboard...",
                    });
                },
                onError: (ctx) => {
                    toast({
                        title: "Error de inicio de sesión",
                        description: ctx.error.message || "Credenciales incorrectas",
                        variant: "destructive",
                    });
                }
            });

        } catch (error) {
            toast({
                title: "Error de red",
                description: "No se pudo conectar al servidor.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        setIsLoading(true);

        try {
            await signIn.social({ provider: "google", callbackURL: "/dashboard" });
        } catch (error) {
            toast({
                title: "Error de inicio de sesión",
                description: "No se pudo iniciar sesión con Google",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleGithubLogin = async () => {
        setIsLoading(true);

        try {
            // Simulate GitHub authentication
            // In a real app, you would 
            // 
            // redirect to GitHub OAuth
            //   await new Promise(resolve => setTimeout(resolve, 1000));
            await signIn.social({ provider: "github", callbackURL: "/dashboard" });

            //   toast({
            //     title: "Autenticación con GitHub",
            //     description: "Redirigiendo a GitHub...",
            //   });

            // Here you would typically redirect to GitHub for OAuth
            console.log("Redirecting to GitHub auth");
        } catch (error) {
            toast({
                title: "Error de autenticación",
                description: "No se pudo conectar con GitHub",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">
                    Ingrese sus credenciales para acceder a la plataforma
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Correo Electrónico
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="bg-background"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-background pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LogIn className="h-4 w-4" />
                                <span>Iniciar Sesión</span>
                            </div>
                        )}
                    </Button>

                    <div className="flex items-center my-4">
                        <Separator className="flex-1" />
                        <span className="px-3 text-sm text-muted-foreground">O</span>
                        <Separator className="flex-1" />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                    >
                        <RxGithubLogo className="h-4 w-4 mr-2" />
                        Continuar con GitHub
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                
                        Continuar con Google
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
                <div className="text-sm text-muted-foreground">
                    <Link to="/forgot-password" className="underline underline-offset-4 hover:text-primary">
                        Forgot Password?
                    </Link>
                </div>
                <div className="text-sm">
                    ¿No tiene una cuenta?{" "}
                    <Link to="/register" className="text-primary hover:underline underline-offset-4">
                        Registrarse
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};

export default LoginForm;