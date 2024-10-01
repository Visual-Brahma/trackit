# Devcontainers Setup

For a more consistent development environment, it is recommended to use **devcontainers**. Below are setup instructions for the most popular IDEs.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) : Install Docker and run the docker daemon.
- If you face `exec: "docker-credential-[credstore name e.g desktop, wincred, pass etc.]": executable file not found in $PATH` error during building the container then setup credsStore properly or remove the `credsStore` key from your docker config file. See [here](https://docs.docker.com/reference/cli/docker/login/#description) for more info.

### Chrome: For extension

Chrome for testing is installed in the container which can be used to develop and test the extension quickly. To be able to run chrome you need to setup X display server on your host.

### Windows

1.  Install VcXsrv from [here](https://sourceforge.net/projects/vcxsrv).
2.  Start the server with setup as [here](https://github.com/microsoft/WSL/issues/4106#issuecomment-502920377)

### MacOS

1.  Install XQuartz from [here](https://www.xquartz.org)
2.  Start XQuartz server
3.  Stop Xquartz from opening Xtern
    ```bash
    defaults write org.macosforge.xquartz.X11 nolisten_tcp 0
    defaults write org.macosforge.xquartz.X11 app_to_run /usr/bin/true
    ```

- You can refer to [this](http://blog.bennycornelissen.nl.s3-website-eu-west-1.amazonaws.com/post/bwc-gui-apps-in-docker-on-osx/) blog in case you get stuck.

### Linux

no extra setup needed

- Set the DISPLAY environment variable on the host.

  - _Windows_: setx DISPLAY=host.docker.internal:0.0

- After building the container check the DISPLAY environment variable on the container and make sure the X server is running on the host.
- To test if everything is workign type `chrome` in the bash and enter.

## Github CodeSpaces [For web app only]

- Create a new codepsace on this repo and start contributing.
- It's not possible to use a browser with GUI in codespaces therefore you manually need to load the build output of extension to your local browser for testing. Codespaces are recommended for working on the web app only.

## VS Code

1. **Install the Remote - Containers Extension**:

   - Go to the Extensions view (`Ctrl+Shift+X`) and search for `Remote - Containers` by Microsoft.
   - Install the extension.

2. **Open the Repository in a Devcontainer**:

   - Open the repository in VsCode.
   - Open the Command Palette (`Ctrl+Shift+P`) and search for `Remote-Containers: Reopen in Container`.
   - This will set up and launch the development environment inside a container.

3. **Development**:
   Once inside the devcontainer, use the integrated terminal to run your development server:

   ```bash
   pnpm i
   pnpm dev
   ```

## Neovim

1. **Install the devcontainer cli.**

   ```bash
   npm install -g @devcontainers/cli
   ```

2. **Open in Devcontainer**:Use the `devcontainer-cli` to open the project in the container:

   ```bash
   devcontainer up --workspace-folder .
   ```

   **Optional:** Copy your neovim config

   ```bash
   devcontainer up --mount "type=bind,source=path to neovim config on your machine,target=/home/vscode/.config/nvim" --workspace-folder .
   ```

3. Now, open Neovim inside the container by attaching to the running container:

   ```bash
   devcontainer exec --workspace-folder . nvim
   ```

## JetBrains IDEs (WebStorm, IntelliJ)

1. **Open the Project**:
   Open the repo in your **JetBrains IDE**.
2. Open the devcontainer.json file in the editor.
3. In the left gutter, click **Create Dev Container** or right click to open context menu and, select **Create Dev Container and Mount Sources** and select the backend IDE with which you want to work inside the container.
4. Once the container is built click **connect** to open the project in the container.
5. **Development**:
   Run the development server from within the IDE terminal:

   ```bash
   pnpm i
   pnpm dev
   ```
