"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface TidioIdentify {
  distinct_id?: string;
  email?: string;
  name?: string;
  phone?: string;
}

export const TidioUserInfo = () => {
  const session = useSession();

  useEffect(() => {
    const addTidioIdentityInfo = setInterval(() => {
      if (window) {
        if (session.status === "authenticated") {
          const userInfo: TidioIdentify = {
            email: session?.data?.user?.email ?? undefined,
            name: session?.data?.user?.name ?? undefined,
            distinct_id: session?.data?.user?.email ?? undefined,
          };

          (
            window.document as Document & { tidioIdentify: TidioIdentify }
          ).tidioIdentify = userInfo;
          clearInterval(addTidioIdentityInfo);
        }
      }
    }, 1000);
    return () => clearInterval(addTidioIdentityInfo);
  }, []);

  return null;
};
