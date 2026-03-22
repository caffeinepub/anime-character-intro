import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const characters = [
  {
    name: "Mizuki Hoshina",
    trait: "Blue Hair • Slim & Fit • 6ft",
    image: "/assets/uploads/Mizuki-Hoshina-1.jpg",
    color: "#3b82f6",
  },
  {
    name: "Haru Minazuki",
    trait: "Yellow Hair • Slim & Fit • 5.5ft",
    image: "/assets/uploads/Haru-Minazuki-2.jpg",
    color: "#eab308",
  },
  {
    name: "Ren Suikage",
    trait: "Black Hair • Slim & Thick • 6ft",
    image: "/assets/uploads/Ren-Suikage--3.jpg",
    color: "#f97316",
  },
  {
    name: "Emi Kisaragi",
    trait: "Black Hair • Chubby • 5.6ft",
    image: "/assets/uploads/Emi-Kisaragi-4.jpg",
    color: "#ec4899",
  },
  {
    name: "Suijin Arashi",
    trait: "Red Hair • Aggressive & Fit • 6ft",
    image: "/assets/uploads/Suijin-Arashi-5.jpg",
    color: "#ef4444",
  },
  {
    name: "Yuna Shirohana",
    trait: "Yellow Hair • Thin • 5.9ft",
    image: "/assets/uploads/Yuna-Shirohana-6.jpg",
    color: "#f59e0b",
  },
  {
    name: "Raito Aokawa",
    trait: "Blue Hair • Slim & Fit • 6ft",
    image: "/assets/uploads/Raito-Aokawa-7.jpg",
    color: "#6366f1",
  },
  {
    name: "Sakura Amayori",
    trait: "Green Hair • Gym Body • 5.8ft",
    image: "/assets/uploads/Sakura-Amayori-8.jpg",
    color: "#22c55e",
  },
  {
    name: "Airi Hanazora",
    trait: "Red Hair • Slim & Fit • 6ft",
    image: "/assets/uploads/Airi-Hanazora-9.jpg",
    color: "#f43f5e",
  },
  {
    name: "Kaizen Mizuryu",
    trait: "Green Hair • Gym Muscles • 6ft",
    image: "/assets/uploads/Kaizen-Mizuryu-10.jpg",
    color: "#10b981",
  },
];

const REVEAL_DURATION = 2500;
const AUTO_ADVANCE = 5000;

