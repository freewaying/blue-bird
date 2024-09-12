"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic } from "react";
import Like from "./likes";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  // 订阅数据库实时更新通知
  const supabase = createClientComponentClient();
  const router = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel("tweets realtime change")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (state, newTweet) => {
    const newTweets = [...state];
    const index = newTweets.findIndex((v) => v.id === newTweet.id);
    newTweets[index] = newTweet;
    return newTweets;
  });
  return optimisticTweets.map((tweet) => (
    <div key={tweet.id}>
      <p>
        {tweet.author.email} {tweet.author.username}
      </p>
      <p>{tweet.title}</p>
      <p>
        <Like tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </p>
    </div>
  ));
}
