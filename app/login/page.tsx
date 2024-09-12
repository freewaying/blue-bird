import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonClient from "../components/auth-button-client";

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }
  return <AuthButtonClient user={user} />;
}
