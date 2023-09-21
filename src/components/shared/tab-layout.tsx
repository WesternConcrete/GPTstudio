import { useRouter } from "next/router";
import { type ReactNode, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TabData = {
  title: string;
  value: string;
  urlFragment: string; // changed from url to urlFragment
};

type Props = {
  tabs: TabData[];
  title: string;
  backButtonUrl?: string;
  headerActions?: ReactNode;
  children: ReactNode;
};

export default function FileLayout({
  tabs,
  title,
  backButtonUrl,
  headerActions,
  children,
}: Props) {
  const router = useRouter();

  const constructUrl = (fragment: string) => `${router.pathname}${fragment}`;

  const [tabValue, setTabValue] = useState(() => {
    const matchedTab = tabs.find((tab) =>
      router.asPath.includes(tab.urlFragment)
    );
    return matchedTab?.value || tabs[0]?.value;
  });

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const matchedTab = tabs.find((tab) => url.includes(tab.urlFragment));
      setTabValue(matchedTab?.value || tabs[0]?.value);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, tabs]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-col gap-2">
          {backButtonUrl && (
            <Link href={backButtonUrl}>
              <Button
                className="right-0 top-0 items-center rounded-[0.5rem] px-0 text-sm font-medium md:flex"
                variant="link"
                size="sm"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </Link>
          )}

          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">{headerActions}</div>
      </div>
      <Tabs className="space-y-4" value={tabValue}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              onClick={() => router.push(constructUrl(tab.urlFragment))}
              value={tab.value}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
