import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./context/UserContext";
import { SidebarProvider } from "./context/SidebarContext";

// App เป็นจุดเริ่มต้นของแอป โดยครอบ router ด้วย context ที่ใช้ร่วมกันทั้งระบบ
export default function App() {
  return (
    <UserProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </UserProvider>
  );
}