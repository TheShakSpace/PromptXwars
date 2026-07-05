/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollNarrativeConfig {
  containerRef: React.RefObject<HTMLDivElement | null>;
  heroRef?: React.RefObject<HTMLDivElement | null>;
  aboutRef?: React.RefObject<HTMLDivElement | null>;
  bentoRef?: React.RefObject<HTMLDivElement | null>;
  statsRef?: React.RefObject<HTMLDivElement | null>;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Majestic GSAP Master Timeline initializer.
 * Binds and synchronizes scroll-driven animations across multiple spatial sections.
 */
export function createGSAPMasterTimeline(config: ScrollNarrativeConfig) {
  const container = config.containerRef.current;
  if (!container) return null;

  // Kill existing scroll triggers inside this container to prevent duplicates
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === container || trigger.vars.trigger === container) {
      trigger.kill();
    }
  });

  // 1. Create the unified Master Timeline
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2, // buttery smooth scrub rate
      invalidateOnRefresh: true,
    },
  });

  // 2. Section Pinning and Parallax offsets
  if (config.heroRef?.current) {
    // Parallax rotate and push back on hero scroll
    masterTimeline.to(config.heroRef.current, {
      scale: 0.92,
      opacity: 0.3,
      yPercent: -15,
      filter: "blur(10px)",
      ease: "power1.inOut",
      duration: 1,
    }, 0);
  }

  if (config.aboutRef?.current) {
    // Fade and slide in about section elegantly
    masterTimeline.fromTo(
      config.aboutRef.current,
      { opacity: 0, yPercent: 30, filter: "blur(12px)" },
      { opacity: 1, yPercent: 0, filter: "blur(0px)", ease: "power2.out", duration: 1 },
      0.5
    );
  }

  if (config.bentoRef?.current) {
    // Bento cards stagger reveal connected to the master scrub timeline
    const cards = config.bentoRef.current.querySelectorAll(".glass-panel");
    if (cards.length > 0) {
      masterTimeline.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          ease: "back.out(1.2)",
          duration: 1.2,
        },
        1.2
      );
    }
  }

  if (config.statsRef?.current) {
    // Reveal stats section
    masterTimeline.fromTo(
      config.statsRef.current,
      { opacity: 0, scale: 0.95, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power3.out", duration: 1 },
      2.0
    );

    // Synchronized number counting system
    const counters = config.statsRef.current.querySelectorAll(".stat-counter");
    counters.forEach((counter) => {
      const targetVal = parseFloat(counter.getAttribute("data-target") || "0");
      const isPercentage = counter.getAttribute("data-percentage") === "true";
      const obj = { val: 0 };

      masterTimeline.to(
        obj,
        {
          val: targetVal,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = `${Math.round(obj.val)}${isPercentage ? "%" : ""}`;
          },
        },
        2.2
      );
    });
  }

  if (config.ctaRef?.current) {
    // CTA emerges majestically at the absolute climax of scrolling
    masterTimeline.fromTo(
      config.ctaRef.current,
      { opacity: 0, yPercent: 40, scale: 0.9 },
      { opacity: 1, yPercent: 0, scale: 1, ease: "elastic.out(1, 0.75)", duration: 1.8 },
      3.2
    );
  }

  return masterTimeline;
}

export default createGSAPMasterTimeline;
