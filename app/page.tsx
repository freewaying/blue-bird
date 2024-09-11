import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/auth-button-server";
import NewTweet from "./components/new-tweet-client";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }
  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, profiles(*)");
  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      <pre>{JSON.stringify(tweets, null, 2)}</pre>
    </>
  );
}
