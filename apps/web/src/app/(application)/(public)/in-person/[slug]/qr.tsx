"use client";
import { useQRCode } from "next-qrcode";

export default function InPersonEventQrCode({
  eventId,
  userId,
}: {
  eventId: number;
  userId: string;
}) {
  const { Image } = useQRCode();

  const qrData = {
    eventId: eventId,
    userId: userId,
  };
  return (
    <Image
      text={JSON.stringify(qrData)}
      logo={{
        src: "/logo.svg",
      }}
      options={{
        type: "image/jpeg",
        quality: 0.3,
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: 200,
      }}
    />
  );
}
