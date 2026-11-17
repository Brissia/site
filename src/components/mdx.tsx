import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import type { ComponentProps } from "react";
import remarkGfm from "remark-gfm";
import { Link } from "./link";

const components = {
  // Images inside long-form: full column, black and white, lazy by default.
  img: ({ src, alt }: ComponentProps<"img">) =>
    typeof src === "string" ? (
      <span className="relative my-10 block aspect-[3/2] overflow-hidden bg-card">
        <Image src={src} alt={alt ?? ""} fill sizes="(min-width: 768px) 608px, 100vw" className="object-cover grayscale" />
      </span>
    ) : null,
  // Wide tables scroll sideways inside their own frame instead of stretching the page on a phone.
  table: (props: ComponentProps<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table {...props} className="!my-0 min-w-[36rem] text-[14px]" />
    </div>
  ),
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) => {
    const external = /^https?:\/\//.test(href);
    // Links between pieces of the site keep the reader in their language.
    if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
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
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </div>
  );
}
