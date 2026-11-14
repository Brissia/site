import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import type { ComponentProps } from "react";

const components = {
  // Images inside long-form: full column, black and white, lazy by default.
  img: ({ src, alt }: ComponentProps<"img">) =>
    typeof src === "string" ? (
      <span className="relative my-10 block aspect-[3/2] overflow-hidden bg-card">
        <Image src={src} alt={alt ?? ""} fill sizes="(min-width: 768px) 608px, 100vw" className="object-cover grayscale" />
      </span>
    ) : null,
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  },
};

export function Mdx({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={`prose prose-editorial ${className}`}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
