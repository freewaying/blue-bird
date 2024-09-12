import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonClient from "./auth-button-client";

export const dynamic = "force-dynamic";

export default async function AuthButtonServer() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <AuthButtonClient user={user} />;
}
