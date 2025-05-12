import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <img
          src={session.user.image ?? "https://i.pinimg.com/736x/41/f4/99/41f49941fed13bc2795c153a01cc11ab.jpg"}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-indigo-300"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {session.user.name}!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Estás conectado con éxito. Desde aquí puedes gestionar tu cuenta.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleGoToProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Ver perfil
          </Button>

          <Button
            onClick={handleSignOut}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
