// App.jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

/**
 * NOTES:
 * - Put audio files in public/assets/music/tech-synth.mp3
 * - Put SFX files in public/assets/sfx/click.mp3 and public/assets/sfx/hover.mp3
 * - Tailwind + Framer Motion + shadcn ui expected to be configured
 */

const projects = [
  {
    name: "PathForge",
    description:
      "A grid based pathfinding module powered by A* search. Supports walls, clearance checks, and dynamic obstacles.",
    link: "https://github.com/setrawmetatable/PathForge",
  },
  {
    name: "Core-AA",
    description:
      "Roblox client-side anti-exploit with blacklist detection, CoreGui asset checks, and a built-in admin panel using Iris.",
    link: "https://github.com/setrawmetatable/Advanced-Anticheat",
  },
  {
    name: "Playlist Downloader",
    description:
      "App that allows you to download playlists in your preferred format. Choose between MP3 for audio downloads or MP4 for videos",
    link: "https://github.com/setrawmetatable/Youtube-Playlist-Downloader",
  },
  {
    name: "A* Pathfinding",
    description:
      "Demonstration of a high-performance A* pathfinding system built for complex mazes and dynamic obstacles.",
    link: "https://www.roblox.com/games/86965742818331/A-Pathfinding",
  },
  {
    name: "Bloodforged",
    description:
      "PVP driven shooter with fluid parkour movement and immersive weapon handling systems.",
    link: "https://www.roblox.com/games/139840680374565/Bloodforged",
  },
  {
    name: "Geogrande",
    description:
      "Fast paced geography quiz where quick thinking and knowledge win the round, loser gets eliminated.",
    link: "https://www.roblox.com/games/72833766195237/Geogrande",
  },
];

const skills = [
  { id: "lua", label: "Lua" },
  { id: "csharp", label: "C#" },
  { id: "htmlcss", label: "HTML/CSS" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
  { id: "modelling", label: "3D Modelling" },
];

const skillExplanations = {
  lua:
    "Lua - Lightweight scripting language commonly used in Roblox. Fast to iterate with and great for game logic, state machines, and embedded scripting.",
  csharp:
    "C# - A statically-typed language used for Unity, tools, and desktop apps. Great for scalable architecture, OOP, and performant logic.",
  htmlcss:
    "HTML/CSS - The backbone of the web. HTML structures content; CSS styles it. Together they form the visual and structural foundation of all websites and web apps.",
  cpp:
    "C++ - Systems and engine-level language. Used for performance-critical code, game engines, and low-level systems.",
  python:
    "Python - High-level scripting for tools, automation, and prototyping. Great for quick data processing and developer utilities.",
  modelling:
    "3D Modelling - Creating characters, props, and environments (Blender/3ds Max/Maya). I make game-ready assets and optimize geometry & UVs for performance.",
};

function useAudioControls(src, autoplayMuted = true) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(autoplayMuted);
  const [volume, setVolume] = useState(0.6);
  const [available, setAvailable] = useState(true);
  const [canAutoplay, setCanAutoplay] = useState(false); // track if autoplay succeeded

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.src = src;
    a.volume = volume;
    a.muted = muted;
    a.setAttribute('autoplay', '');
    if (muted) {
      a.setAttribute('muted', '');
    } else {
      a.removeAttribute('muted');
    }

    setMuted(false);
    setPlaying(true);

    const tryPlay = async () => {
      try {
        await a.play();
        setPlaying(true);
        setCanAutoplay(true); // autoplay succeeded
        // Unmute after a delay if muted
        if (muted) {
          setTimeout(() => {
            a.muted = false;
            setMuted(false);
          }, 1000);
        }
      } catch (e) {
        // Autoplay blocked
        setPlaying(false);
        setCanAutoplay(false); // autoplay blocked
      }
    };

    // Try autoplay on load
    tryPlay();

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [src, volume, muted, autoplayMuted]);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) {
        await a.play();
      } else {
        a.pause();
      }
      setPlaying(!a.paused);
    } catch (e) {
      console.warn("Play failed", e);
    }
  };

  const enableSound = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.muted = false;
      await a.play();
      setMuted(false);
      setPlaying(true);
      setCanAutoplay(true);
    } catch (e) {
      console.warn("Enable sound failed", e);
    }
  };

  return {
    audioRef,
    playing,
    muted,
    volume,
    setVolume,
    setMuted,
    togglePlay,
    enableSound,
    canAutoplay,
  };
}

