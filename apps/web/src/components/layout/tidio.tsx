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
    if (window) {
      const userInfo: TidioIdentify = {
        email: session?.data?.user?.email ?? undefined,
        name: session?.data?.user?.name ?? undefined,
        distinct_id: session?.data?.user?.email ?? undefined,
      };

      (
        window.document as Document & { tidioIdentify: TidioIdentify }
      ).tidioIdentify = userInfo;
    }
  }, []);

  return null;
};
