import {
    Mjml,
    render,
    MjmlHead,
    MjmlStyle,
    MjmlTitle,
    MjmlAttributes,
    MjmlBody,
    MjmlSection,
    MjmlColumn,
    MjmlImage,
    MjmlText,
    MjmlButton,
    MjmlAll
} from 'mjml-react';
import { SignInEmailParams } from "@/types/email";

export const htmlSignInEmail=({ url }: SignInEmailParams) => {
    return render((
        <Mjml>
            <MjmlHead>
                <MjmlTitle>Login to Trackit</MjmlTitle>
                <MjmlAttributes>
                    <MjmlAll font-family="Helvetica Neue, Arial, sans-serif" />
                    <MjmlText font-size="16px" color="#ffffff" font-weight="500" />
                    <MjmlButton background-color="#6B13FA" color="white" font-weight="500" font-size="18px" padding="15px 40px" border-radius="50px" />
                </MjmlAttributes>
            </MjmlHead>
            <MjmlBody background-color="#F5F5F5">
                <MjmlSection background-color="#ffffff" padding={"15px"} padding-bottom="30px">
                    <MjmlColumn>
                        <MjmlImage src="https://trackit.visualbrahma.tech/logo.png" alt="Trackit Logo" align="center" width="80px" padding-top="30px" padding-bottom="20px" />
                        <MjmlText font-size="14px" padding-bottom="20px" font-weight="600">Welcome to Trackit</MjmlText>
                        <MjmlText font-size="14px" line-height="24px" padding-bottom="20px">Click the button below to login to your account on Trackit.</MjmlText>
                        <MjmlButton href={url}>Sign In</MjmlButton>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection background-color="#ffffff" padding={"15px"} padding-top="0">
                    <MjmlColumn width="100%">
                        <MjmlText font-size="14px" line-height="24px" padding-bottom="10px" padding-top="20px">If you did not request this email, you can safely ignore it. Your account is still secure.</MjmlText>
                        <MjmlText font-size="14px" line-height="24px" padding-bottom="20px">Thank you for choosing Trackit!</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlBody>
        </Mjml>
    ), { validationLevel: 'soft' });
}

export const fallbackTextEmail=({ url, host }: SignInEmailParams) => {
    return `Sign in to ${host}\n${url}\n\nIf you did not request this email you can safely ignore it.`
}

export default SignInEmailParams;