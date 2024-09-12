"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRef } from "react";
import handleAddTweetServerAction from "./new-tweet-server";

export default function NewTweet({ user }: { user: User }) {
  const ref = useRef<HTMLFormElement>(null);
  const handleAddTweetClientAction = async (formData: FormData) => {
    const response = await handleAddTweetServerAction(formData);
    if (response) {
      // success
      ref.current?.reset();
    }
  };
  return (
    <form
      className="border border-gray-800 border-t-0"
      ref={ref}
      action={handleAddTweetClientAction}
    >
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            className="rounded-full"
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={40}
            height={40}
          />
        </div>
        <input
          name="title"
          type="text"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
          placeholder="What is happening?!"
        />
      </div>
    </form>
  );
}
