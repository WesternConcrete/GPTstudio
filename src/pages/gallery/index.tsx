// navigate to pages/portal/files/[file_id]/runs/index.tsx by default

import { GalleryTabNavigationItems } from "@/data/gallery/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const GalleryDefaultPage = () => {
  const router = useRouter();

  const default_tab = GalleryTabNavigationItems[0]?.value;

  useEffect(() => {
    router.replace(`${router.pathname}/${default_tab ?? ""}`);
  }, []);

  return <></>; // or a loading spinner while redirecting
};

export default GalleryDefaultPage;
