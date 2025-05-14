import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Key, User, Lock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { twoFactor } from "@/lib/auth-client";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Profile() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      setShowDisableDialog(true);
    } else {
      setShowEnableDialog(true);
    }
  };

  const onEnableSubmit = async ({ password }: PasswordFormValues) => {
    if (!password) return;
    setLoading(true);
    try {
      const { data } = await twoFactor.enable({ password });
      setQrCode(data?.totpURI ?? null);
      setBackupCodes(data?.backupCodes ?? null);
      setShowEnableDialog(false);
      setShowSetupDialog(true);
      passwordForm.reset();
      toast({ title: "2FA habilitado", description: "Escanea el QR y guarda los códigos de respaldo." });
    } catch (err: any) {
      toast({ title: "Error al habilitar 2FA", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onDisableSubmit = async ({ password }: PasswordFormValues) => {
    if (!password) return;
    setLoading(true);
    try {
      await twoFactor.disable({ password });
      setShowDisableDialog(false);
      setIs2FAEnabled(false);
      passwordForm.reset();
      toast({ title: "2FA deshabilitado", description: "La autenticación de dos factores está desactivada." });
    } catch (err: any) {
      toast({ title: "Error al deshabilitar 2FA", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const verifySetupCode = async () => {
    if (verificationCode.length !== 6) return;
    setVerifyingCode(true);
    try {
      await twoFactor.verifyTotp({ code: verificationCode });
      setIs2FAEnabled(true);
      setShowSetupDialog(false);
      setVerificationCode("");
      toast({ title: "2FA activado", description: "La autenticación de dos factores está activa." });
    } catch (err: any) {
      toast({ title: "Código inválido", description: err.message, variant: "destructive" });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleBackupCodeClick = () => {
    if (backupCodes) {
      const newBackupCodes = [...backupCodes];
      newBackupCodes.shift();
      setBackupCodes(newBackupCodes);
      toast({ title: "Código de respaldo usado", description: "Has usado un código de respaldo. Asegúrate de guardar uno nuevo." });
    }
  };

  const handleBackupCodeCopy = () => {
    if (backupCodes) {
      navigator.clipboard.writeText(backupCodes[0]);
      toast({ title: "Código de respaldo copiado", description: "El código de respaldo ha sido copiado al portapapeles." });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Account Settings</h1>
          
          {/* Profile Section */}
          <Card className="mb-8 backdrop-blur-lg bg-gray-800/60 border-gray-700/50 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-70 blur-lg"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm p-3 rounded-full">
                    <User className="h-8 w-8 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-300">Update your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormLabel className="text-gray-200">Name</FormLabel>
                  <Input 
                    placeholder="Your name" 
                    className="bg-gray-700/50 border-gray-600 text-white" 
                    defaultValue="John Doe"
                  />
                </div>
                <div className="grid gap-3">
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <Input 
                    placeholder="Your email" 
                    type="email"
                    className="bg-gray-700/50 border-gray-600 text-white" 
                    defaultValue="john.doe@example.com"
                    disabled
                  />
                  <p className="text-xs text-gray-400">Your email address is your identity on the platform and cannot be changed.</p>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
          
          {/* Security Section */}
          <Card className="backdrop-blur-lg bg-gray-800/60 border-gray-700/50 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-70 blur-lg"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm p-3 rounded-full">
                    <Shield className="h-8 w-8 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-300">Manage your account security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/40 border border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gray-800">
                    <Lock className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Password</h3>
                    <p className="text-sm text-gray-400">Change your password</p>
                  </div>
                </div>
                <Button variant="outline" className="backdrop-blur-sm bg-gray-900/40 text-indigo-300 hover:text-white hover:bg-indigo-900/50 border-gray-700">
                  Change
                </Button>
              </div>
              
              {/* 2FA Setting */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/40 border border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gray-800">
                    <Key className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Switch 
                  checked={is2FAEnabled} 
                  onCheckedChange={handleToggle2FA}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
              
              {/* Security Status */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-md border border-indigo-700/30">
                <div className="flex items-center gap-3">
                  {is2FAEnabled ? (
                    <>
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-green-400" />
                      </div>
                      <p className="text-green-400 font-medium">Your account has enhanced security with 2FA</p>
                    </>
                  ) : (
                    <>
                      <div className="bg-yellow-500/20 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-yellow-400" />
                      </div>
                      <p className="text-yellow-400 font-medium">Enable two-factor authentication for better security</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Dialog for enabling 2FA (Password confirmation) */}
      <Dialog open={showEnableDialog} onOpenChange={setShowEnableDialog}>
        <DialogContent className="backdrop-blur-lg bg-gray-800/80 border-gray-700/50 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Password</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please enter your password to enable two-factor authentication
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onEnableSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-gray-700/50 border-gray-600 text-white"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowEnableDialog(false)}
                  className="backdrop-blur-sm bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-900 border-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for disabling 2FA (Password confirmation) */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="backdrop-blur-lg bg-gray-800/80 border-gray-700/50 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Password</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please enter your password to disable two-factor authentication
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onDisableSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-gray-700/50 border-gray-600 text-white"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDisableDialog(false)}
                  className="backdrop-blur-sm bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-900 border-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="destructive"
                >
                  Confirm Disable
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for 2FA Setup */}
      <Dialog open={showSetupDialog} onOpenChange={(open) => !verifyingCode && setShowSetupDialog(open)}>
        <DialogContent className="backdrop-blur-lg bg-gray-800/80 border-gray-700/50 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription className="text-gray-300">
              Scan the QR code with your Google Authenticator app
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Mock QR Code (in a real app, this would be an actual QR code) */}
            <div className="flex justify-center">
              <div className="relative p-1 bg-white rounded-lg w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 rounded-lg"></div>
                <div className="grid grid-cols-4 grid-rows-4 gap-2 w-36 h-36">
                  {Array(16).fill(0).map((_, i) => (
                    <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Secret Key */}
            {/* <div className="space-y-2">
              <p className="text-sm text-gray-300">If you can't scan the QR code, enter this secret key manually:</p>
              <div className="flex items-center justify-center">
                <code className="bg-gray-900/80 px-4 py-2 rounded-md font-mono text-sm text-indigo-300">
                  {twoFactorSecret}
                </code>
              </div>
            </div> */}
            
            {/* Verification Code Input */}
            <div className="space-y-3">
              <FormLabel className="text-gray-200">Verification Code</FormLabel>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-11 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={1} className="w-11 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={2} className="w-11 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={3} className="w-11 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={4} className="w-11 h-14 text-lg bg-gray-700/80 border-gray-600" />
                    <InputOTPSlot index={5} className="w-11 h-14 text-lg bg-gray-700/80 border-gray-600" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <FormDescription className="text-center text-gray-400">
                Enter the 6-digit code from your authenticator app
              </FormDescription>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => !verifyingCode && setShowSetupDialog(false)}
              disabled={verifyingCode}
              className="backdrop-blur-sm bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-900 border-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={verifySetupCode}
              disabled={verificationCode.length !== 6 || verifyingCode}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            >
              {verifyingCode ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
