`use client`;

import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LassoSelect,
  Printer,
  Wand2,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { ArtStyle, ImageSize } from "@/interfaces/design-studio";
import { ButtonSpinner } from "@/components/ui/button-spinner";
import { useUploadThing } from "@/utils/upload-thing";
import { Progress } from "../ui/progress";
import TypingPlaceholderTextarea from "./components/typing-placeholder-textarea-props";
import StudioConfig from "./components/StudioConfig";
import { FileEndpoints } from "@/server/api/upload-thing";
import { MaskEditor, toMask } from "react-mask-editor";
import { MaskedImageHandles, MaskedImage } from "./components/masked-image";

export default function PlaygroundPage() {
  const [browserLoadedImages, setBrowserLoadedImages] = useState(
    new Set<string>()
  ); // set to track if the browser has loaded the image using onLoaded
  const [selectedStyle, setSelectedStyle] = useState(ArtStyle.Painting);
  const [promptInput, setPromptInput] = useState("");
  const [selectedImage, setSelectedImage] = useState({
    file: undefined as File | undefined,
    url: "",
  });
  const [isSelectedImageFocused, setIsSelectedImageFocused] = useState(false);
  const [imageCount, setImageCount] = useState(3);
  const [lassoOn, setToggleLasso] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(true);
  const [showGeneratingImagesProgressBar, setShowGeneratingImagesProgressBar] =
    useState(true);
  const [uploadProgressPercent, setUploadProgressPercent] = useState(0);
  const [loadingInspoImage, setLoadingInspoImage] = useState(true);
  const [pastGenerations, setPastGenerations] = useState([[]] as {
    url: string;
  }[][]);
  const [generationIndex, setGenerationIndex] = useState(0);
  const progress = useProgressBar(generatingImages);
  const { startUpload } = useUploadThing(FileEndpoints.variationImage);
  const maskedImageRef = useRef<MaskedImageHandles>(null);



  const lassoDisabled = !isSelectedImageFocused;

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setShowGeneratingImagesProgressBar(true), 1400);
    }
  }, [progress]);

  // Image change handler
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage((prev) => {
        return {
          ...prev,
          file: file,
          url: URL.createObjectURL(file),
        };
      });
      setIsSelectedImageFocused(true)
    }
  };

  // Methods and Handlers
  function useProgressBar(generatingImages: boolean) {
    useEffect(() => {
      let interval: NodeJS.Timeout;

      const increaseProgress = () => {
        if (!generatingImages) {
          clearInterval(interval);
          setUploadProgressPercent(100);
        } else if (uploadProgressPercent < 70) {
          const increment = 70 / (100 - uploadProgressPercent);
          setUploadProgressPercent((prev) => Math.min(prev + increment, 70));
        }
      };

      interval = setInterval(increaseProgress, 100);

      return () => clearInterval(interval);
    }, [uploadProgressPercent, generatingImages]);

    return uploadProgressPercent;
  }

  const dallePromptQuery = api.dalle.prompt.useMutation({
    onSuccess: (data) => {
      if (pastGenerations.length === 1 && pastGenerations[0]?.length === 0) {
        const newPastGenerations = [data as { url: string }[]];
        setPastGenerations(newPastGenerations);
      } else {
        const newPastGenerations = [
          ...pastGenerations,
          data as { url: string }[],
        ];
        setPastGenerations(newPastGenerations);
        setGenerationIndex(newPastGenerations.length - 1);
      }
      setGeneratingImages(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate",
        description: error.message,
        variant: "destructive",
      });
      setGeneratingImages(false);
      setShowGeneratingImagesProgressBar(false);
      setUploadProgressPercent(0);
      setIsSelectedImageFocused(true);
    },
  });

  const saveDalleUrlMutation = api.dalle.selectGeneratedImage.useMutation({
    onError: (error) => {
      toast({
        title: "Failed to select image",
        description: error.message,
        variant: "destructive",
      });
      setGeneratingImages(false);
    },
  });

  const selectedImageToEdit = (url: string) => {
    setLoadingInspoImage(true);
    setSelectedImage({
      url: url,
      file: undefined,
    });
    setIsSelectedImageFocused(true);
  };

  const previousGeneration = () => {
    if (generationIndex > 0) {
      setGenerationIndex(generationIndex - 1);
    }
  };

  const nextGeneration = () => {
    if (generationIndex < pastGenerations.length - 1) {
      setGenerationIndex(generationIndex + 1);
    }
  };

  const handleExtractMask = async (): Promise<Blob> => {
    return await maskedImageRef.current?.extractMaskAsPNG() as unknown as Blob;
  };

  const clearImageLoadUI = () => {
    setShowGeneratingImagesProgressBar(false);
    setGeneratingImages(true);
    setUploadProgressPercent(0);
    setIsSelectedImageFocused(false);
  };

  const addLoadedImage = (url: string) => {
    setBrowserLoadedImages((prev) => new Set(prev).add(url));
  };

  const clearSelectedImage = () => {
    setSelectedImage((prev) => ({
      ...prev,
      url: "",
    }));
    setIsSelectedImageFocused(false);
  };

  const formatPrompt = (input: string, style: string): string => {
    if (style !== "Other") {
      // TODO: Use regex to slice out the specified strings if present.
      return `${input} - Make sure this is in the form of a ${style}`;
    }
    return input;
  };



  /**
   * Initiates the image generation request.
   */
  const requestImageGeneration = async (
    prompt: string,
    imageUrl: string | undefined,
    maskUrl: string | undefined,
  ) => {
    setBrowserLoadedImages(new Set<string>());
    
    await dallePromptQuery.mutateAsync({
      prompt: prompt,
      n: imageCount,
      size: ImageSize.x512,
      image_url: imageUrl,
      mask_url: maskUrl,
    });
  };

  const handleMaskExtracted = (file: File) => {
    console.log('Received mask file in parent component:', file);
    // Do whatever you want with the file here, e.g., startUpload
  }

    /**
   * Get the URL for the image either by uploading the current file or using a provided URL.
   */
    const getImageUrl = async (): Promise<string | undefined> => {
      if (selectedImage.file && selectedImage.url) {
        const uploadFileResponse = await startUpload([
          selectedImage.file,
        ])!;
        return (uploadFileResponse![0]!).url;
      } else if (!selectedImage.file && selectedImage.url) {
        const url = await saveDalleUrlMutation.mutateAsync({
          url: selectedImage.url,
        });
        if (url) {
          const response = await fetch(url);
          const data = await response.blob();
          const metadata = {
            type: "image/png",
          };
          setSelectedImage((prev) => ({
            ...prev,
            file: new File([data], "test.jpg", metadata),
          }));
        }
  
        return url;
      }
    };

  const generateMaskUrl = async () => {
    
    if(lassoOn && selectedImage.url && isSelectedImageFocused) {
      const maskBlob = await handleExtractMask() ;
      const maskFile = new File([maskBlob], "mask.png", {type: "image/png"});

      if(maskFile) {
        const uploadFileResponse = await startUpload([
          maskFile,
        ])!;
        return (uploadFileResponse![0]!).url;
      } else {
        return undefined
      }
      
    }
    return undefined
  }

  const handleGenerateImages = async () => {
    // Initialize the URL variable.
    let url: string | undefined;
    let masked_url: string | undefined;

    // // Set initial states.
    clearImageLoadUI();

    // // Format the user's input.
    const formattedPrompt = formatPrompt(promptInput, selectedStyle);

    masked_url = await generateMaskUrl();

    // // Get the URL for the image.
    url = await getImageUrl();


    // Initiate the image generation request.
    await requestImageGeneration(formattedPrompt, url, masked_url);
  };




  let widthClass = "";

  if (isSelectedImageFocused) {
    widthClass = "w-2/5"; // 80% instead of 100%
  } else {
    switch ((pastGenerations[generationIndex] as { url: string }[]).length) {
      case 1:
        widthClass = "w-2/5"; // 80% instead of 100%
        break;
      case 2:
        widthClass = "w-2/5"; // 40% instead of 50%
        break;
      case 3:
        widthClass = "w-1/3"; // 33% remains the same
        break;
      case 4:
        widthClass = "w-1/4"; // 20% instead of 25%
        break;
      default:
        widthClass = "w-2/5"; // default to 80% width if no images
    }
  }

  return (
    <>
      <div className="h-[calc(100vh-73px)] rounded-[0.5rem] shadow md:flex">
        <div className="flex-1">
          <div className="h-full">
            <div className="grid h-full items-stretch md:grid-cols-[330px_min-content_1fr]">
              <div className="grid px-10 py-6 pb-16 md:order-3 md:grid-rows-[min-content_1fr_min-content]">
                <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                  <Button className="primary-button">
                    Publish
                    <Printer className="icon-margin ml-3 h-4 w-4 shrink-0" />
                  </Button>
                </div>
                <div
                  className={`relative my-6 flex items-center justify-center space-x-4 rounded-lg border p-6 pt-10 ${
                    lassoOn ? "cursor-crosshair" : ""
                  }`}
                >
                  {((pastGenerations[generationIndex] as { url: string }[])
                    .length === 0 &&
                    !isSelectedImageFocused) ||
                  !showGeneratingImagesProgressBar ? (
                    <div
                      className={`align-center flex flex-col justify-center text-center text-sm text-dark-gray transition-opacity duration-1000 ${
                        progress >= 100 ? "opacity-0" : ""
                      }`}
                    >
                      {!showGeneratingImagesProgressBar ? (
                        <>
                          <p className="mb-4">Generating images...</p>
                          <Progress
                            value={progress}
                            className="mb-4 h-2 w-[300px] text-primary-pink"
                          />
                        </>
                      ) : (
                        <>
                          <p>&#127912;</p>
                          <p className="mb-4">
                            Type in a prompt to generate your image
                          </p>
                        </>
                      )}
                    </div>
                  ) : isSelectedImageFocused ? (
                    <>
                      <div className={widthClass}>

                        { !lassoOn ? 
                          <Image
                            width={110} // You can adjust or remove these if you're relying on container width
                            height={110}
                            src={selectedImage.url}
                            className={`h-auto w-full  rounded-md`} // Ensure the image takes the full width of its container
                            alt={"image"}
                            objectFit="cover"
                          /> : 

                          <>
<div className="w-full h-full select-none">
  
        <MaskedImage ref={maskedImageRef} src={selectedImage.url} objectFit="contain" />
                        </div>
                          </>
                          
                          
                        }
                        
                      </div>
                    </>
                  ) : (
                    <>
                      {(
                        pastGenerations[generationIndex] as { url: string }[]
                      ).map((photo, index) => (
                        <div
                          key={index}
                          className={`${widthClass} ${"cursor-pointer"} relative duration-300 hover:scale-105`}
                          onClick={() => selectedImageToEdit(photo.url)}
                        >
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger className="aspect-square h-auto w-auto w-full object-cover">
                                {" "}
                                <Image
                                  width={110} // You can adjust or remove these if you're relying on container width
                                  height={110}
                                  onLoadingComplete={() =>
                                    addLoadedImage(photo.url)
                                  }
                                  src={photo.url}
                                  className={`${
                                    browserLoadedImages.has(photo.url)
                                      ? "opacity-100 duration-1000"
                                      : "opacity-0 duration-1000"
                                  }  h-auto  w-full rounded-md transition-all `} // Ensure the image takes the full width of its container
                                  alt={"image"}
                                  objectFit="cover"
                                />
                              </TooltipTrigger>
                              {
                                <TooltipContent>
                                  <p>Click to edit</p>
                                </TooltipContent>
                              }
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </>
                  )}
                  <div
                    className="absolute top-6 -translate-x-1/2 transform"
                    style={{ left: "calc(50% - 20px)" }}
                  >
                    <div className="flex h-5 items-center space-x-4 text-sm">
                      <Button
                        variant="outline"
                        disabled={!(generationIndex > 0)}
                        onClick={previousGeneration}
                        className="hidden h-8 w-8 p-0 lg:flex"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={null}
                        disabled={lassoDisabled}
                        onClick={() => setToggleLasso(!lassoOn)}
                        className={`h-8 w-8 p-0 ${
                          lassoOn
                            ? "bg-primary-pink text-white hover:bg-opacity-70 hover:text-white"
                            : "hover:bg-border"
                        } border`}
                      >
                        <LassoSelect className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        disabled={
                          !(generationIndex < pastGenerations.length - 1)
                        }
                        onClick={nextGeneration}
                        className="hidden h-8 w-8 p-0 lg:flex"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div
                    className="absolute top-6 transform"
                    style={{ right: "calc(20px)" }}
                  >
                    {isSelectedImageFocused && (
                      <div className="flex h-5 items-center space-x-4">
                        <Button
                          variant="ghost"
                          onClick={() => {setIsSelectedImageFocused(false); setToggleLasso(false);}}
                          className="lg:flex"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-1">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Prompt</Label>
                          <div className="flex w-full items-center space-x-2">
                            <TypingPlaceholderTextarea
                              promptInput={promptInput}
                              setPromptInput={setPromptInput}
                            />
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger className="h-full" asChild>
                                  <Button
                                    type="submit"
                                    className="primary-button h-full w-[90px]"
                                    disabled={
                                      !showGeneratingImagesProgressBar ||
                                      (promptInput.trim().length === 0 &&
                                        !selectedImage.url)
                                    }
                                    onClick={handleGenerateImages}
                                  >
                                    {!showGeneratingImagesProgressBar ? (
                                      <ButtonSpinner size={2} />
                                    ) : (
                                      <Wand2 size={30} />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Generate images</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator orientation="vertical" className="md:order-2" />
              <StudioConfig
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  imageCount={imageCount}
                  setImageCount={setImageCount}
                  selectedImage={selectedImage}
                  onImageChange={onImageChange}
                  loadingInspoImage={loadingInspoImage}
                  setLoadingInspoImage={setLoadingInspoImage}
                  isSelectedImageFocused={isSelectedImageFocused}
                  setIsSelectedImageFocused={setIsSelectedImageFocused}
                  clearSelectedImage={clearSelectedImage}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
