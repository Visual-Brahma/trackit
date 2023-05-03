import { fallbackTextEmail, htmlSignInEmail } from "@/components/email/auth/signin";
import { SendVerificationRequestParams } from "next-auth/providers";
import { createTransport } from "nodemailer";

export const customSendVerificationRequest=async ({ identifier, url, provider, theme }: SendVerificationRequestParams) => {
    const { host }=new URL(url)
    const transport=createTransport(provider.server)
    const result=await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Your Trackit Login Link`,
        text: fallbackTextEmail({ url, host, theme }),
        html: htmlSignInEmail({ url, host, theme }).html,
    })
    const failed=result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
}

export default customSendVerificationRequest;