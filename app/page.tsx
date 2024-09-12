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
    .select("*, author: profiles(*), likes(user_id)");
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
    <>
      <AuthButtonServer />
      <NewTweet />
      <Tweets tweets={tweets} />
    </>
  );
}
