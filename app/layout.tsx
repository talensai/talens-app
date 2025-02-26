import localFont from "next/font/local";
import "./globals.css";
import { AnswersProvider } from "@/contexts/AnswersContext";
import Symbol from "@/components/brand/symbol";
import Logotype from "@/components/brand/logotype";
import Logo from "@/components/brand/logo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Talens Assessment</title>
        <meta name="description" content="An AI-based assessment platform" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talensai.com/" />
        <meta property="og:title" content="Talens Assessment" />
        <meta property="og:description" content="An AI-based assessment platform" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:secure_url" content="https://talensai.com/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:card" content="summary_large_image" />
        
        {/* Favicon */}
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/talens_favicon.svg" />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <div className="fixed top-0 left-0 w-full min-h-screen px-4 md:px-6 lg:px-8 bg-background">
            <div className="max-w-[100rem] pt-4 md:pt-6 lg:pt-8 pb-11 mx-auto flex flex-col min-h-screen">
              <div className="flex flex-col md:flex-row justify-between flex-grow">
                <div className="flex flex-col justify-between flex-grow">
                  <div className="md:hidden flex items-center justify-center flex-grow">
                    <div className="w-full max-w-md">
                      <Logo />
                    </div>
                  </div>
                  <div className="hidden md:block w-full max-w-2xl mt-auto">
                    <Logotype />
                  </div>
                </div>
                <div className="hidden md:block w-16 h-16 flex-shrink-0 md:ml-6 self-start">
                  <Symbol />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <AnswersProvider>{children}</AnswersProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
