import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components"

interface ResetpasswordEmailProps {
  resetLink?: string
}

// TODO: make ui consistent with verify email
export const ResetPasswordEmailTemplate = ({
  resetLink = "#",
}: ResetpasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code for RemixKits</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Your verification code for RemixKits</Heading>
        <Text style={paragraph}>
          This link will only be valid for the next 20 minutes.
        </Text>
        <Link style={link} href={resetLink}>
          👉 Click here to reset password in 👈
        </Link>
        <Hr style={hr} />
      </Container>
    </Body>
    <Preview>Log in with this magic link.</Preview>
  </Html>
)

export default ResetPasswordEmailTemplate

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
}

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
}

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
}
