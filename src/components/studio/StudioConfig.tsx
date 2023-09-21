import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArtStyle } from "@/interfaces/design-studio";
import { ButtonSpinner } from "@/components/ui/button-spinner";
import { MaxLengthSelector } from "./maxlength-selector";
import {
  ArrowLeftFromLine,
  ChevronLeftIcon,
  Edit,
  Edit2,
  Edit3,
  Eraser,
  LassoSelect,
  Pen,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  selectedStyle: ArtStyle;
  setSelectedStyle: Dispatch<SetStateAction<ArtStyle>>;
  imageCount: number;
  setImageCount: (count: number) => void;
  selectedImage: { url: string | null };
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  loadingInspoImage: boolean;
  setLoadingInspoImage: (loading: boolean) => void;
  isSelectedImageFocused: boolean;
  setIsSelectedImageFocused: (focused: boolean) => void;
  clearSelectedImage: () => void;
}

export default function StudioConfig({
  selectedStyle,
  setSelectedStyle,
  imageCount,
  setImageCount,
  selectedImage,
  onImageChange,
  loadingInspoImage,
  setLoadingInspoImage,
  isSelectedImageFocused,
  setIsSelectedImageFocused,
  clearSelectedImage,
}: Props) {
  const ART_STYLES = [
    { name: ArtStyle.Painting, src: "/painting.png" },
    { name: ArtStyle.Drawing, src: "/drawing.png" },
    { name: ArtStyle.Photo, src: "/photo.png" },
    { name: ArtStyle.Other, src: "/other.png" },
  ];

  return (
    <div className="hidden flex-col space-y-4 p-8 sm:flex md:order-1">
      <h2 className="text-3xl font-bold tracking-tight">Design Studio</h2>
      <div className="grid gap-4">
        <Label htmlFor="model">Image Type</Label>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {ART_STYLES.map((style_obj) => {
            const classname = `transition-all duration-200 w-[117px] h-[90px] relative flex bg-transparent border border-2 rounded-lg items-center justify-center p-0 hover:bg-accent hover:text-accent-foreground cursor-pointer text-foreground 
          ${selectedStyle === style_obj.name ? "border-primary-pink" : ""} `;
            return (
              <TooltipProvider key={style_obj.name}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setSelectedStyle(style_obj.name)}
                      className={classname}
                    >
                      <Image
                        width={70}
                        height={70}
                        src={style_obj.src}
                        className="rounded-md"
                        alt="fox"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{style_obj.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      <Separator />
      <MaxLengthSelector setValue={setImageCount} value={imageCount} />
      <Separator />
      <div className="grid gap-2 pt-2">
        <div className="flex h-8 items-center justify-between">
          <Label htmlFor="model">Inspiration (optional)</Label>
          {selectedImage.url ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-full w-[80px] text-xs"
                  size={"sm"}
                  variant={"ghost"}
                >
                  Edit
                  <Edit className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {!isSelectedImageFocused ? (
                  <DropdownMenuItem
                    onClick={() => setIsSelectedImageFocused(true)}
                  >
                    <Eraser className="mr-2 h-4 w-4" />
                    <span>Mask</span>
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                <DropdownMenuItem onClick={clearSelectedImage}>
                  <X className="mr-2 h-4 w-4" />
                  <span>Clear</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <></>
          )}
        </div>

        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className={`flex h-[240px] w-[240px] cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-border ${
              selectedImage.url
                ? "border-2 p-8 transition-all duration-300 hover:p-6"
                : "border-2 border-dashed border-border"
            }`}
          >
            {selectedImage.url ? (
              <div className="overflow-hidden rounded-md  ">
                <Image
                  src={selectedImage.url}
                  alt="Uploaded Image"
                  onLoadingComplete={() => setLoadingInspoImage(false)}
                  width={240}
                  height={240}
                  className={"aspect-square h-auto w-auto object-cover"}
                />
                {loadingInspoImage && <ButtonSpinner size={2} />}
              </div>
            ) : (
              <div className="duration-400 flex h-[240px] w-[240px] flex-col items-center justify-center pb-6 pt-5 transition-all">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG only
                </p>
              </div>
            )}

            <input
              id="dropzone-file"
              type="file"
              accept="image/png"
              className="hidden"
              onChange={onImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
