import { createNextPageApiHandler } from "uploadthing/next-legacy";

import { ourFileRouter } from "@/server/api/upload-thing";

const handler = createNextPageApiHandler({
  router: ourFileRouter,
});

export default handler;
