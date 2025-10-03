import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import { Card, CardContent, CardHeader } from "./ui/card";

interface GameFormProps {
  gameCode: string | undefined;
}

interface BoardProps {
  position: string;
}

function Board(props: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<
    [number, number] | undefined
  >();

  const lightColor = "#f0d9b5";
  const darkColor = "#b58863";
  const highlightColor = "rgba(255, 255, 0, 0.5)";

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const logicalWidth = rect.width;
    const logicalHeight = rect.height;
    const size = Math.min(logicalWidth, logicalHeight);

    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cell = size / 8;

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (rank + file) % 2 === 0;
        ctx.fillStyle = isLight ? lightColor : darkColor;
        ctx.fillRect(file * cell, rank * cell, cell, cell);
      }
    }

    ctx.font = `${Math.max(10, Math.floor(cell * 0.16))}px sans-serif`;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.textBaseline = "top";

    for (let f = 0; f < 8; f++) {
      const ch = String.fromCharCode("a".charCodeAt(0) + f);
      ctx.fillText(ch, f * cell + 2, size - cell * 0.18 - 2);
    }

    if (selectedSquare) {
      const [selRank, selFile] = selectedSquare;
      ctx.fillStyle = highlightColor;
      ctx.fillRect(selFile * cell, selRank * cell, cell, cell);
    }
  };

  useEffect(() => {
    draw();
  }, [selectedSquare]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      draw();
    });
    ro.observe(canvas.parentElement ?? canvas);

    draw();

    return () => {
      ro.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const cell = size / 8;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let file = Math.floor(x / cell);
    let rank = Math.floor(y / cell);

    file = Math.max(0, Math.min(7, file));
    rank = Math.max(0, Math.min(7, rank));

    setSelectedSquare([rank, file]);
  };

  return (
    <div className="w-full h-full rounded-md">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "manipulation",
        }}  
        className="rounded-md"
      />
    </div>
  );
}

function GameContents(props: GameFormProps) {
  return (
    <div className={"rounded-none w-full h-full"}>
      <Card className="rounded-none w-full h-full">
        <CardHeader className="w-full h-12 flex-row justify-center items-center inline-flex">
          <Logo size={10} />
        </CardHeader>
        <CardContent className="flex flex-row gap-6 w-full h-full">
          <Card className="grow"></Card>
          <Card className="h-full aspect-square m-0 p-0 shrink">
            <Board position={""} />
          </Card>
          <Card className="grow"></Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Game(props: GameFormProps) {
  return (
    <div id="game" className="w-full h-full rounded-none">
      <div className={"flex flex-col gap-6 w-full h-full"}>
        <GameContents gameCode={props.gameCode} />
      </div>
    </div>
  );
}