function Particles({ color }: { color: string }) {
  const particles = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((i) => {
        const left = 10 + Math.random() * 80;
        const bottom = 5 + Math.random() * 40;
        const delay = Math.random() * 2.5;
        const dur = 1.8 + Math.random() * 1.5;
        const size = 3 + Math.random() * 6;
        const dx = (Math.random() - 0.5) * 60;
        return (
          <div
            key={i}
            style={
              {
                position: "absolute",
                left: `${left}%`,
                bottom: `${bottom}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px 2px ${color}88`,
                animation: `particle-float ${dur}s ${delay}s ease-out infinite`,
                "--dx": `${dx}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function SpeedLines({ color }: { color: string }) {
  const lines = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {lines.map((i) => {
        const top = (i / 20) * 100;
        const width = 40 + Math.random() * 50;
        const delay = Math.random() * 0.4;
        const thickness = 1 + Math.random() * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${top}%`,
              left: 0,
              width: `${width}%`,
              height: thickness,
              background: `linear-gradient(to right, transparent, ${color}66, transparent)`,
              animation: `speed-line-out 0.7s ${delay}s cubic-bezier(0.22,1,0.36,1) forwards`,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}

function MouthOverlay({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "32%",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 20,
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
    >
      <svg
        role="img"
        aria-label="Talking mouth animation"
        width="60"
        height="36"
        viewBox="-22 -14 44 30"
        style={{ overflow: "visible" }}
      >
        <ellipse cx="0" cy="4" rx="18" ry="10" fill="#fff" opacity="0.92" />
        <ellipse cx="0" cy="10" rx="9" ry="5" fill="#e87a8a" opacity="0.8" />
        <path
          d="M -18 0 Q 0 0 18 0"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ animation: "mouth-flap 0.12s steps(1) infinite" }}
        />
        <path
          d="M -18 0 Q 0 0 18 0"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ animation: "mouth-top-flap 0.12s steps(1) infinite" }}
        />
        <ellipse
          cx="0"
          cy="3"
          rx="18"
          ry="12"
          fill="none"
          stroke="#1a0a0a"
          strokeWidth="2"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

function useTypewriter(text: string, duration: number, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    setDisplayed("");
    setDone(false);
    const total = text.length;
    const interval = duration / total;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= total; i++) {
      const t = setTimeout(() => {
        setDisplayed(text.slice(0, i));
        if (i === total) setDone(true);
      }, interval * i);
      timers.push(t);
    }
    return () => timers.forEach(clearTimeout);
  }, [text, duration, active]);

  return { displayed, done };
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [sweeping, setSweeping] = useState(false);
  const [speedLines, setSpeedLines] = useState(false);
  const [typing, setTyping] = useState(true);
  const [particleKey, setParticleKey] = useState(0);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const char = characters[current];
  const { displayed, done } = useTypewriter(char.name, REVEAL_DURATION, typing);

  const goTo = useCallback((idx: number) => {
    if (autoRef.current) clearTimeout(autoRef.current);
    setSweeping(true);
    setSpeedLines(false);
    setTyping(false);
    setTimeout(() => {
      setCurrent(idx);
      setParticleKey((k) => k + 1);
      setSweeping(false);
      setSpeedLines(true);
      setTyping(true);
      setTimeout(() => setSpeedLines(false), 900);
    }, 350);
  }, []);

  const next = useCallback(
    () => goTo((current + 1) % characters.length),
    [current, goTo],
  );
  const prev = useCallback(
    () => goTo((current - 1 + characters.length) % characters.length),
    [current, goTo],
  );
  const replay = useCallback(() => goTo(0), [goTo]);

  useEffect(() => {
    autoRef.current = setTimeout(next, AUTO_ADVANCE);
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [next]);

  useEffect(() => {
    setSpeedLines(true);
    const t = setTimeout(() => setSpeedLines(false), 900);
    return () => clearTimeout(t);
  }, []);

  const fromLeft = current % 2 === 0;
  const numLabel = String(current + 1).padStart(2, "0");

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{
        background: "#0a0a0f",
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes mouth-flap {
          0%   { d: path('M -18 0 Q 0 2 18 0'); }
          16%  { d: path('M -18 0 Q 0 10 18 0'); }
          33%  { d: path('M -18 0 Q 0 18 18 0'); }
          50%  { d: path('M -18 0 Q 0 22 18 0'); }
          66%  { d: path('M -18 0 Q 0 14 18 0'); }
          83%  { d: path('M -18 0 Q 0 6 18 0'); }
          100% { d: path('M -18 0 Q 0 2 18 0'); }
        }
        @keyframes mouth-top-flap {
          0%   { d: path('M -18 0 Q 0 -2 18 0'); }
          16%  { d: path('M -18 0 Q 0 -10 18 0'); }
          33%  { d: path('M -18 0 Q 0 -18 18 0'); }
          50%  { d: path('M -18 0 Q 0 -22 18 0'); }
          66%  { d: path('M -18 0 Q 0 -14 18 0'); }
          83%  { d: path('M -18 0 Q 0 -6 18 0'); }
          100% { d: path('M -18 0 Q 0 -2 18 0'); }
        }
        @keyframes particle-float {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-140px) translateX(var(--dx, 20px)) scale(0.1); opacity: 0; }
        }
        @keyframes speed-line-out {
          0%   { opacity: 0; width: 0%; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.4; width: 100%; }
          100% { opacity: 0; width: 100%; }
        }
        @keyframes sweep-across {
          0%   { transform: translateX(-100%); opacity: 1; }
          55%  { transform: translateX(0%); opacity: 1; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.1); }
        }
        @keyframes enter-left {
          from { transform: translateX(-160px) scale(0.92); opacity: 0; filter: blur(12px); }
          to   { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes enter-right {
          from { transform: translateX(160px) scale(0.92); opacity: 0; filter: blur(12px); }
          to   { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes number-pop {
          from { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes trait-fade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>

      {/* Background glow aura */}
      <div
        key={`glow-${current}`}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70vw",
          height: "75vh",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center bottom, ${char.color}55 0%, ${char.color}22 40%, transparent 70%)`,
          animation: "glow-pulse 2.5s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Sweep line transition */}
      <AnimatePresence>
        {sweeping && (
          <div
            key="sweep"
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent 20%, ${char.color}cc 50%, transparent 80%)`,
              animation:
                "sweep-across 0.55s cubic-bezier(0.4,0,0.2,1) forwards",
              zIndex: 50,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {speedLines && <SpeedLines color={char.color} />}

      {/* Character number top right */}
      <div
        key={`num-${current}`}
        style={{
          position: "absolute",
          top: 28,
          right: 36,
          zIndex: 10,
          animation: "number-pop 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
          textAlign: "right",
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: char.color,
            lineHeight: 1,
            letterSpacing: "-2px",
            textShadow: `0 0 20px ${char.color}99`,
          }}
        >
          {numLabel}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#ffffff55",
            marginLeft: 4,
          }}
        >
          / {String(characters.length).padStart(2, "0")}
        </span>
      </div>

      {/* Character image area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Particles color={char.color} key={particleKey} />

        <div
          key={`img-${current}`}
          style={{
            position: "relative",
            height: "82vh",
            maxHeight: 700,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            animation: fromLeft
              ? "enter-left 0.65s cubic-bezier(0.22,1,0.36,1) forwards"
              : "enter-right 0.65s cubic-bezier(0.22,1,0.36,1) forwards",
          }}
        >
          <img
            src={char.image}
            alt={char.name}
            style={{
              height: "100%",
              width: "auto",
              maxWidth: "min(480px, 90vw)",
              objectFit: "contain",
              objectPosition: "bottom",
              display: "block",
              filter: `drop-shadow(0 0 32px ${char.color}66) drop-shadow(0 0 80px ${char.color}33)`,
              position: "relative",
              zIndex: 2,
            }}
          />
          <MouthOverlay color={char.color} active={!done} />
        </div>
      </div>

      {/* Bottom info + controls */}
      <div
        style={{ position: "relative", zIndex: 10, padding: "16px 32px 32px" }}
      >
        {/* Name typewriter */}
        <div
          style={{
            marginBottom: 6,
            minHeight: 72,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#ffffff",
              textShadow: `0 0 40px ${char.color}cc, 0 2px 0 #00000088`,
              lineHeight: 1,
              margin: 0,
            }}
          >
            {displayed}
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: "0.85em",
                background: char.color,
                marginLeft: 4,
                verticalAlign: "baseline",
                animation: done
                  ? "none"
                  : "blink-cursor 0.6s steps(1) infinite",
                opacity: done ? 0 : 1,
              }}
            />
          </h1>
        </div>

        {/* Trait */}
        {done && (
          <div
            key={`trait-${current}`}
            style={{
              animation: "trait-fade 0.6s ease forwards",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.85rem, 2.2vw, 1.1rem)",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: char.color,
                textShadow: `0 0 16px ${char.color}88`,
              }}
            >
              {char.trait}
            </span>
          </div>
        )}

        {/* Progress dots */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {characters.map((c, i) => (
              <button
                type="button"
                key={c.name}
                data-ocid={`intro.item.${i + 1}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${c.name}`}
                style={{
                  width: i === current ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: i === current ? c.color : "#ffffff33",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: i === current ? `0 0 10px ${c.color}` : "none",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Auto-progress bar */}
          <div
            style={{
              width: "100%",
              height: 2,
              background: "#ffffff18",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              key={`bar-${current}`}
              style={{
                height: "100%",
                background: char.color,
                transformOrigin: "left",
                animation: `progress-fill ${AUTO_ADVANCE}ms linear forwards`,
                boxShadow: `0 0 6px ${char.color}`,
              }}
            />
          </div>
        </div>

        {/* Nav controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            data-ocid="intro.pagination_prev"
            onClick={prev}
            aria-label="Previous character"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: `2px solid ${char.color}77`,
              background: `${char.color}18`,
              color: char.color,
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: `0 0 12px ${char.color}44`,
            }}
          >
            ◀
          </button>

          <button
            type="button"
            data-ocid="intro.pagination_next"
            onClick={next}
            aria-label="Next character"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: `2px solid ${char.color}77`,
              background: `${char.color}18`,
              color: char.color,
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: `0 0 12px ${char.color}44`,
            }}
          >
            ▶
          </button>

          <button
            type="button"
            data-ocid="intro.primary_button"
            onClick={replay}
            style={{
              padding: "10px 28px",
              borderRadius: 999,
              border: `2px solid ${char.color}88`,
              background: "transparent",
              color: char.color,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: `0 0 16px ${char.color}44`,
              fontFamily: "inherit",
            }}
          >
            ↺ Replay
          </button>

          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#ffffff44",
              }}
            >
              CHARACTER INTRO
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{ fontSize: 10, color: "#ffffff22", letterSpacing: "0.1em" }}
        >
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff44", textDecoration: "underline" }}
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </div>
  );
}
