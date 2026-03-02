import "../styles/index.css"; // เรียกใช้ Tailwind ตรงนี้
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