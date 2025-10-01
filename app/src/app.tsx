import { useState } from "react";
import "./app.css";
import { ThemeProvider } from "./components/theme-provider";
import JoinForm from "./components/join-form";

export default function App() {
  const [gameId, setGameId] = useState<string | undefined>(undefined);

  return (
    <ThemeProvider defaultTheme="dark">
      <div id="app" className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        {!gameId && <JoinForm gameId={gameId} setGameId={setGameId} />}
      </div>
    </ThemeProvider>
  );
}
