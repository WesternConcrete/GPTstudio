import { type TabLayoutNavigationItem } from "@/interfaces/shared/navigation";

export const GalleryTabNavigationItems = [
  { title: "Drafts", value: "drafts", urlFragment: "/drafts" },
  { title: "Published", value: "published", urlFragment: "/published" },
] as TabLayoutNavigationItem[];
