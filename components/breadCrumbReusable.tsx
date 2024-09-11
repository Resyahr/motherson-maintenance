"use client";

import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { linksData, LinkItem } from "@/config/navigationLinks";
import { useEffect, useState, useMemo } from "react";

// Define the type for breadcrumb items
interface Breadcrumb {
  path: string;
  label: string;
}

export const BreadcrumbReusable = ({ className }: { className?: string }) => {
  const { status } = useSession();
  const pathname = usePathname();

  // Define the state with the correct type
  const [breadcrumbItems, setBreadcrumbItems] = useState<Breadcrumb[]>([]);

  // Memoize the breadcrumb logic so it's only recomputed when pathname changes
  const computedBreadcrumbs = useMemo(() => {
    const buildBreadcrumbs = (): Breadcrumb[] => {
      const breadcrumbs: Breadcrumb[] = [];

      // Add "Dashboard" as the root breadcrumb if the pathname is not root "/"
      if (pathname !== "/dashboard") {
        breadcrumbs.push({ path: "/dashboard", label: "Dashboard" });
      }

      // Add the current path based on the linksData structure
      linksData.forEach((link: LinkItem) => {
        if (pathname === link.href) {
          breadcrumbs.push({ path: link.href, label: link.text });
        } else if (link.subLinks) {
          link.subLinks.forEach((subLink) => {
            if (pathname.startsWith(subLink.href)) {
              breadcrumbs.push({ path: link.href, label: link.text });
              breadcrumbs.push({ path: subLink.href, label: subLink.text });
            }
          });
        }
      });

      return breadcrumbs;
    };

    return buildBreadcrumbs();
  }, [pathname]);

  // Only update state if the computed breadcrumbs are different
  useEffect(() => {
    if (
      JSON.stringify(breadcrumbItems) !== JSON.stringify(computedBreadcrumbs)
    ) {
      setBreadcrumbItems(computedBreadcrumbs);
    }
  }, [computedBreadcrumbs, breadcrumbItems]);

  return status === "loading" ? (
    <div></div>
  ) : (
    <Breadcrumbs
      variant="solid"
      maxItems={3}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      className={className}
    >
      {breadcrumbItems.map((crumb, index) => (
        <BreadcrumbItem key={index} href={crumb.path}>
          {crumb.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};
