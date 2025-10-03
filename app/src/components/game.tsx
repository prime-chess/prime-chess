import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import { Card, CardHeader, CardContent } from "./ui/card";

interface GameFormProps {
  gameCode: string | undefined;
  times: [string, string];
  decrementingTimer: number | undefined;
}

interface BoardProps {
  position: string;
  originSquareClicked: (x: number, y: number) => [number, number][];
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

export function Board({ position, originSquareClicked }: BoardProps) {
  const boardRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>();
  const [moveSquares, setMoveSquares] = useState<[number, number][]>([]);

  const lightColor = "oklch(0.21 0.006 285.885)";
  const darkColor = "oklch(0.274 0.006 286.033)";
  const highlightColor = "rgba(245, 73, 0, 0.5)";
  const moveOutlineColor = "rgba(245, 73, 0, 0.9)";

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

    // Draw board squares
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (rank + file) % 2 === 0;
        ctx.fillStyle = isLight ? lightColor : darkColor;
        ctx.fillRect(file * cell, rank * cell, cell, cell);
      }
    }

    // Highlight selected square
    if (selectedSquare) {
      const [selRank, selFile] = selectedSquare;
      ctx.fillStyle = highlightColor;
      ctx.fillRect(selFile * cell, selRank * cell, cell, cell);
    }

    // Draw outlines for possible moves
    ctx.lineWidth = 3;
    ctx.strokeStyle = moveOutlineColor;
    moveSquares.forEach(([rank, file]) => {
      ctx.strokeRect(file * cell + 2, rank * cell + 2, cell - 4, cell - 4);
    });
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
  }, [position, selectedSquare, moveSquares]);

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

    const expandedRanks = ranks.map((rankStr) =>
      rankStr
        .split("")
        .flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill(null) : ch))
    );

    const piece = expandedRanks[rank][file];

    if (piece) {
      const moves = originSquareClicked(file, rank);
      setSelectedSquare([rank, file]);
      setMoveSquares(moves);
    } else {
      setSelectedSquare(undefined);
      setMoveSquares([]);
    }
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
        <CardHeader className="w-full h-12 flex-row justify-center items-center inline-flex p-6">
          <Logo size={10} />
        </CardHeader>
        <CardContent className="flex flex-row gap-6 w-full h-full">
          <Card className="grow"></Card>
          <Card className="h-full aspect-square m-0 p-0 shrink">
            <Board
              position={"cnbqkbnc/pppppppp/8/8/8/8/PPPPPPPP/CNBQKBNC"}
              originSquareClicked={() => [
                [0, 0],
                [5, 5],
              ]}
            />
          </Card>
          <Card className="grow p-6">
            <Card className="m-o p-0 h-20">
              <CardContent className="flex flex-row gap-6 m-0 p-0 h-full">
                {props.times.map((t, i) => (
                  <div
                    className={`bg-${
                      props.decrementingTimer === i ? "primary" : "none"
                    } text-primary-foreground m-0 rounded-md grow flex flex-col justify-center items-center`}
                  >
                    <span>{t}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Game(props: GameFormProps) {
  return (
    <div id="game" className="w-full h-full rounded-none">
      <div className={"flex flex-col gap-6 w-full h-full"}>
        <GameContents
          gameCode={props.gameCode}
          times={props.times}
          decrementingTimer={props.decrementingTimer}
        />
      </div>
    </div>
  );
}
