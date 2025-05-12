import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "./AuthLayout";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormData = z.infer<typeof formSchema>;

export const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    console.log("Sending password reset email to:", data.email);
    
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Reset link sent!",
      description: "Check your email for the password reset link.",
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const Footer = (
    <div className="text-sm text-center">
      Remember your password?{" "}
      <Link to="/signin" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
        Sign in
      </Link>
    </div>
  );

  return (
    <AuthLayout 
      title="Reset your password"
      description="Enter your email and we'll send you a link to reset your password"
      footer={Footer}
    >
      {isSubmitted ? (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
          <p className="text-sm text-gray-500">
            We sent a password reset link to <span className="font-medium">{form.getValues().email}</span>
          </p>
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Try different email
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-slide-up">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="example@email.com" 
                      type="email" 
                      autoComplete="email" 
                      className="transition-all focus-within:ring-2 focus-within:ring-blue-500" 
                      {...field} 
                    />
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
                  Sending...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
};
