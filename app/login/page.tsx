import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GithubButton from "../components/github-button";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }
  return (
    <div className="flex-1 flex items-center justify-center">
      <GithubButton />
    </div>
  );
}
