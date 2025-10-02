import type { Dispatch, SetStateAction } from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";
import { toast } from "sonner";

interface JoinFormProps {
  setGameId: Dispatch<SetStateAction<string | undefined>>;
  gameId: string | undefined;
}

function JoinFormContents(props: JoinFormProps) {
  const handleInput = (code: string) => {
    if (code.length !== 4) return;

    props.setGameId(code);
  };

  const hostGame = async () => {
    let response = await fetch("/api/games/", { method: "POST" });

    if (!response.ok) {
      toast.error(`Recieved invalid response: ${response.statusText}`);
      return;
    }

    let text = await response.text();

    if (text.length !== 4) {
      toast.error(`Recieved invalid response: ${text}`);
      return;
    }

    props.setGameId(text);
    toast.info(`Your game code is ${text}!`)
  }

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
        <JoinFormContents gameId={props.gameId} setGameId={props.setGameId} />
      </div>
    </div>
  );
}
