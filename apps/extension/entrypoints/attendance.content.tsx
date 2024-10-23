import "@repo/ui/styles";
import "./ui/style.css";
import ReactDOM from "react-dom/client";
import RootLayout from "./ui/layout";
import App from "./ui/App";
import {
  loadAttendanceData,
  replacer,
  tracker,
} from "./ui/scripts/attendance-tracker";
import { MeetingState, Participant } from "@/types";

declare global {
  interface Window {
    trackit: {
      meetData: MeetingState;
    };
  }
}

export default defineContentScript({
  matches: ["https://meet.google.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const meetCode = window.location.pathname.substring(1);

    const meetData = await loadAttendanceData(meetCode);
    let _continue = false;

    if (meetData) {
      _continue = window.confirm(
        "A partial attendance record was found for this meeting. Do you want to continue from where you left off?",
      );
      if (!_continue) {
        meetData.ended = true;

        await browser.storage.local.set({
          [meetData.uuid]: JSON.stringify(meetData, replacer),
        });
      }
    }

    window.trackit = {
      meetData:
        meetData != null && _continue
          ? meetData
          : {
              version: 2,
              uuid: `meet_attendance_report_${meetCode}_${new Date().getTime()}`,
              name: meetCode,
              meetCode: meetCode,
              date: new Date(),
              startTime: new Date(),
              endTime: new Date(),
              ended: false,
              participants: new Map<string, Participant>(),
              meetDuration: 0,
            },
    };

    const ui = await createShadowRootUi(ctx, {
      name: "trackit-attendance-ui",
      position: "inline",
      onMount: (container, _shadowRoot, shadowElement) => {
        const app = document.createElement("div");
        container.append(app);

        shadowElement.style.position = "fixed";
        shadowElement.style.zIndex = "99999";

        const root = ReactDOM.createRoot(app);
        root.render(
          <RootLayout>
            <App />
          </RootLayout>,
        );
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    const startTracker = () => {
      try {
        tracker();
        clearInterval(engine);
      } catch (error) {
        console.log("Waiting for the meet to start...");
      }
    };

    const engine = setInterval(startTracker, 1000);

    ui.mount();
  },
});
