import TabLayout from "@/components/shared/tab-layout";
import { GalleryTabNavigationItems } from "@/data/gallery/navigation";

export default function Drafts() {
  return (
    <TabLayout
      tabs={GalleryTabNavigationItems}
      title="My Gallery"
      headerActions={<></>}
    >
      {/* Children components here */}
    </TabLayout>
  );
}
