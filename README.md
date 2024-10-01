# Trackit✨

Simple attendance management solution for In-Person events and google meet calls.
Easy, simple and automatic meet attendance collector application 🚀

###### Browser Extensions

Automatically save attendance during google meet video calls.

The extension records attendance automatically when you are in a meet and saves it. Once the meet is over it will open the attendance report in a new tab. You can access your saved attendance data anytime on our website [https://trackit.visualbrahma.tech](https://trackit.visualbrahma.tech).

Get the extension on

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/trackit)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/trackit-meet-attendance/chidnckliojipjihhfmjdmehaglhplcl)
- [Google Chrome](https://chrome.google.com/webstore/detail/trackit-meet-attendance-c/aopejafeamijmefcoclhohoaggbfhcgh)
- [Others](https://chrome.google.com/webstore/detail/trackit-meet-attendance-c/aopejafeamijmefcoclhohoaggbfhcgh)

## Donate

[https://www.buymeacoffee.com/blaze2004](https://www.buymeacoffee.com/blaze2004)

### Steps to Setup 🚀

---

1. The extension starts automatically when you enter in a meet.

2. Once, the meet is over your attendance report is displayed in a new tab.

No manual work required ! it's fully automatic.

---

# Contributing

Design [Figma](https://www.figma.com/proto/gqSo5VbVo3wUsCNWHrnDNh/Trackit?node-id=4-2&starting-point-node-id=4%3A2&mode=design&t=9vNyIJ3d1GOdYt8D-1)

## Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `extension`: browser extension
- `@repo/ui`: a stub React component library shared by both `web` and `browser extension` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/tailwind-config`: tailwin config used throughout the monorepo.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```bash
cd trackit
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```bash
cd trackit
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```bash
cd trackit
pnpx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```bash
pnpx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## DevContainer Setup

You can use your local environment for development but it is recommended to use the application in a devcontainer for consistent development environments.
Refer to [Devcontainer setup guide](./.devcontainer/Guide.md) to setup your containerized dev environment.
