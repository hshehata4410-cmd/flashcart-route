import React from "react";
import Container from "@components/ui/Container";

type HeroSectionProps = {
  title: string;
  description?: string;
  /** Optional trailing content, e.g. an action or a count. */
  children?: React.ReactNode;
};

/**
 * Full-width page banner used by the home, shop, and categories pages.
 * Roughly 250px tall on desktop; grows with its content on smaller screens.
 */
const HeroSection = ({ title, description, children }: HeroSectionProps) => {
  return (
    <section className="w-full bg-primary-600">
      <Container className="flex flex-col justify-center gap-2 py-8 text-white lg:min-h-[250px] lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <div>
          <h1 className="text-[30px] font-bold leading-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-primary-100">{description}</p>
          )}
        </div>

        {children && <div className="shrink-0">{children}</div>}
      </Container>
    </section>
  );
};

export default HeroSection;
