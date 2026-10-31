import type { ComponentProps } from "react";
export default function PreviewLink({ href, ...props }: ComponentProps<"a">) { return <a href={href} {...props} />; }
