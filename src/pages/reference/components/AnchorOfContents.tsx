// src/pages/reference/components/AnchorOfContents.tsx
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  name: string;
  href: string;
}

interface AnchorOfContentsProps {
  items: NavItem[];
}

export function AnchorOfContents({ items }: AnchorOfContentsProps) {
  return (
    <aside className="hidden lg:block w-40 shrink-0">
      <div className="sticky top-10 flex flex-col items-center">
        <nav className="flex flex-col gap-1 p-1 bg-background/80 backdrop-blur-md border rounded-2xl shadow-lg w-full">
          <div className="px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </p>
          </div>

          {items.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start rounded-xl text-slate-600 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <a href={item.href} className="text-xs truncate">
                {item.name}
              </a>
            </Button>
          ))}

          <Separator className="my-1 opacity-50" />

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-xl text-slate-400 hover:text-primary"
            onClick={() => {
              document.getElementById("page-top")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            <span className="text-[10px]">Top</span>
          </Button>
        </nav>
      </div>
    </aside>
  );
}
