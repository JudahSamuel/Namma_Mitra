import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configure Space Grotesk (Professional/Tech Look)
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["500", "700"], // Only loading Medium and Bold for cleaner file size
  variable: "--font-space",
});

export const metadata = {
  title: "NAMMA MITRA",
  description: "Premium Campus Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}