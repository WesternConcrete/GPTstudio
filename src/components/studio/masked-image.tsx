import { useTheme } from "next-themes";
import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

interface ImageMaskProps {
  src: string;
  alt?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  setHasMask?: (hasMask: boolean) => void;
}

export interface MaskedImageHandles {
  extractMaskAsPNG: () => void;
}

export const MaskedImage = forwardRef<MaskedImageHandles, ImageMaskProps>(
  ({ src, alt, objectFit, setHasMask }, ref) => {
    const [imageDimensions, setImageDimensions] = useState<{
      width: number;
      height: number;
    } | null>(null);

    const { theme } = useTheme();

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const [cursorSize, setCursorSize] = useState(20); // NEW state variable

    useImperativeHandle(ref, () => ({
      extractMaskAsPNG: () => {
        return new Promise((resolve, reject) => {
          const canvas = canvasRef.current;
          if (!canvas || !imageDimensions) {
            reject("Canvas or imageDimensions not available");
            return;
          }

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = imageDimensions.width;
          tempCanvas.height = imageDimensions.height;

          const ctx = tempCanvas.getContext("2d");
          ctx?.drawImage(
            canvas,
            0,
            0,
            imageDimensions?.width,
            imageDimensions?.height
          );

          // Invert the mask
          const imageData = ctx?.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );

          if (!imageData) return;
          for (let i = 0; i < imageData.data.length; i += 4) {
            const alpha = imageData.data[i + 3];
            if (alpha === 0) {
              imageData.data[i] = 255; // Red
              imageData.data[i + 1] = 255; // Green
              imageData.data[i + 2] = 255; // Blue
              imageData.data[i + 3] = 255; // Alpha (opaque)
            } else {
              imageData.data[i + 3] = 0; // Alpha (transparent)
            }
          }
          ctx?.putImageData(imageData, 0, 0);

          tempCanvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject("Failed to generate blob");
            }
          }, "image/png");
        });
      },
    }));

    useEffect(() => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    }, [src]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const adjustCursorSize = (event: WheelEvent) => {
        event.preventDefault(); // Prevents the default scroll behavior

        let newSize = cursorSize;
        if (event.deltaY > 0) {
          // Scrolling up, increase size
          newSize += 5;
        } else {
          // Scrolling down, decrease size
          newSize -= 3;
        }

        // Ensure the size stays within bounds
        newSize = Math.max(10, Math.min(newSize, 100));
        setCursorSize(newSize);
      };

      canvas.addEventListener("wheel", adjustCursorSize);

      return () => {
        canvas.removeEventListener("wheel", adjustCursorSize);
      };
    }, [isDrawing, theme, cursorSize]);

    useEffect(() => {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current && canvasRef.current) {
          canvasRef.current.width = containerRef.current.clientWidth;
          canvasRef.current.height = containerRef.current.clientHeight;
        }
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // Set the cursor color based on theme with opacity 0.7
      context.strokeStyle =
        theme === "dark"
          ? "rgba(227, 94, 160, 0.7)"
          : "rgba(227, 94, 160, 0.7)"; // pink with 0.7 opacity

      // Increase the cursor size (line width)
      context.lineWidth = cursorSize;

      const createCursor = (size: number) => {
        const radius = size / 2;
        return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${radius}' cy='${radius}' r='${radius}' fill='rgba(227, 94, 160, 0.7)' /></svg>") ${radius} ${radius}, auto`;
      };

      // Set the cursor
      canvas.style.cursor = createCursor(context.lineWidth);

      // Make the stroke always circular
      context.lineJoin = "round";
      context.lineCap = "round";

      const startDrawing = (event: MouseEvent) => {
        setIsDrawing(true);
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
      };

      const draw = (event: MouseEvent) => {
        if (!isDrawing) return;
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
      };

      const stopDrawing = () => {
        setIsDrawing(false);
        context.closePath();
        if (setHasMask) {
          // check if there's any drawing on the canvas
          const hasMask = Boolean(
            context
              .getImageData(0, 0, canvas.width, canvas.height)
              .data.some((value) => value !== 0)
          );
          setHasMask(hasMask);
        }
      };

      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);

      return () => {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
      };
    }, [isDrawing, theme, cursorSize]); // Include theme in dependency array to react to theme changes

    return (
      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
        className="select-none"
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit }}
          className="select-none"
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0, opacity: "50%" }}
        />
      </div>
    );
  }
);
