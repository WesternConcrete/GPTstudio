import { type ReactNode } from "react";
import { MainNav } from "./nav/main-nav";
import { useAuth } from "@clerk/nextjs";
import LandingPage from "@/pages";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  const { userId } = useAuth();

  return (
    <>
      <div className="max-w-screen min-h-screen bg-background">
        <MainNav />
        {<div className="h-full">{userId ? children : <LandingPage />}</div>}
      </div>
    </>
  );
};
