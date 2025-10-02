import { useState } from "react";
import "./app.css";
import { ThemeProvider } from "./components/theme-provider";
import JoinForm from "./components/join-form";
import { Toaster } from "./components/ui/sonner";
import Game from "./components/game";

export default function App() {
  const [gameCode, setGameCode] = useState<string | undefined>(undefined);
  const [connected, setConnected] = useState<boolean>(false);

  return (
    <ThemeProvider defaultTheme="dark">
      <div
        id="app"
        className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
      >
        {!connected && <JoinForm gameCode={gameCode} setGameCode={setGameCode} setConnected={setConnected}/>}
        {connected && <Game gameCode={gameCode}/>}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
