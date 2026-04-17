"use client";

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const NUM_COLS = 5;
const COL_DURATION = 0.55;
const COL_STAGGER = 0.08;
const SCROLL_KEY_PREFIX = "stairs-scroll:";

interface StairsContextType {
  navigateWithStairs: (path: string, scrollTo?: string) => void;
}

const StairsContext = createContext<StairsContextType>({
  navigateWithStairs: () => {},
});

export function useStairsNavigation() {
  return useContext(StairsContext);
}

export function StairsTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const colsRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const navigateWithStairs = useCallback(
    (path: string, scrollTo?: string) => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const el = colsRef.current;
      if (!el) {
        router.push(path, { scroll: false });
        animatingRef.current = false;
        return;
      }

      try {
        const scrollY =
          (window as unknown as { __lenis?: { scroll: number } }).__lenis
            ?.scroll ?? window.scrollY;
        sessionStorage.setItem(SCROLL_KEY_PREFIX + pathname, String(scrollY));
      } catch {
      }

      const cols = Array.from(el.children) as HTMLElement[];
      gsap.set(cols, { height: 0, top: 0, force3D: true });

      router.prefetch(path);

      gsap.to(cols, {
        height: "100vh",
        duration: COL_DURATION,
        stagger: COL_STAGGER,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(path, { scroll: false });
          const pushedAt = performance.now();

          const MIN_COVERED_MS = 300;

          function revealWhenPainted() {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const elapsed = performance.now() - pushedAt;
                if (elapsed < MIN_COVERED_MS) {
                  revealWhenPainted();
                  return;
                }

                function finishTransition() {
                  requestAnimationFrame(() => {
                    gsap.to(cols, {
                      top: "100vh",
                      duration: COL_DURATION,
                      stagger: COL_STAGGER,
                      ease: "power3.inOut",
                      onComplete: () => {
                        gsap.set(cols, { height: 0, top: 0 });
                        animatingRef.current = false;
                      },
                    });
                  });
                }

                if (scrollTo) {
                  let savedScrollY: number | null = null;
                  try {
                    const key = SCROLL_KEY_PREFIX + path;
                    const raw = sessionStorage.getItem(key);
                    if (raw) {
                      savedScrollY = parseFloat(raw);
                      sessionStorage.removeItem(key);
                    }
                  } catch {
                  }

                  if (savedScrollY != null && savedScrollY > 0) {
                    const startTime = performance.now();
                    const MAX_WAIT_MS = 5000;

                    function applyScroll(y: number) {
                      window.scrollTo(0, y);
                      if (window.__lenis) {
                        (window.__lenis as any).setScroll(y);
                        (window.__lenis as any).targetScroll = y;
                      }
                    }

                    function waitForHeight() {
                      const docHeight =
                        document.documentElement.scrollHeight;
                      const needed = savedScrollY! + window.innerHeight;

                      if (docHeight >= needed) {
                        applyScroll(savedScrollY!);
                        requestAnimationFrame(() => {
                           applyScroll(savedScrollY!);
                           finishTransition();
                        });
                      } else if (
                        performance.now() - startTime > MAX_WAIT_MS
                      ) {
                        const clampedY = Math.max(
                          0,
                          docHeight - window.innerHeight
                        );
                        applyScroll(clampedY);
                        finishTransition();
                      } else {
                        requestAnimationFrame(waitForHeight);
                      }
                    }
                    requestAnimationFrame(waitForHeight);
                  } else {
                    const attemptScroll = (attemptsLeft: number) => {
                      const target = document.querySelector<HTMLElement>(scrollTo);
                      if (target) {
                        if (window.__lenis) {
                          window.__lenis.scrollTo(target, {
                            immediate: true,
                          });
                        } else {
                          target.scrollIntoView({
                            behavior: "instant" as ScrollBehavior,
                          });
                        }
                        
                        requestAnimationFrame(() => {
                           if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
                           finishTransition();
                        });
                      } else if (attemptsLeft > 0) {
                        setTimeout(
                          () => attemptScroll(attemptsLeft - 1),
                          50
                        );
                      } else {
                        window.__lenis?.scrollTo(0, { immediate: true }) ||
                          window.scrollTo(0, 0);
                        finishTransition();
                      }
                    };
                    attemptScroll(40);
                  }
                } else {
                  window.__lenis?.scrollTo(0, { immediate: true }) ||
                    window.scrollTo(0, 0);
                  finishTransition();
                }
              });
            });
          }

          revealWhenPainted();
        },
      });
    },
    [router, pathname]
  );

  return (
    <StairsContext.Provider value={{ navigateWithStairs }}>
      {children}
      <div
        ref={colsRef}
        className="fixed inset-0 z-[60] flex items-start pointer-events-none"
      >
        {Array.from({ length: NUM_COLS }).map((_, i) => (
          <div
            key={i}
            className="relative h-0 flex-1 bg-background will-change-transform"
          />
        ))}
      </div>
    </StairsContext.Provider>
  );
}
