import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { openai } from "@/server/api/openai.config";
import { ImageSize } from "@/interfaces/design-studio";
import { utapi } from "uploadthing/server";

export const dalle = createTRPCRouter({
  prompt: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        n: z.number(),
        size: z.nativeEnum(ImageSize),
        //optional file object
        image_url: z.string().optional(),
        mask_url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { prompt, n, size, image_url, mask_url } = input;
      if (mask_url && image_url) {

        console.log('edit')
        const response = await openai.images.edit({
          image: (await fetch(image_url)) as any,
          n,
          size,
          mask: (await fetch(mask_url)) as any,
          prompt,
        });

        return response.data;
      } else if (image_url) {
        console.log('createVariation')
        const response = await openai.images.createVariation({
          image: (await fetch(image_url)) as any,
          n,
          size,
        });

        return response.data;
      } else {
        console.log('generate')
        const response = await openai.images.generate({
          prompt,
          n,
          size,
        });
        return response.data;
      }
    }),
  selectGeneratedImage: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { url } = input;
      const response = await utapi.uploadFilesFromUrl(url);
      return response.data?.url;
    }),
});
