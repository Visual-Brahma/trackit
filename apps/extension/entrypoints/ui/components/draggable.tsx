import { cn } from "@/lib/utils";
import { LayoutProps } from "@/types";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { GripHorizontalIcon } from "lucide-react";
import { useState, useCallback, useEffect, useRef, MouseEvent } from "react";

interface DraggableState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
}

const Draggable = ({
  children,
  className,
}: LayoutProps & { className?: string }) => {
  const [position, setPosition] = useState({ left: 40, top: 40 });
  const [state, setState] = useState<DraggableState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  const ref = useRef<HTMLDivElement>(null);

  const startDragging = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: position.left,
        startTop: position.top,
      });
    },
    [position]
  );

  const drag = useCallback(
    (e: MouseEvent) => {
      if (!state.isDragging) return;

      const deltaX = e.clientX - state.startX;
      const deltaY = e.clientY - state.startY;

      let newLeft = state.startLeft + deltaX;
      let newTop = state.startTop + deltaY;

      const containerRect = ref.current?.getBoundingClientRect();
      const containerWidth = containerRect?.width || 0;
      const containerHeight = containerRect?.height || 0;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - containerWidth));
      newTop = Math.max(0, Math.min(newTop, viewportHeight - containerHeight));

      setPosition({ left: newLeft, top: newTop });
    },
    [state]
  );

  const stopDragging = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

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
      ref={ref}
      className={cn("fixed overflow-hidden", className)}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      aria-label="Trackit Extension View"
    >
      <CardHeader
        className="flex items-center justify-center p-2 bg-secondary cursor-grab active:cursor-grabbing border"
        onMouseDown={startDragging}
        aria-label="Drag to move"
      >
        <GripHorizontalIcon className="h-4 w-4" />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Draggable;
