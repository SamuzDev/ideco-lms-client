
import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
}

export const AuthLayout = ({ children, title, description, footer }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-4 sm:p-6 md:p-8 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="mx-auto w-full max-w-md shadow-2xl animate-fade-in backdrop-blur-lg bg-gray-800/60 border-gray-700/50 z-10">
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute h-full w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
        </div>
        
        <CardHeader className="relative z-10 space-y-1">
          <CardTitle className="text-2xl font-semibold text-white">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-300">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {children}
        </CardContent>
        
        {footer && <CardFooter className="relative z-10 flex flex-col space-y-4">{footer}</CardFooter>}
      </Card>
    </div>
  );
};