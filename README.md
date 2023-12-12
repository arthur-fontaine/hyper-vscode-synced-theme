# hyper-vscode-synced-theme

A [Hyper](https://hyper.is) plugin to sync the active theme with [VSCode](https://code.visualstudio.com/).

## Install

- `cd ~/.hyper_plugins/local`
- `git clone https://github.com/arthur-fontaine/hyper-vscode-synced-theme.git`
- Add `hyper-vscode-synced-theme` to `localPlugins` in `~/.hyper.js`
- Restart Hyper

## Features

- Syncs the active color theme from VSCode to Hyper
- Supports for `workbench.preferredDarkColorTheme` and `workbench.preferredLightColorTheme` parameters in VSCode settings
- Automatically changes the Hyper theme according to the system theme (dark or light)
- Syncs the active editor font from VSCode to Hyper
- Supports for `apc.font.family` parameter in VSCode settings (this will set the ui font in Hyper)
