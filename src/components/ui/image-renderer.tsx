import { type ComponentProps, type PropsWithChildren, useState } from "react";
import Image from "next/image";
import { ButtonSpinner } from "./button-spinner";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

type ImageProps = ComponentProps<typeof Image>;

export default function ImageRenderer(props: PropsWithChildren<ImageProps>) {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-8 transition-all duration-300 hover:bg-border`}
        >
          <Image {...props} onLoadingComplete={() => setLoadingImage(false)} />

          {loadingImage && <ButtonSpinner size={2} />}
        </div>
      </DialogTrigger>
      <DialogContent className="flex h-[70vh] max-w-prose items-center justify-center">
        <div className="flex h-full w-full items-center justify-center">
          <Image
            {...props}
            objectFit="contain"
            layout="fill"
            width={undefined}
            height={undefined}
            className="p-8"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
