//"256x256" | "512x512" | "1024x1024" | null | undefined

export enum ImageSize {
  x256 = "256x256",
  x512 = "512x512",
  x1024 = "1024x1024",
}

export enum ArtStyle {
  Painting = "Painting",
  Drawing = "Drawing",
  Photo = "Photo",
  Other = "Other",
}

export interface StyleTypeObj {
  name: ArtStyle;
  src: string;
}
