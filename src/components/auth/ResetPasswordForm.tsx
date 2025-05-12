import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "./AuthLayout";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/lib/auth-client";

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export const ResetPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const token = searchParams.get("token") || "demo-token";
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;
  const password = watch("password");

  const passwordRequirements = [
    { id: "length", label: "At least 8 characters", test: () => password?.length >= 8 },
    { id: "uppercase", label: "At least one uppercase letter", test: () => /[A-Z]/.test(password || "") },
    { id: "lowercase", label: "At least one lowercase letter", test: () => /[a-z]/.test(password || "") },
    { id: "number", label: "At least one number", test: () => /[0-9]/.test(password || "") },
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    console.log("Resetting password with:", { ...data, token });
    
    // Simulate delay
    await resetPassword({ newPassword: data.password, token }, {
      onSuccess: () => {
        toast({
          title: "Password reset successful!",
          description: "Your password has been updated.",
        });
      },
      onError: (ctx) => {
        toast({
          title: "Password reset failed!",
          description: ctx.error.message || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    })
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthLayout 
      title="Set new password"
      description="Enter and confirm your new password"
    >
      {isSubmitted ? (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Password reset complete</h3>
          <p className="text-sm text-gray-500">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <div className="mt-6">
            <Link to="/signin">
              <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-slide-up">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pr-10 transition-all focus-within:ring-2 focus-within:ring-blue-500"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
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
                  
                  {password && (
                    <div className="mt-2 space-y-1 text-xs">
                      {passwordRequirements.map((requirement) => (
                        <div 
                          key={requirement.id}
                          className={`flex items-center ${
                            requirement.test() ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {requirement.test() ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <span className="h-3 w-3 mr-1">•</span>
                          )}
                          <span>{requirement.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pr-10 transition-all focus-within:ring-2 focus-within:ring-blue-500"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                        onClick={toggleConfirmPasswordVisibility}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting password...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
};
