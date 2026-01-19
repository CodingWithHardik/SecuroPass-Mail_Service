import { Row, Html, Head, Tailwind, Img, Container, Column, Text, Button } from "@react-email/components";

export default function template({ otp, link }: { otp: number; link: string }) {
    const otpString = otp.toString().split("");
    return (
        <Html>
            <Head>
                <title>Your One-Time Password (OTP)</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            </Head>
            <Tailwind>
                <Container className="max-w-full mt-8">
                    <Container className="text-center">
                        <Img
                            src="https://cdn.dpskmun.com/panelixor/black_no_bg.png"
                            width="64"
                            height="64"
                            alt="Panelixor Logo"
                            className="mx-auto"
                        />
                    </Container>
                    <Container className="bg-white text-black font-sans text-center mt-4">
                        <h1 className="text-4xl text-center">OTP Verification</h1>
                        <p className="font-family: Arial, sans-serif; text-base text-gray-500">Thank you for choosing SecuroPass. Use the following OTP to complete the procedure to verify your email address. OTP is Valid for <span className="font-bold">5 minutes</span>. Do not share this code with others, including SecuroPass employees.</p>
                        <Text className="font-bold text-2xl mt-8">
                            <span className="bg-gray-100 px-4 py-2 rounded-md">{otpString[0]}</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-md ml-4">{otpString[1]}</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-md ml-4">{otpString[2]}</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-md ml-8">{otpString[3]}</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-md ml-4">{otpString[4]}</span>
                            <span className="bg-gray-100 px-4 py-2 rounded-md ml-4">{otpString[5]}</span>
                        </Text>
                        <Button
                            className="rounded-full py-4 px-8 text-center text-gray-900 mt-8 font-bold bg-black text-white"
                            href={link}
                        >
                            Verify
                        </Button>
                        <Text className="font-family: Arial, sans-serif; mt-24 font-bold text-left text-2xl">
                            Do you have any questions or trouble registering?
                        </Text>
                        <Text className="font-family: Arial, sans-serif; text-gray-500 text-left text-base">
                            Please contact us at <a href="mailto:support@securopass.com" className="text-gray-400 no-underline">support@securopass.com</a> for any assistance with registration.
                        </Text>
                    </Container>
                </Container>
                <Container className="bg-gray-100 text-center py-4">
                    <Row>
                        <Img
                            src="https://cdn.dpskmun.com/panelixor/black_no_bg.png"
                            width="50"
                            height="50"
                            alt="Panelixor Logo"
                            className="mx-auto"
                        />
                        <Text className="text-center text-base font-[Arial]">
                            <a href="mailto:support@securopass.com" className="text-gray-600 no-underline">support@securopass.com</a>
                        </Text>
                        <Container className="text-base font-[Arial]">
                            <a href="#" className="mr-6 text-gray-600 no-underline">Privacy Policy</a>
                            <a href="#" className="text-gray-600 no-underline">Terms & Conditions</a>
                        </Container>
                    </Row>
                </Container>
            </Tailwind>
        </Html>
    );
}