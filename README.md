# hyper-vscode-synced-theme

A [Hyper](https://hyper.is) plugin to sync the active theme with [VSCode](https://code.visualstudio.com/).

## Installation

**With the bash script (Experimental)**

To install the plugin, run this command:

```sh
curl "https://raw.githubusercontent.com/arthur-fontaine/hyper-vscode-synced-theme/main/install.sh" | bash
```

> [!NOTE]
> You can change the `HYPER_CONFIG_PATH` and `HYPER_PLUGINS_PATH` variables. For example: `HYPER_CONFIG_PATH="blah" curl...`.

<details>
<summary>
<b>Manually</b>
</summary>

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

</details>

## Features

- Syncs the active color theme from VSCode to Hyper
- Supports for `workbench.preferredDarkColorTheme` and `workbench.preferredLightColorTheme` parameters in VSCode settings
- Automatically changes the Hyper theme according to the system theme (dark or light)
- Syncs the active editor font (family, size, line height) from VSCode to Hyper
- Supports for `apc.font.family` parameter in VSCode settings (this will set the ui font in Hyper)