export default function FusionWorkPortfolio() {
  // Loading screen state
  const [loading, setLoading] = useState(true);
  const [bootText, setBootText] = useState([]);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState(null);

  // skill modal
  const [activeSkill, setActiveSkill] = useState(null);

  // audio controls (autoplay muted)
  const audio = useAudioControls("/assets/music/tech-synth.mp3", true);

  // SFX refs
  const clickRef = useRef();
  const hoverRef = useRef();

  // Particles setup
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  // Loading terminal boot sequence
  useEffect(() => {
    let lines = [
      "FusionWork Engine v2.1 initializing...",
      " > Checking GPU microshaders...",
      " > Loading neural pathfinder module...",
      " > Loading audio driver (synthwave-mode)...",
      " > Spawning holographic renderer...",
      " > Mounting project database...",
      "Startup sequence complete.",
    ];

    let i = 0;
    let localLines = [];
    const typeDelay = 60;
    const progressInterval = 40;

    const typeNextLine = () => {
      if (!lines[i]) return;
      const full = lines[i];
      let idx = 0;
      const t = setInterval(() => {
        idx++;
        localLines[i] = full.slice(0, idx);
        setBootText([...localLines]);
        if (idx >= full.length) {
          clearInterval(t);
          i++;
          if (i < lines.length) {
            // short delay then type next
            setTimeout(typeNextLine, 250);
          }
        }
      }, typeDelay);
    };

    // Start typing
    typeNextLine();

    // Progress bar simulated
    let p = 0;
    const pTimer = setInterval(() => {
      p = Math.min(100, p + Math.random() * 6);
      setProgress(Math.round(p));
      if (p >= 100) {
        clearInterval(pTimer);
        // small delay then hide loading
        setTimeout(() => setLoading(false), 800);
      }
    }, progressInterval);

    return () => clearInterval(pTimer);
  }, []);

  // click sfx
  const playClick = () => {
    audio.enableSound();
    
    try {
      clickRef.current && clickRef.current.play();
    } catch {}
  };
  const playHover = () => {
    audio.enableSound();

    try {
      hoverRef.current && hoverRef.current.play();
    } catch {}
  };

  // UI variants
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, type: "spring", stiffness: 90 },
    }),
  };

  useEffect(() => {
    const handleClick = () => {
      // If you want to control the music playback
      if (!audio.playing) {
        audio.togglePlay(); // toggle to play
      }
    };
  
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [audio]);

  return (
    <div className="min-h-screen relative font-sans text-white bg-gradient-to-b from-gray-950 to-gray-900 overflow-x-hidden">
      {/* Audio element (hidden) */}
      <audio
        ref={audio.audioRef}
        src="/assets/music/tech-synth.mp3"
        loop
        preload="auto"
      />

      {/* sfx */}
      <audio ref={clickRef} src="/assets/sfx/click.mp3" preload="auto" />
      <audio ref={hoverRef} src="/assets/sfx/hover.mp3" preload="auto" />

      <AnimatePresence>
      {notification && (
        <motion.div
          key="notification"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            bounce: 0.2,
            duration: 0.5,
          }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
        >
          {notification}
        </motion.div>
      )}
    </AnimatePresence>

      {/* Particles background */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 45, density: { enable: true, area: 800 } },
            color: { value: "#2dd4bf" },
            shape: { type: "circle" },
            opacity: { value: 0.08 },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.6, outModes: { default: "bounce" } },
            links: { enable: true, distance: 160, color: "#0ea5a4", opacity: 0.06, width: 1 },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } },
            modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
          },
        }}
        className="pointer-events-none absolute inset-0 -z-10"
      />

      {/* Loading Screen - Terminal Boot Sequence */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          >
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-3xl mx-6 md:mx-0 bg-gradient-to-br from-black/80 to-slate-900/70 border border-slate-800 p-6 rounded-xl shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-cyan-400 font-mono font-semibold tracking-wider text-xl">FusionWork</div>
                  <div className="text-gray-400 text-xs mt-1">Engine boot - terminal startup</div>
                </div>
                <div className="text-sm text-gray-400">v2.1 - Phoenix</div>
              </div>

              <div className="mt-6 bg-slate-900 p-4 rounded text-slate-200 font-mono text-sm min-h-[160px]">
                {/* terminal lines */}
                {bootText.map((line, idx) => (
                  <div key={idx} className="leading-6">
                    <span className="text-cyan-300">{"» "}</span>
                    <span>{line}</span>
                  </div>
                ))}

                {/* progress bar */}
                <div className="mt-4">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${progress}%`, transition: "width 0.2s linear" }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-400 mt-1">Initializing... {progress}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-3 items-center">
                  <Button
                    onMouseEnter={playHover}
                    onClick={() => {
                      // toggle audio attempt
                      audio.enableSound();
                      playClick();
                    }}
                    className="px-4 py-2"
                  >
                    {audio.playing ? "Pause Music" : "Play Music"}
                  </Button>

                  {/* if audio unavailable (blocked) show enable button */}
                  {!audio.available && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        audio.enableSound();
                        playClick();
                      }}
                      className="px-4 py-2"
                    >
                      Enable Sound
                    </Button>
                  )}
                </div>

                <div className="text-sm text-gray-400">Pressing Enable Sound may be required on some browsers</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SITE */}
      {!loading && (
        <>
          {/* top nav */}
          <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-black/40 backdrop-blur rounded-full px-4 py-2 border border-slate-800 shadow-md">
            <div className="flex items-center gap-4">
              <a href="#about" className="text-sm text-cyan-300 hover:underline" onMouseEnter={playHover}>About</a>
              <a href="#projects" className="text-sm text-cyan-300 hover:underline" onMouseEnter={playHover}>Projects</a>
              <a href="#skills" className="text-sm text-cyan-300 hover:underline" onMouseEnter={playHover}>Skills</a>
              <a href="#contact" className="text-sm text-cyan-300 hover:underline" onMouseEnter={playHover}>Contact</a>
            </div>
          </nav>

          {/* Header */}
          <header className="pt-24 pb-16 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500"
            >
              FusionWork
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-3 text-gray-300">
              Code that thinks faster - <span className="text-cyan-400">Phoenix</span> · 17 · 5 years experience
            </motion.p>

            {/* music controls (bottom-right floating) */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
              <div
                className="flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-2 rounded-full border border-slate-800 shadow"
                onMouseEnter={playHover}
              >
                <button
                  onClick={() => {
                    audio.togglePlay();
                    playClick();
                  }}
                  className="px-3 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/60"
                >
                  {audio.playing ? "⏸" : "▶"}
                </button>

                <div className="flex gap-2 items-center">
                  <input
                    aria-label="volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={audio.volume}
                    onChange={(e) => {
                      audio.setVolume(parseFloat(e.target.value));
                    }}
                    className="w-28"
                  />
                </div>

                <button
                  className="px-2 py-1 rounded-md"
                  onClick={() => {
                    audio.setMuted(!audio.muted);
                    playClick();
                  }}
                >
                  {audio.muted ? "🔇" : "🔊"}
                </button>
              </div>
            </div>
          </header>

          {/* About */}
          <section id="about" className="px-6 md:px-20 py-12">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-slate-800 rounded-2xl shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-36 h-36 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center border border-slate-800">
                      <div className="text-center">
                        <div className="text-cyan-300 font-bold text-xl">Phoenix</div>
                        <div className="text-gray-300 text-xs">17 · Developer</div>
                        <div className="text-gray-400 text-xs mt-1">5 Years</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-cyan-300">About Me</h3>
                      <p className="text-gray-300 mt-3 leading-relaxed">
                        I'm Phoenix, I build systems and mechanics that feel alive. I focus on performance, clean architecture, and immersive design. I create complex systems, custom controllers, and advanced anticheats, and also develop applications, AI, and tools when needed. Lead developer of a project aiming to create the first Minecraft AI bot capable of beating the game from start to finish.
                      </p>

                      <div className="mt-4 flex gap-3">
                        <Button
                          onMouseEnter={playHover}
                          onClick={() => {
                            const el = document.getElementById("projects");
                            el && el.scrollIntoView({ behavior: "smooth" });
                            playClick();
                          }}
                        >
                          View Projects
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            const el = document.getElementById("contact");
                            el && el.scrollIntoView({ behavior: "smooth" });
                            playClick();
                          }}
                        >
                          Contact Me
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Projects */}
          <section id="projects" className="px-6 md:px-20 py-12">
            <h2 className="text-3xl font-semibold text-cyan-400 text-center mb-8">Projects</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((p, i) => (
                <motion.div key={p.name} custom={i} variants={cardVariant} initial="hidden" animate="show">
                  <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl hover:scale-[1.01] transition-transform">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-cyan-300">{p.name}</h3>
                      <p className="text-gray-300 text-sm mt-2">{p.description}</p>
                      <div className="mt-4 flex gap-3">
                        <a href={p.link} target="_blank" rel="noreferrer" className="inline-block">
                          <Button
                            onMouseEnter={playHover}
                            onClick={() => playClick()}
                            className="px-3 py-2"
                          >
                            Open
                          </Button>
                        </a>
                        <Button
                      variant="ghost"
                      onMouseEnter={playHover}
                      onClick={() => {
                        navigator.clipboard?.writeText(p.link);
                        setNotification("Link copied to clipboard!");
                        playClick();
                        setTimeout(() => setNotification(null), 2000); // hide after 2 sec
                      }}
                    >
                      Copy Link
                    </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="px-6 md:px-20 py-12 bg-gray-950 border-t border-gray-800">
            <h2 className="text-3xl font-semibold text-cyan-400 text-center mb-8">Skills</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((s, idx) => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={playHover}
                  onClick={() => {
                    setActiveSkill(s.id);
                    playClick();
                  }}
                  className="bg-gray-800/60 px-5 py-2 rounded-full border border-gray-700 hover:border-cyan-400 transition"
                >
                  {s.label}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Contact */}
          <footer id="contact" className="px-6 md:px-20 py-12 text-center bg-gray-900 border-t border-gray-800">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Contact</h2>
            <p className="text-gray-300">Email: <a className="text-cyan-300 hover:underline" href="mailto:contact@fusionwork.tech">contact@fusionwork.tech</a></p>
            <p className="text-gray-300 mt-2">Discord: <span className="text-cyan-300 select-all">setreadonly</span></p>
            <div className="mt-8 text-gray-500">© {new Date().getFullYear()} FusionWork - Phoenix</div>
          </footer>

          {/* Skill modal */}
          <AnimatePresence>
            {activeSkill && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setActiveSkill(null)}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-2xl mx-4 bg-slate-900 rounded-2xl border border-slate-800 p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl text-cyan-300 font-semibold">{skills.find(s => s.id === activeSkill)?.label}</h3>
                      <p className="text-gray-300 mt-3">{skillExplanations[activeSkill]}</p>
                    </div>
                    <div>
                      <Button onClick={() => { setActiveSkill(null); playClick(); }}>Close</Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
