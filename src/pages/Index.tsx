import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  const forms = [
    {
      title: "Sign In",
      desc: "Access your account with email or social providers",
      link: "/signin",
      delay: "0.1s",
    },
    {
      title: "Sign Up",
      desc: "Create a new account with robust validation",
      link: "/signup",
      delay: "0.2s",
    },
    {
      title: "Forgot Password",
      desc: "Reset your password via email link",
      link: "/forgot-password",
      delay: "0.3s",
    },
    {
      title: "Reset Password",
      desc: "Set a new password with secure requirements",
      link: "/reset-password",
      delay: "0.4s",
    },
  ];

  const features = [
    "Social login (GitHub, Google)",
    "Real-time form validation",
    "Smooth animations",
    "Password visibility toggle",
    "Password strength indicator",
    "Responsive design",
    "Success notifications",
    "Interactive feedback",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-6xl animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-900">
          Modern Authentication Forms
        </h1>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-10">
          Explore our collection of elegant, intuitive authentication forms with responsive design and real-time features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {forms.map((form) => (
            <Card
              key={form.title}
              className="p-6 shadow-sm border hover:shadow-lg transition-shadow transform hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: form.delay }}
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">{form.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{form.desc}</p>
              <Link to={form.link}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  View Form
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">✨ Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="h-5 w-5 text-indigo-500 mr-2 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
