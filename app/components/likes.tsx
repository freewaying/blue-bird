"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Like({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (action: TweetWithAuthor) => void;
}) {
  const route = useRouter();
  const handleLikes = async () => {
    const superbase = createClientComponentClient<Database>();
    const {
      data: { user },
    } = await superbase.auth.getUser();
    if (!user) {
      return;
    }
    if (tweet.user_has_liked_tweet) {
      // remove like
      addOptimisticTweet({
        ...tweet,
        likes: tweet.likes - 1,
        user_has_liked_tweet: !tweet.user_has_liked_tweet,
      });
      await superbase
        .from("likes")
        .delete()
        .match({ tweet_id: tweet.id, user_id: user.id });
    } else {
      // add like
      addOptimisticTweet({
        ...tweet,
        likes: tweet.likes + 1,
        user_has_liked_tweet: !tweet.user_has_liked_tweet,
      });
      await superbase
        .from("likes")
        .insert({ tweet_id: tweet.id, user_id: user.id });
    }
    route.refresh();
  };
  return <button onClick={handleLikes}>{tweet.likes} Likes</button>;
}
