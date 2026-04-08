import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const { userId } = await auth();
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!userId || !adminUserId || userId !== adminUserId) {
    redirect("/");
  }

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
