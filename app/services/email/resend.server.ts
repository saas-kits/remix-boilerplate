import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (
    to: string,
    subject: string,
    react: JSX.Element
  ) => {
    const receipt = await resend.emails.send({
      from: process.env.FROM_EMAIL || "",
      to,
      subject,
      react,
    });
  
    return receipt;
  };
