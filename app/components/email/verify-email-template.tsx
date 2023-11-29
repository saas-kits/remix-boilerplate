import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  validationCode?: string;
}

export const VerificationEmailTemplate = ({
  validationCode = "tt226-5398x",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code for RemixKits</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Your verification code for RemixKits</Heading>
        <Text style={paragraph}>
          This link and code will only be valid for the next 10 minutes.
        </Text>
        <code style={code}>{validationCode}</code>
        <Hr style={hr} />
      </Container>
    </Body>
  </Html>
);

export default VerificationEmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};
