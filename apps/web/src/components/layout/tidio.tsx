"use client";

import { useEffect } from "react";

interface TidioIdentify {
  distinct_id?: string;
  email?: string;
  name?: string;
  phone?: string;
}

export const TidioUserInfo = (userInfo: TidioIdentify) => {
  useEffect(() => {
    if (window) {
      (
        window.document as Document & { tidioIdentify: TidioIdentify }
      ).tidioIdentify = userInfo;
    }
  }, []);

  return (
    <>
      {
        // empty fragment
      }
    </>
  );
};
