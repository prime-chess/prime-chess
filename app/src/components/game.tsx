import Logo from "./logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface GameFormProps {
  gameCode: string | undefined,
}

function GameContents(props: GameFormProps) {
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
            <CardTitle>Game</CardTitle>
            <CardDescription>{props.gameCode}</CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardContent>
                <div className="grow aspect-square"></div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Game(props: GameFormProps) {
  return (
    <div id="game">
      <div className="flex w-full max-w-lg flex-col gap-6 mb-2">
        <a className="flex items-center gap-2 self-center font-medium" href="#">
          <Logo size={8} />
          <span>prime-chess</span>
        </a>
      </div>
      <div className={"flex flex-col gap-6"}>
        <GameContents gameCode={props.gameCode} />
      </div>
    </div>
  );
}
