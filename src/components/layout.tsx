import { ReactNode, useEffect, useState } from "react"
import { MainNav } from "./nav/main-nav"
import { useAuth } from "@clerk/nextjs"
import Home from "@/pages"

type Props = {
  children: ReactNode
}

export const Layout = ({ children }: Props) => {
  const { userId } = useAuth()
  
  return (
    <>
      <div className="bg-background min-h-screen max-w-screen">
        <MainNav/>
        {
          <div className="px-12 overflow-x-hidden">{userId? children: <Home/> }</div> 
        }
      </div>
    </>
  )
}
