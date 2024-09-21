# Trackit

###### Browser Extension

Automatically save attendance during google meet video calls.

The extension records attendance automatically when you are in a meet and saves it. Once the meet is over it will open the attendance report in a new tab. You can access your saved attendance data anytime on our website [https://trackit.visualbrahma.tech](https://trackit.visualbrahma.tech).

## Donate

[https://www.buymeacoffee.com/blaze2004]()

### How it Works🚀

---

1). The extension starts automatically when you enter in a meet.

2). Once, the meet is over your attendance report is displayed in a new tab.

no manual work required ! it's fully automatic.

### Contributing

---

```bash
cd apps/extension
cp .env.example .env.local
pnpm i
pnpm dev
```

* A browser window will open with the extension installed.
* To automatically open google meet in the new browser window, add `web-ext.config.ts` with below content.

```bash
import { defineRunnerConfig } from 'wxt';

export default defineRunnerConfig({
  startUrls: ['https://meet.google.com/ake-xewk-sgq', 'http://localhost:3000'],
});
```
