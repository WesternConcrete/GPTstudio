import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";

interface TypingPlaceholderTextareaProps {
  promptInput: string;
  setPromptInput: (value: string) => void;
}

const TypingPlaceholderTextarea: React.FC<TypingPlaceholderTextareaProps> = ({
  promptInput,
  setPromptInput,
}) => {
  const placeholders = [
    "A watercolor of a cityscape under a neon-green sky.",
    "A Picasso-esque depiction of a robot playing the violin.",
    "A surrealist painting of fish swimming in a floating fishbowl above a desert.",
    "A charcoal sketch of an astronaut dancing on the moon with an alien.",
    "A Van Gogh inspired image of a digital metropolis at night.",
    "A photo of a parrot with peacock tail feathers perched on a vintage telephone.",
    "A Renaissance style portrait of a mermaid reading a book.",
    "A cubist painting of a neon-lit Tokyo street in the rain.",
    "A chalk drawing of a dragon and a unicorn playing chess on a cloud.",
    "An impressionist painting of a futuristic train station with floating platforms.",
    "A photo of a chameleon blending into a bouquet of colorful flowers.",
    "A Banksy-style graffiti of a robot holding a 'Humans Welcome' sign.",
    "A Dali-inspired surreal painting of melting clocks on a digital landscape.",
    "A manga-style drawing of a samurai battling a giant mechanical spider.",
    "A photo of a golden retriever wearing a Sherlock Holmes detective hat and pipe.",
    "A Gothic painting of a haunted mansion with ghostly figures dancing in its ballroom.",
  ];

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
      onChange={(e) => setPromptInput(e.target.value)}
      placeholder={currentPlaceholder}
    />
  );
};

export default TypingPlaceholderTextarea;
