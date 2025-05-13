import { useState } from "react";
import { twoFactor } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    try {
      await twoFactor.verifyTotp({
        code,
        trustDevice: true,
      });
      navigate("/dashboard");
    } catch (error) {
      alert("Código inválido o expirado. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Verificación de Dos Factores</h2>
      <Input
        type="text"
        placeholder="Ingresa el código de 6 dígitos"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={handleVerify} disabled={loading} className="mt-4 w-full">
        {loading ? "Verificando..." : "Verificar"}
      </Button>
    </div>
  );
}
