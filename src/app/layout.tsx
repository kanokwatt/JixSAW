// import "../styles/index.css"; // เรียกใช้ Tailwind ตรงนี้
// import "../styles/tailwind.css"; // มักจะเป็นไฟล์ที่เรียกใช้ Tailwind
import "../styles/globals.css";  // มักจะเก็บตัวแปรสีของ shadcn
import "../styles/fonts.css";
// import "../styles/theme.css";
// แก้ไข Path ให้ใช้ ./ และลบ .tsx ออก
import { UserProvider } from "./context/UserContext"; 
import { SidebarProvider } from "./context/SidebarContext";

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
      <body>
        <UserProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}