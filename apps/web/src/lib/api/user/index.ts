"use server";
import { dbClient } from "@/lib/db/db_client";

export const setNewsletterPreference = async (
  isSubscribed: boolean,
  email: string,
) => {
  try {
    dbClient
      .updateTable("User")
      .set({
        newsletter: isSubscribed,
      })
      .where("email", "=", email)
      .execute();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const fetchUserProfile = async (email: string) => {
  try {
    const response = dbClient
      .selectFrom("User")
      .select(["email", "name", "newsletter", "image"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (response) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const setUserName = async (name: string, email: string) => {
  try {
    dbClient
      .updateTable("User")
      .set({
        name,
      })
      .where("email", "=", email)
      .execute();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
