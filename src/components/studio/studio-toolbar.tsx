import { Button } from "@/components/ui/button";
import { Printer, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageRenderer from "../ui/image-renderer";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

interface Props {
  disabled?: boolean;
  selectedImageUrl?: string;
  defaultTitle?: string;
}

export default function StudioConfig({
  disabled,
  selectedImageUrl,
  defaultTitle,
}: Props) {
  const [title, setTitle] = useState(defaultTitle ?? "");

  const disableSave = title.length === 0;

  return (
    <div className="ml-auto flex w-full space-x-4 sm:justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"} disabled={disabled}>
            Save Draft
            <Save className="icon-margin ml-3 h-4 w-4 shrink-0" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Save draft</DialogTitle>
            <DialogDescription>
              This image will be saved in "My Gallery" for future access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Input title..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                className="resize-none"
                placeholder="Input description..."
              />
            </div>
            <ImageRenderer
              width={240}
              height={240}
              src={selectedImageUrl ?? ""}
              alt={selectedImageUrl ?? ""}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="primary-button"
              disabled={disableSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="primary-button" disabled={disabled}>
            Publish
            <Printer className="icon-margin ml-3 h-4 w-4 shrink-0" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Publish</DialogTitle>
            <DialogDescription>
              Clicking "Publish" will save this draft and bring you to the
              canvas selection page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Input title..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                className="resize-none"
                placeholder="Input description..."
              />
            </div>
            <ImageRenderer
              width={240}
              height={240}
              src={selectedImageUrl ?? ""}
              alt={selectedImageUrl ?? ""}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="primary-button"
              disabled={disableSave}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
