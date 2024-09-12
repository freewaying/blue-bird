import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/auth-button-server";
import Like from "./components/likes";
import NewTweet from "./components/new-tweet-client";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("tweets")
    .select("*, profiles(*), likes(*)");
  const tweets =
    data?.map((tweet) => {
      return {
        ...tweet,
        likes: tweet.likes?.length ?? 0,
        user_has_liked_tweet: tweet.likes.some(
          (like) => like.user_id === session.user.id
        ),
      };
    }) ?? [];
  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div key={tweet.id}>
          <p>
            {tweet.profiles?.email} {tweet.profiles?.username}
          </p>
          <p>{tweet.title}</p>
          <p>
            <Like tweet={tweet} />
          </p>
        </div>
      ))}
    </>
  );
}
