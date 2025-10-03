import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import { Card, CardHeader, CardContent } from "./ui/card";

interface GameFormProps {
  gameCode: string | undefined;
  times: [string, string];
}

interface BoardProps {
  position: string;
}

function getImageUrlForPiece(piece: string): string {
  const prefix = piece.toUpperCase() === piece ? "w" : "b";
  return `/pieces/${prefix}${piece.toUpperCase()}.svg`;
}

const pieceImages: Record<string, HTMLImageElement> = {};
function getImageForPiece(piece: string, onLoad: () => void): HTMLImageElement {
  if (!pieceImages[piece]) {
    const img = new Image();
    img.src = getImageUrlForPiece(piece);
    img.onload = onLoad;
    pieceImages[piece] = img;
  }
  return pieceImages[piece];
}

export function Board({ position }: BoardProps) {
  const boardRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>();

  const lightColor = "oklch(0.21 0.006 285.885)";
  const darkColor = "oklch(0.274 0.006 286.033)";
  const highlightColor = "rgba(245, 73, 0, 0.5)";

  const ranks = position.split("/");

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return size;
  };

  const drawBoard = () => {
    const canvas = boardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = resizeCanvas(canvas);
    const cell = size / 8;

    ctx.clearRect(0, 0, size, size);

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (rank + file) % 2 === 0;
        ctx.fillStyle = isLight ? lightColor : darkColor;
        ctx.fillRect(file * cell, rank * cell, cell, cell);
      }
    }

    if (selectedSquare) {
      const [selRank, selFile] = selectedSquare;
      ctx.fillStyle = highlightColor;
      ctx.fillRect(selFile * cell, selRank * cell, cell, cell);
    }
  };

  const drawPieces = () => {
    const canvas = piecesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = resizeCanvas(canvas);
    const cell = size / 8;

    ctx.clearRect(0, 0, size, size);

    const expandedRanks = ranks.map((rank) =>
      rank
        .split("")
        .flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill(null) : ch))
    );

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = expandedRanks[rank][file];
        if (piece) {
          const img = getImageForPiece(piece, drawPieces);
          if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, file * cell, rank * cell, cell, cell);
          }
        }
      }
    }
  };

  useEffect(() => {
    drawBoard();
    drawPieces();

    const ro = new ResizeObserver(() => {
      drawBoard();
      drawPieces();
    });
    const container = boardRef.current?.parentElement;
    if (container) ro.observe(container);

    return () => ro.disconnect();
  }, [position, selectedSquare]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = boardRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const cell = size / 8;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const file = Math.max(0, Math.min(7, Math.floor(x / cell)));
    const rank = Math.max(0, Math.min(7, Math.floor(y / cell)));

    setSelectedSquare([rank, file]);
  };

  return (
    <div className="w-full h-full relative rounded-md">
      <canvas
        ref={boardRef}
        onClick={handleClick}
        className="absolute top-0 left-0 w-full h-full rounded-md"
      />
      <canvas
        ref={piecesRef}
        className="absolute top-0 left-0 w-full h-full rounded-md pointer-events-none"
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
            <Board position={"cnbqkbnc/pppppppp/8/8/8/8/PPPPPPPP/CNBQKBNC"} />
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
        <GameContents gameCode={props.gameCode} times={props.times} />
      </div>
    </div>
  );
}
