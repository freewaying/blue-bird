"use client";

import { useOptimistic } from "react";
import Like from "./likes";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
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
