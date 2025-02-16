"use client";

import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({ user }: { user: User | null }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <div>
      {user ? (
        <button className="text-xs text-gray-400" onClick={handleSignOut}>
          Logout
        </button>
      ) : (
        <button className="text-xs text-gray-400" onClick={handleSignIn}>
          Login
        </button>
      )}
    </div>
  );
}
