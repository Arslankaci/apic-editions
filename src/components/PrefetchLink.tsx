import { forwardRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import { prefetchRoute } from "@/lib/routePrefetch";

type PrefetchLinkProps = LinkProps & {
  to: string;
};

/**
 * Drop-in replacement for react-router-dom's <Link> that preloads
 * the target route's lazy chunk on hover / focus / touch start.
 */
const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ to, onMouseEnter, onFocus, onTouchStart, ...props }, ref) => {
    const handlePrefetch = () => {
      if (typeof to === "string") prefetchRoute(to);
    };

    return (
      <Link
        ref={ref}
        to={to}
        onMouseEnter={(e) => {
          handlePrefetch();
          onMouseEnter?.(e);
        }}
        onFocus={(e) => {
          handlePrefetch();
          onFocus?.(e);
        }}
        onTouchStart={(e) => {
          handlePrefetch();
          onTouchStart?.(e);
        }}
        {...props}
      />
    );
  },
);

PrefetchLink.displayName = "PrefetchLink";

export default PrefetchLink;
