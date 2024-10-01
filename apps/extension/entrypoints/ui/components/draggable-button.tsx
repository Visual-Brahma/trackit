import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle } from "@repo/ui/card";
import { Maximize2Icon, MoveIcon } from "lucide-react";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  MouseEvent,
  Dispatch,
  SetStateAction,
} from "react";

interface DraggableButtonState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startLeft: number;
  startBottom: number;
  hasMoved: boolean;
}

const DraggableButton = ({
  onClick,
  position,
  setPosition,
}: {
  onClick: () => void;
  position: { left: number; bottom: number };
  setPosition: Dispatch<SetStateAction<{ left: number; bottom: number }>>;
}) => {
  const [state, setState] = useState<DraggableButtonState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startBottom: 0,
    hasMoved: false,
  });

  const buttonRef = useRef<HTMLDivElement>(null);

  const startDragging = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setState({
        isDragging: true,
        hasMoved: false,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: position.left,
        startBottom: position.bottom,
      });
    },
    [position]
  );

  const drag = useCallback(
    (e: MouseEvent) => {
      if (!state.isDragging) return;

      const deltaX = e.clientX - state.startX;
      const deltaY = e.clientY - state.startY;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setState((prev) => ({ ...prev, hasMoved: true }));
      }

      let newLeft = state.startLeft + deltaX;
      let newBottom = state.startBottom - deltaY;

      const buttonRect = buttonRef.current?.getBoundingClientRect();
      const buttonWidth = buttonRect?.width || 0;
      const buttonHeight = buttonRect?.height || 0;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - buttonWidth));
      newBottom = Math.max(
        0,
        Math.min(newBottom, viewportHeight - buttonHeight)
      );

      setPosition({ left: newLeft, bottom: newBottom });
    },
    [state]
  );

  const stopDragging = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleClick = useCallback(() => {
    if (!state.hasMoved) {
      onClick();
    }
    setState((prev) => ({ ...prev, hasMoved: false }));
  }, [state.hasMoved]);

  useEffect(() => {
    document.addEventListener("mousemove", drag as unknown as EventListener);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("mouseleave", stopDragging);
    return () => {
      document.removeEventListener(
        "mousemove",
        drag as unknown as EventListener
      );
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("mouseleave", stopDragging);
    };
  }, [drag, stopDragging]);

  return (
    <Card
      ref={buttonRef}
      className="fixed"
      style={{
        left: `${position.left}px`,
        bottom: `${position.bottom}px`,
      }}
    >
      <CardHeader>
        <Button size={"icon"} onMouseDown={startDragging} onClick={handleClick}>
          <MoveIcon className="h-4 w-4" />
        </Button>
        <CardTitle>Trackit</CardTitle>
        <Button size={"icon"} onClick={onClick}>
          <Maximize2Icon className="h-4 w-4" />
        </Button>
      </CardHeader>
    </Card>
  );
};

export default DraggableButton;
