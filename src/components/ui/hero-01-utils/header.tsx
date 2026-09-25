"use client";

import logoWhite from "@/assets/logo-white.svg";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CollaborateButton = ({ className }: { className?: string }) => (
  <Button className={cn("relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden", className, "cursor-pointer")}>
    <span className="relative z-10 transition-all duration-500">
      Let's Collaborate
    </span>
    <span className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </span>
  </Button>
);

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
};

type HeaderProps = {
  navigationData?: NavigationSection[];
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-4 md:px-6 flex items-center justify-center sticky top-0 pt-4",
        className,
      )}
    >
      <div className="w-full max-w-6xl flex items-center justify-between gap-4 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
        <a href="#">
          <img src={logoWhite} alt="Spine" className="h-7 w-auto" />
        </a>

        <CollaborateButton />
      </div>
    </motion.header>
  );
};

export default Header;
