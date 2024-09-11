"use client";

import { useRef } from "react";
import handleAddTweetServerAction from "./new-tweet-server";

export default function NewTweet() {
  const ref = useRef<HTMLFormElement>(null);
  const handleAddTweetClientAction = async (formData: FormData) => {
    const response = await handleAddTweetServerAction(formData);
    if (response) {
      // success
      ref.current?.reset();
    }
  };
  return (
    <form ref={ref} action={handleAddTweetClientAction}>
      <input name="title" type="text" className="bg-inherit border" />
    </form>
  );
}
