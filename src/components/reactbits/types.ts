export interface PhotoProgram {
  title: string;
  href: string;
  desc: string;
  subtitle?: string;
  features?: readonly string[];
  image?: string;
  imageSrcSet?: string;
  position?: string;
  alt?: string;
}