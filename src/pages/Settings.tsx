import { useSession } from "@/lib/auth-client";

function Settings() {
  const { data: session } = useSession();

  return (
    <div className="p-5 flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {session && <p>Welcome to dashboard {session.user.name}!</p>}
      </div>
    </div>
  );
}

export default Settings;
