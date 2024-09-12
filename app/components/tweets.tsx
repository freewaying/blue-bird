"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
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
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-8 flex"
    >
      <div className="w-12 h-12">
        <Image
          className="rounded-full"
          src={tweet.author.avatar_url}
          alt="avatar"
          width={48}
          height={48}
        />
      </div>
      <div className="ml-4">
        <p className="ml-2">
          <span className="font-bold">{tweet.author.email}</span>
          <span className="text-sm ml-2">{tweet.author.username}</span>
        </p>
        <p className="ml-2">{tweet.title}</p>
        <p className="ml-2">
          <Like tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
        </p>
      </div>
    </div>
  ));
}
