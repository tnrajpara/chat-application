import "./globals.css";
import { Libre_Franklin } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

const inter = Libre_Franklin({ subsets: ["latin"] });

export const metadata = {
  title: "Chat Application",
  description: "A Chat Application built with Next.js and Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
