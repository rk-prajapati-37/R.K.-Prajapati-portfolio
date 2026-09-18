import type { ReactNode } from "react";

export const metadata = {
  title: "Blog",
  description: "Articles on web development, WordPress, automation and building websites that work for your business.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
