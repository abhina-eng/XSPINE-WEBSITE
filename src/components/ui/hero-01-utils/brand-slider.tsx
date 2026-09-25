"use client";
import { Marquee } from "@/components/ui/hero-01-utils/marquee";
import { motion } from "motion/react";

export interface BrandList {
  image: string;
  name: string;
  /** Optional variant for light backgrounds; without it `image` is used everywhere */
  lightimg?: string;
}

function BrandLogo({ brand }: { brand: BrandList }) {
  return (
    <div className="flex items-center justify-center px-4 lg:px-8">
      {brand.lightimg ? (
        <>
          <img src={brand.image} alt={brand.name} className="h-14 md:h-20 w-auto dark:hidden" />
          <img src={brand.lightimg} alt={brand.name} className="hidden dark:block h-14 md:h-20 w-auto" />
        </>
      ) : (
        <img src={brand.image} alt={brand.name} className="h-14 md:h-20 w-auto" />
      )}
    </div>
  );
}

function BrandSlider({ brandList }: { brandList: BrandList[] }) {
  const mid = Math.ceil(brandList.length / 2);
  const row1 = brandList.slice(0, mid);
  const row2 = brandList.slice(mid);

  return (
    <section>
      <div className="py-6 md:py-10">
        <div className="mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-center text-center py-3 md:py-4 relative">
              <div className="flex items-center justify-center gap-4">
                <div className="hidden md:block h-0.5 w-40 bg-linear-to-l from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
                <p className="text-lg font-normal sm:px-2 px-10 text-muted-foreground text-center">
                  Brands we've guided
                </p>
                <div className="hidden md:block h-0.5 w-40 bg-linear-to-r from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
              </div>
            </div>
            {brandList.length > 0 && (
              <div className="flex flex-col gap-4">
                <Marquee pauseOnHover className="[--duration:30s] p-0">
                  {row1.map((brand, i) => (
                    <BrandLogo key={i} brand={brand} />
                  ))}
                </Marquee>
                <Marquee pauseOnHover reverse className="[--duration:30s] p-0">
                  {row2.map((brand, i) => (
                    <BrandLogo key={i} brand={brand} />
                  ))}
                </Marquee>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;
