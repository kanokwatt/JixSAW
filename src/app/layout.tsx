// import "../styles/index.css"; // เรียกใช้ Tailwind ตรงนี้
// import "../styles/tailwind.css"; // มักจะเป็นไฟล์ที่เรียกใช้ Tailwind
import "../styles/globals.css";  // มักจะเก็บตัวแปรสีของ shadcn
import "../styles/fonts.css";
// import "../styles/theme.css";
// แก้ไข Path ให้ใช้ ./ และลบ .tsx ออก
import { UserProvider } from "./context/UserContext"; 
import { SidebarProvider } from "./context/SidebarContext";
import HtmlClassLogger from "./components/HtmlClassLogger";

export const metadata = {
  title: "JIxSAW Health",
  description: "Next.js Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Crect%20width='100'%20height='100'%20fill='%231DCD9F'/%3E%3Ctext%20x='50'%20y='60'%20font-size='50'%20text-anchor='middle'%20fill='white'%20font-family='Segoe%20UI,%20Arial'%3EJ%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body>
        <HtmlClassLogger />
        <UserProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}