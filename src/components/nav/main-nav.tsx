import { SignIn, SignInButton, useAuth, useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { LogOut, Moon, PaintbrushIcon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"

interface NavigationItem {
  name: string
  href: string
}

const NAVIGATION_OPTIONS: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Marketplace", href: "/marketplace" },
]

interface HighlightBarSize {
  left: number
  width: number
}

export const MainNav = () => {
  const router = useRouter()
  const [activeRoute, setActiveRoute] = useState(router.pathname)
  const [highlightBarSize, setHighlightBarSize] =
    useState<HighlightBarSize | null>(null)
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const user = useUser()
  const { systemTheme, theme, setTheme } = useTheme();
  const { signOut } = useClerk()

  

  useEffect(() => {


    if (user.isSignedIn) {
      setNavItems(NAVIGATION_OPTIONS)
    } else {
      setNavItems([])
    }
  }, [user.isSignedIn])

  useEffect(() => {
    
    const getHighlightBarSize = (): HighlightBarSize | null => {
      const navItems = document.querySelectorAll("#main-nav-active")
      if (navItems.length === 0) return null
      const navItem = navItems[0] as HTMLElement
      return { left: navItem.offsetLeft - 4, width: navItem.offsetWidth + 8 }
    }

    setActiveRoute(router.pathname)
    

    setTimeout(() => {
      setHighlightBarSize(getHighlightBarSize())
    }, 10)

  }, [router.pathname])




  const navLinks = navItems.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        "text-foreground hover:bg-light-gray px-4 py-2 rounded-md mx-2 transition-colors duration-100 ease-in-out",
        activeRoute === item.href && "text-foreground font-semibold "
      )}
      id={activeRoute === item.href ? "main-nav-active" : undefined}
    >
      {item.name}
    </Link>
  ))



  return (
    <>
      <div className="width-screen px-12 py-4 flex gap-6 flex-col border-b border-border mb-8 sticky top-0 left-0 bg-background">
        <div className="justify-between flex items-center">
          <div className="flex items-center">
          <PaintbrushIcon className="h-8 text-primary-pink mr-5" />
            {navLinks.length > 0 && navLinks}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user?.profileImageUrl ?? 'prof-pic.png'} alt="@shadcn" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
              { user.isSignedIn ?  <div className="flex flex-col space-y-1">
                  {user.user?.firstName && (
                    <p className="text-sm font-medium leading-none">
                      {user.user?.firstName} {user.user?.lastName}
                    </p>
                  )}
                  {user.user?.primaryEmailAddress && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user?.primaryEmailAddress.emailAddress}
                    </p>
                  )}
                </div>: <div className="flex flex-col space-y-1">
              <p className="text-xs leading-none text-muted-foreground">
                      Not logged in
                    </p>
                </div>} 
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {theme == "dark"? setTheme('light'): setTheme("dark")}}>
                { theme == "dark"? <><Sun className="mr-2 h-4 w-4" /><span>Light Theme</span></> : <><Moon className="mr-2 h-4 w-4" /><span>Dark Theme</span></> }
                
              </DropdownMenuItem>
              { user.isSignedIn ?  <DropdownMenuItem onClick={() => { signOut(); }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>: <SignInButton mode="modal"><DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Sign in</span>
              </DropdownMenuItem></SignInButton>}
             
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {highlightBarSize && (
          <div
            className="bottom-0 w-0 h-px bg-primary-pink absolute z-10 left-20 transition-all duration-100 ease-in-out"
            style={highlightBarSize}
          />
        )}
      </div>
      
    </>
  )
}
