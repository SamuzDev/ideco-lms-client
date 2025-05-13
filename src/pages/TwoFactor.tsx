import { useState, type SetStateAction } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Shield, Key, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { twoFactor } from "@/lib/auth-client";

export const TwoFactorForm = () => {
  const [code, setCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showResendOptions, setShowResendOptions] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "Por favor, ingresa el código de 6 dígitos generado por tu aplicación de autenticación.",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Verificar el código utilizando Better Auth
      await twoFactor.verifyTotp({
        code,
        trustDevice: true,
      });

      toast({
        title: "Autenticación exitosa",
        description: "Has sido verificado correctamente.",
      });

      // Redirigir al usuario al dashboard o página principal
      navigate("/dashboard");
    } catch (error: any) {
      // Mostrar mensaje de error si la verificación falla
      toast({
        variant: "destructive",
        title: "Verificación fallida",
        description: error?.message || "El código ingresado es incorrecto o ha expirado.",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResend = () => {
    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your device"
    });
    setShowResendOptions(false);
  };
  
  return (
    <AuthLayout 
      title="Two-Factor Authentication" 
      description="Enter the verification code sent to your device"
      footer={
        <div className="flex flex-col space-y-4 w-full">
          <div className="text-center text-sm text-gray-400">
            <button 
              onClick={() => setShowResendOptions(!showResendOptions)} 
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Didn't receive a code?
            </button>
            
            {showResendOptions && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <Button
                  variant="outline"
                  className="w-full transition-all hover:bg-indigo-900/30"
                  onClick={handleResend}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Resend code
                </Button>
                <Link to="/signin" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-transparent"
                  >
                    Back to login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-70 blur-lg"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm p-4 rounded-full">
              <Shield className="h-10 w-10 text-indigo-400" />
            </div>
          </div>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl w-full border border-gray-700/50 shadow-lg">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value: SetStateAction<string>) => setCode(value)}
                  containerClassName="flex items-center justify-center gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-lg bg-gray-700/80 border-gray-600" />
                  </InputOTPGroup>
                </InputOTP>
                
                <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center">
                  <Key className="h-3 w-3 mr-1" />
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 py-6"
              disabled={isVerifying || code.length !== 6}
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};