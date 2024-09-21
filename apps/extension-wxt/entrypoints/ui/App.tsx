import { useState, useEffect } from "react";
import DraggableButton from "./components/draggable-button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import ThemeSwitcher from "./components/theme-changer";
import logo from "@/assets/logo.svg";
import { Button } from "@repo/ui/button";
import { AuthContext } from "./providers/auth";
import { buildUrl } from "../utils/constants";
import AttendanceTracker from "./tracker";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ left: 40, bottom: 40 });

  const [isInMeeting, setIsInMeeting] = useState(false);
  const { isAuthenticated } = useContext(AuthContext) ?? {
    isAuthenticated: false,
  };

  useEffect(() => {
    let checkIfMeetingStartedInterval: NodeJS.Timeout;
    console.log("Checking if meeting started");

    const checkIfMeetingStarted = () => {
      const meetActionButtons = document.getElementsByClassName("NtU4hc");
      if (meetActionButtons.length === 0) {
        setIsInMeeting(false);
      } else {
        setIsInMeeting(true);
        clearInterval(checkIfMeetingStartedInterval);
      }
    };

    checkIfMeetingStartedInterval = setInterval(checkIfMeetingStarted, 1000);
    return () => clearInterval(checkIfMeetingStartedInterval);
  }, []);

  if (!isInMeeting) return null;

  if (!isOpen)
    return (
      <DraggableButton
        onClick={() => setIsOpen(true)}
        position={position}
        setPosition={setPosition}
      />
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 min-w-full min-h-screen bg-transparent width-[100vw]">
      <Card className="bg-background w-full max-w-md">
        <CardHeader>
          <div className={`w-full border-b border-border z-30 transition-all`}>
            <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
              <div className="flex items-center font-display text-2xl">
                <img
                  alt="Trackit logo"
                  className="p-2 rounded-sm bg-transparent"
                  height={50}
                  src={logo}
                  style={{ color: "transparent" }}
                  title="Trackit logo"
                  width={50}
                />
                <p className="font-display text-2xl font-bold drop-shadow-sm md:text-3xl">
                  Trackit
                </p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <ThemeSwitcher />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setIsOpen(false)}
                >
                  X
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <AttendanceTracker />
          ) : (
            <Button asChild>
              <a href={buildUrl("/auth/signin")} target="_blank" rel="noopener">
                SignIn
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
