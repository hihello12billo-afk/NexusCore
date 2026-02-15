import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css"; 
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space",
  weight: ["300", "400", "500", "700"] 
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

// --- UPDATED METADATA SECTION ---
export const metadata: Metadata = {
  title: "NexusCore | AI Automation Agency & Custom Chatbots",
  description: "NexusCore replaces manual chaos with intelligent AI agents. We build custom AI chatbots, workflow automations, and Python solutions.",
  keywords: ["AI Automation Agency", "Custom Chatbots", "Business Automation", "Zapier Experts", "Python Development"],
  
  // THIS IS THE MISSING PIECE FOR GOOGLE VERIFICATION:
  verification: {
    google: "cuIH3LRbdaun2QY38zGHLG1qbbgQ9NEqQG8FBO3TG5Q",
  },

  openGraph: {
    title: "NexusCore | Automate Everything",
    description: "Deploy intelligent AI agents to scale your business operations.",
    url: "https://nexus-core-wheat.vercel.app/",
    siteName: "NexusCore",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}