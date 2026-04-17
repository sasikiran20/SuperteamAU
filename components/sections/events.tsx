"use client";

import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { type Event } from "@/types";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  LumaCheckoutButton,
  LumaCheckoutScript,
} from "@/components/ui/luma-checkout";
import {
  IconCalendar,
  IconMapPin,
  IconExternalLink,
  IconSparkles,
  IconClock,
  IconArrowRight,
} from "@tabler/icons-react";

function UpcomingEventCard({ event }: { event: Event }) {
  return (
    <CardContainer className="w-full">
      <CardBody className="group relative rounded-2xl border border-border/50 bg-muted/20 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(181,75,51,0.12)]">
        <div className="flex flex-col md:flex-row md:h-[320px] [transform-style:preserve-3d]">
          <CardItem
            translateZ={40}
            className="relative w-full md:w-[45%] shrink-0 self-stretch"
          >
            <div className="relative w-full h-44 sm:h-56 md:h-full overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <Image
                src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
                alt={event.title || "Event"}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              <div className="hidden md:block absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted/40 to-transparent" />
              <div className="md:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-muted/60 to-transparent" />
            </div>

            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-xs font-semibold text-white shadow-lg">
                <IconSparkles className="w-3 h-3" />
                Upcoming
              </div>
            </div>
          </CardItem>

          <CardItem
            translateZ={60}
            className="flex flex-col justify-center p-6 md:p-8 lg:p-10 w-full md:w-[55%]"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-4">
              <span className="flex items-center gap-1.5 text-accent font-medium">
                <IconCalendar className="w-4 h-4" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <IconMapPin className="w-4 h-4" />
                {event.location}
              </span>
            </div>

            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug transition-colors duration-300 group-hover:text-primary line-clamp-2">
              {event.title}
            </h4>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
              {event.description}
            </p>

            <CardItem translateZ={45}>
              <LumaCheckoutButton
                lumaUrl={event.lumaUrl || "https://lu.ma/SuperteamAU"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/25 text-sm font-semibold text-primary cursor-pointer transition-all duration-300 hover:bg-primary/20 hover:border-primary/40 hover:gap-3 active:scale-[0.97]"
              >
                Register Now
                <IconArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </LumaCheckoutButton>
            </CardItem>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

function PastEventCard({ event }: { event: Event }) {
  return (
    <CardContainer className="w-full">
      <CardBody className="group relative rounded-2xl border border-border/30 bg-muted/10 transition-all duration-500 hover:border-border/50 hover:bg-muted/20">
        <div className="flex flex-col md:flex-row md:h-[320px] [transform-style:preserve-3d]">
          <CardItem
            translateZ={30}
            className="relative w-full md:w-[40%] shrink-0 self-stretch"
          >
            <div className="relative w-full h-40 sm:h-48 md:h-full overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <Image
                src={event.image || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80"}
                alt={event.title || "Event"}
                fill
                className="object-cover transition-all duration-700 ease-out opacity-50 grayscale-[40%] group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-muted/30 to-transparent" />
              <div className="md:hidden absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-muted/40 to-transparent" />
            </div>

            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-border/40 text-xs font-medium text-muted-foreground">
                <IconClock className="w-3 h-3" />
                Completed
              </div>
            </div>
          </CardItem>

          <CardItem
            translateZ={50}
            className="flex flex-col justify-center p-6 md:p-8 w-full md:w-[60%]"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <IconCalendar className="w-3.5 h-3.5" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <IconMapPin className="w-3.5 h-3.5" />
                {event.location}
              </span>
            </div>

            <h4 className="text-lg md:text-xl font-semibold text-foreground/75 mb-2.5 leading-snug transition-colors duration-300 group-hover:text-foreground line-clamp-2">
              {event.title}
            </h4>

            <p className="text-muted-foreground/70 text-sm leading-relaxed line-clamp-2">
              {event.description}
            </p>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export default function Events({ events }: { events: Event[] }) {
  const upcomingEvents = events.filter((e) => e.type !== "past").slice(0, 3);
  const pastEvents = events.filter((e) => e.type === "past").slice(0, 3);

  const timelineData = [
    {
      title: "Upcoming",
      content: (
        <div className="space-y-6">
          {upcomingEvents.map((event) => (
            <UpcomingEventCard key={event.title} event={event} />
          ))}
        </div>
      ),
    },
    {
      title: "Past Events",
      content: (
        <div className="space-y-6">
          {pastEvents.map((event) => (
            <PastEventCard key={event.title} event={event} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="relative py-16 sm:py-24 md:py-36 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-4">
        <ScrollReveal
          tag="h2"
          baseRotation={3}
          blurStrength={4}
          baseOpacity={0.3}
          wordAnimationEnd="top bottom-=40%"
          containerClassName="mb-4"
          textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold text-center md:text-left"
        >
          Events
        </ScrollReveal>
        <ScrollReveal
          tag="div"
          baseRotation={3}
          blurStrength={6}
          baseOpacity={0.3}
          wordAnimationEnd="top center"
          containerClassName=""
          textClassName="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight text-center md:text-left"
        >
          Connect, Learn, Build
        </ScrollReveal>
      </div>

      <Timeline data={timelineData} />

      <div className="text-center mt-8">
        <a
          href="https://lu.ma/SuperteamAU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent/30 text-accent font-medium transition-[background-color,border-color,transform] duration-200 ease-out hover:bg-accent/10 hover:border-accent/50 active:scale-[0.97]"
        >
          View All Events on Luma
          <IconExternalLink className="w-4 h-4" />
        </a>
      </div>

      <LumaCheckoutScript />
    </div>
  );
}
