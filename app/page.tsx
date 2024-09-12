import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/auth-button-server";
import NewTweet from "./components/new-tweet-client";
import Tweets from "./components/tweets";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });
  const tweets =
    data?.map((tweet) => {
      return {
        ...tweet,
        author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
        likes: tweet.likes?.length ?? 0,
        user_has_liked_tweet: tweet.likes.some(
          (like) => like.user_id === user.id
        ),
      };
    }) ?? [];
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border border-gray-800 border-t-0">
        <h1 className="text-xl font-bold">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
