"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function handleAddTweetServerAction(formData: FormData) {
  const title = String(formData.get("title"));
  const superbase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await superbase.auth.getUser();
  if (user) {
    await superbase.from("tweets").insert({ title, user_id: user.id });
    revalidatePath("/");
    return true;
  }
  return false;
}
