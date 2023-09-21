import TabLayout from "@/components/shared/tab-layout";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  return (
    <TabLayout
      tabs={[
        { title: "Runs", value: "runs", urlFragment: "/runs" },
        { title: "History", value: "history", urlFragment: "/history" },
      ]}
      title="Title Page"
      headerActions={<Button>Download</Button>}
    >
      {/* Children components here */}
    </TabLayout>
  );
}
