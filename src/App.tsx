import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TacticalConsole from "./features/dashboard/TacticalConsole";

export default function App() {
  return (
    <div className="cyber-shell">
      <Navbar />

      <main className="relative z-10 flex-1 min-h-screen max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <TacticalConsole />
      </main>

      <Footer />
    </div>
  );
}
