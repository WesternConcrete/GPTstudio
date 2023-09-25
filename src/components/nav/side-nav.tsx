import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Moon,
  PaintBucket,
  Paintbrush2,
  PanelLeftOpen,
  PanelRightOpen,
  Store,
  Sun,
  User,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  disabled: boolean;
}

interface SideNavProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const NAVIGATION_OPTIONS: NavigationItem[] = [
  { name: "Design Studio", href: "studio", icon: PaintBucket, disabled: false },
  {
    name: "My Gallery",
    href: "gallery",
    icon: LayoutDashboard,
    disabled: true,
  },
  { name: "Marketplace", href: "marketplace", icon: Store, disabled: true },
];

export function SideNav({
  className,
  isCollapsed,
  setIsCollapsed,
}: SideNavProps) {
  const user = useUser();
  const { theme, setTheme } = useTheme();
  const { signOut, openSignIn } = useClerk();
  const router = useRouter();
  const activeRoute = router.pathname.split("/")[1];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-10 flex h-screen flex-col gap-2 border-r border-border px-3 pb-3 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64 flex-none",
        className
      )}
    >
      <div className="flex-grow space-y-4 pb-4">
        <div className="py-2">
          <div
            className={`mb-6 flex items-center border-b py-4 pt-6 ${
              isCollapsed ? " justify-center" : " justify-between pl-2"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`${"rounded border bg-primary-input dark:bg-black"} p-2`}
              >
                <Paintbrush2 className="h-8 w-8 text-primary-pink" />
              </div>
              {!isCollapsed ? (
                <span className="ml-1 whitespace-nowrap text-lg font-bold">
                  GPT Studio
                </span>
              ) : null}
            </div>
          </div>

          <div className={`space-y-3`}>
            {NAVIGATION_OPTIONS.map((option) => {
              return (
                <TooltipProvider key={option.name}>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          router.push(`/${option.href}`);
                        }}
                        variant={"ghost"}
                        className={`w-full gap-3 whitespace-nowrap ${
                          isCollapsed
                            ? "justify-center px-2"
                            : "justify-start gap-3"
                        } hover:bg-accent hover:text-accent-foreground ${
                          activeRoute === option.href
                            ? "bg-primary-pink text-white hover:bg-primary-pink hover:text-white"
                            : ""
                        }`}
                        disabled={option.disabled}
                      >
                        <option.icon className={`h-5 w-5`} />
                        {!isCollapsed ? <span>{option.name}</span> : null}
                        {!isCollapsed && option.disabled && (
                          <Lock className={`h-4 w-4`} />
                        )}
                      </Button>
                    </TooltipTrigger>

                    {isCollapsed && (
                      <TooltipContent side={"right"} hideWhenDetached={true}>
                        <p>{option.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </div>
      <div />
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              className="border-b border-border p-2"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-medium-gray" />
              ) : (
                <PanelRightOpen className="h-4 w-4 text-medium-gray" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={"right"}>
            <p>{isCollapsed ? "Expand" : "Collapse"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"link"} className="h-auto py-3">
            <div
              className={
                isCollapsed ? "flex justify-center" : "flex items-center gap-3"
              }
            >
              <div className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user?.profileImageUrl ?? "prof-pic.png"}
                    alt="@shadcn"
                  />
                </Avatar>
              </div>
              {!isCollapsed ? (
                <span className="text-sm">
                  {user?.user?.primaryEmailAddress?.emailAddress}
                </span>
              ) : null}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            {user.isSignedIn ? (
              <div className="flex flex-col space-y-1">
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
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <p className="text-xs leading-none text-muted-foreground">
                  Not logged in
                </p>
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              theme == "dark" ? setTheme("light") : setTheme("dark");
            }}
          >
            {theme == "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Theme</span>
              </>
            )}
          </DropdownMenuItem>
          {user.isSignedIn ? (
            <DropdownMenuItem
              onClick={async () => {
                signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => openSignIn()}>
              <SignInButton mode="modal">
                <>
                  {" "}
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign in</span>
                </>
              </SignInButton>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
