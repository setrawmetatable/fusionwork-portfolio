import { motion } from "framer-motion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

export default function FusionWorkPortfolio() {
  const projects = [
    {
      name: "A* Pathfinding",
      description:
        "Game made to show my advanced A* Pathfinding System, which can find paths EXTREMELY fast in a complicated maze.",
      link: "https://www.roblox.com/games/86965742818331/A-Pathfinding",
    },
    {
      name: "Bloodforged",
      description:
        "A thrilling game of murderers and innocents featuring realistic movement, parkour mechanics, and immersive weapon handling. Includes PvP modes where everyone becomes the hunter.",
      link: "https://www.roblox.com/games/139840680374565/Bloodforged",
    },
    {
      name: "Geogrande",
      description:
        "A geography quiz game where players race to answer correctly or face elimination. Earn wins and prove your world knowledge under pressure!",
      link: "https://www.roblox.com/games/72833766195237/Geogrande",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white font-sans">
      {/* Header */}
      <header className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
        >
          FusionWork
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-300"
        >
          Code That Thinks Faster
        </motion.p>
      </header>

      {/* Projects Section */}
      <section className="px-6 md:px-20 py-10">
        <h2 className="text-3xl font-semibold mb-8 text-center text-cyan-400">Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <Card className="bg-gray-800 border border-gray-700 hover:border-cyan-500 transition-all duration-300 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-cyan-300">{project.name}</h3>
                  <p className="text-gray-300 mb-5 text-sm leading-relaxed">{project.description}</p>
                  <Button asChild variant="outline" className="border-cyan-400 text-cyan-300 hover:bg-cyan-500/20">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="px-6 md:px-20 py-16 bg-gray-950 border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-400">Skills</h2>
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          {["Lua", "C#", "HTML/CSS", "Simple C++", "Python"].map((skill, i) => (
            <span
              key={i}
              className="bg-gray-800 px-4 py-2 rounded-full border border-gray-700 hover:border-cyan-400 transition-all"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <footer className="py-16 text-center bg-gray-900 border-t border-gray-800">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Contact</h2>
        <p className="text-gray-300 text-lg">
          Reach out at <a href="mailto:contact@fusionwork.tech" className="text-cyan-400 hover:underline">contact@fusionwork.tech</a>
        </p>
      </footer>
    </div>
  );
}
