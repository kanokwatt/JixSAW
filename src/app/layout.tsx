import "../styles/index.css"; // เรียกใช้ Tailwind ตรงนี้
import { UserProvider } from "src/app/context/UserContext.tsx"; 
import { SidebarProvider } from "src/app/context/SidebarContext.tsx";

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
            <UserProvider>
              {children}
            </UserProvider>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}