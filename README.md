# hyper-vscode-synced-theme

A [Hyper](https://hyper.is) plugin to sync the active theme with [VSCode](https://code.visualstudio.com/).

## Usage

- Install the plugin
  ```sh
  cd ~
  HYPER_VSCODE_SYNCED_THEME_PATH=".hyper_plugins/local/hyper-vscode-synced-theme"
  git clone https://github.com/arthur-fontaine/hyper-vscode-synced-theme.git $HYPER_VSCODE_SYNCED_THEME_PATH
  cd $HYPER_VSCODE_SYNCED_THEME_PATH
  npm i
  ```
- Activate it by adding `"hyper-vscode-synced-theme"` to `localPlugins` in `~/.hyper.js`
- Restart Hyper

## Features

- Syncs the active color theme from VSCode to Hyper
- Supports for `workbench.preferredDarkColorTheme` and `workbench.preferredLightColorTheme` parameters in VSCode settings
- Automatically changes the Hyper theme according to the system theme (dark or light)
- Syncs the active editor font (family, size, line height) from VSCode to Hyper
- Supports for `apc.font.family` parameter in VSCode settings (this will set the ui font in Hyper)
