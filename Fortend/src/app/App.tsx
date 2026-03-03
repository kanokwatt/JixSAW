import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./context/UserContext";
import { SidebarProvider } from "./context/SidebarContext";

export default function App() {
  return (
    <UserProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </UserProvider>
  );
}