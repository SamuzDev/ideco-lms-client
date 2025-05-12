import { useSession, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

function Home() {
  const { data: session } = useSession();

  return (
    <div className="p-5 flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {!session && (
          <Button onClick={() => signIn.social({ provider: "github", callbackURL: "http://localhost:5173/dashboard" })}>
            Sign in with Github
          </Button>
        )}
      </div>
      {session && <p>Client Signed in as {session.user.name}</p>}
    </div>
  );
}

export default Home;
