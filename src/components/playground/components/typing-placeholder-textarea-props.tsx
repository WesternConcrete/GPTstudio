import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";

interface TypingPlaceholderTextareaProps {
  promptInput: string;
  setPromptInput: (value: string) => void;
  disabled: boolean;
  placeholders: string[];
}

const TypingPlaceholderTextarea: React.FC<TypingPlaceholderTextareaProps> = ({
  promptInput,
  setPromptInput,
  disabled,
  placeholders,
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(
    Math.floor(Math.random() * placeholders.length)
  );
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    placeholders[placeholderIndex]
  );

  useEffect(() => {
    const changePlaceholder = () => {
      const nextIndex = (placeholderIndex + 1) % placeholders.length;
      setPlaceholderIndex(nextIndex);

      const text = placeholders[nextIndex]!;
      for (let i = 0; i <= text.length; i++) {
        setTimeout(() => {
          setCurrentPlaceholder(text.slice(0, i));
        }, i * 40); // 40ms for each character to mimic typing
      }
    };

    const interval = setInterval(changePlaceholder, 10000); // Change every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [placeholderIndex]);

  return (
    <Textarea
      id="instructions"
      className="resize-none"
      value={promptInput}
      disabled={disabled}
      onChange={(e) => setPromptInput(e.target.value)}
      placeholder={currentPlaceholder}
    />
  );
};

export default TypingPlaceholderTextarea;
