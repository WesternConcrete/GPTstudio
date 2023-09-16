import { useState, type ReactNode } from "react";
import { MainNav } from "./nav/main-nav";
import { useAuth } from "@clerk/nextjs";
import LandingPage from "@/pages";
import { SideNav } from "./nav/side-nav";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  const { userId } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div className="max-w-screen flex min-h-screen bg-background">
        {userId && (
          <SideNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
        <div
          className={`flex w-full flex-col transition-all transition-all duration-300 ease-in-out ${
            userId ? (isCollapsed ? "ml-20" : "ml-64") : ""
          }`}
        >
          <div className="h-full">{userId ? children : <LandingPage />}</div>
        </div>
      </div>
    </>
  );
};
