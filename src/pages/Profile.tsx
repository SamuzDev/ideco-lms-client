import { useEffect, useState } from "react";
import { listAccounts, useSession, twoFactor } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";

export default function Profile() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [password, setPassword] = useState("");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasSocialAccount, setHasSocialAccount] = useState(false);

    useEffect(() => {
        const checkSocialAccounts = async () => {
            if (session) {
                try {
                    const result = await listAccounts();
                    if (result.data) {
                        const socialProviders = ["google", "github", "facebook", "twitter"];
                        const hasSocial = result.data.some((account) =>
                            socialProviders.includes(account.provider)
                        );
                        setHasSocialAccount(hasSocial);
                    }
                } catch (error) {
                    console.error("Error al obtener las cuentas del usuario:", error);
                }
            }
        };

        checkSocialAccounts();
    }, [session]);

    const handleEnable2FA = async () => {
        if (!password) {
            toast({
                title: "Contraseña requerida",
                description: "Ingresa tu contraseña",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const { data } = await twoFactor.enable({ password });
            setQrCode(data?.totpURI ?? null);
            setBackupCodes(data?.backupCodes ?? null);
            toast({
                title: "2FA habilitado",
                description: "Escanea el QR y guarda los códigos de respaldo.",
            });
        } catch (err: any) {
            toast({
                title: "Error al habilitar 2FA",
                description: err.message || "Inténtalo nuevamente.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return <div className="p-6 text-center">Cargando perfil...</div>;
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <img
                    src={
                        session.user.image ??
                        "https://i.pinimg.com/736x/41/f4/99/41f49941fed13bc2795c153a01cc11ab.jpg"
                    }
                    alt="Imagen de perfil"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div>
                    <h2 className="text-lg font-semibold">{session.user.name}</h2>
                    <p className="text-sm text-gray-600">{session.user.email}</p>
                </div>
            </div>

            {!hasSocialAccount && (
                <div className="border-t pt-4 space-y-3">
                    <h3 className="text-black text-md font-medium">
                        Activar verificación en dos pasos (2FA)
                    </h3>

                    <Input
                        type="password"
                        placeholder="Ingresa tu contraseña actual"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        onClick={handleEnable2FA}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        {loading ? "Habilitando..." : "Habilitar 2FA"}
                    </Button>

                    {qrCode && (
                        <div className="mt-4 text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Escanea este QR con Google Authenticator:
                            </p>
                            <div className="inline-block bg-white p-3 shadow-md rounded-lg">
                                <QRCode value={qrCode} />
                            </div>
                        </div>
                    )}

                    {backupCodes && (
                        <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2">Códigos de respaldo:</h4>
                            <ul className="text-xs text-gray-700 grid grid-cols-2 gap-1 bg-gray-50 p-2 rounded">
                                {backupCodes.map((code, index) => (
                                    <li key={index} className="font-mono">
                                        {code}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">
                                Guárdalos en un lugar seguro. Cada uno solo puede usarse una
                                vez.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
