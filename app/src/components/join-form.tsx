import type { Dispatch, SetStateAction } from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./ui/input-otp";

interface JoinFormProps {
  setGameCode: Dispatch<SetStateAction<string | undefined>>;
  gameCode: string | undefined;
  setConnected: Dispatch<SetStateAction<boolean>>;
}

function JoinFormContents(props: JoinFormProps) {
  const handleInput = (code: string) => {
    if (code.length !== 4) return;

    props.setGameCode(code);

    initiateWebSocket(code);
  };

  const initiateWebSocket = (code: string) => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = window.location.host;
      const wsUrl = `${protocol}://${host}/games/ws/${code}`;
      console.log("Connecting to WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        toast.success(`Successfully connected to game ${code}!`);
        props.setConnected(true);
      };

      ws.onmessage = (event) => {
        console.log("Message from server:", event.data);
      };

      ws.onclose = () => {
        toast.warning(`Disconnected from game ${code}.`);
        props.setConnected(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error(`Failed to connect to game ${code}. Check console.`);
        props.setConnected(false);
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      toast.error("Could not create WebSocket connection.");
    }
  };

  const hostGame = async () => {
    let response = await fetch("/games/", { method: "POST" });

    if (!response.ok) {
      toast.error(`Recieved invalid response: ${response.statusText}`);
      return;
    }

    let text = await response.text();

    if (text.length !== 4) {
      toast.error(`Recieved invalid response: ${text}`);
      return;
    }

    props.setGameCode(text);
    toast.info(`Your game code is ${text}!`);

    initiateWebSocket(text);
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>
            Enter your game join code, or host a game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <InputOTP maxLength={4} onChange={handleInput}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <Button className="w-full" onClick={hostGame}>
              Host
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinForm(props: JoinFormProps) {
  return (
    <div id="join-form">
      <div className="flex w-full max-w-sm flex-col gap-6 mb-2">
        <a className="flex items-center gap-2 self-center font-medium" href="#">
          <Logo size={8} />
          <span>prime-chess</span>
        </a>
      </div>
      <div className={"flex flex-col gap-6"}>
        <JoinFormContents gameCode={props.gameCode} setGameCode={props.setGameCode} setConnected={props.setConnected}/>
      </div>
    </div>
  );
}
