import "@repo/ui/styles";
import "./ui/style.css";
import ReactDOM from "react-dom/client";
import RootLayout from "./ui/layout";
import App from "./ui/App";

export default defineContentScript({
  matches: ["https://meet.google.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
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

    ui.mount();
  },
});
