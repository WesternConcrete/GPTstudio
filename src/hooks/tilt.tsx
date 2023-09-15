import { useRef, useEffect } from "react";

export function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // Subtracting 0.5 to make the center as the origin
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--px", px.toString());
      el.style.setProperty("--py", py.toString());
    };

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return ref;
}
