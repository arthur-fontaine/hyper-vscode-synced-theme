HYPER_CONFIG_PATH=${HYPER_CONFIG_PATH:="~/.hyper.js"}
HYPER_PLUGINS_PATH=${HYPER_PLUGINS_PATH:="~/.hyper_plugins"}
HYPER_VSCODE_SYNCED_THEME_PATH="$HYPER_PLUGINS_PATH/local"

git clone https://github.com/arthur-fontaine/hyper-vscode-synced-theme.git $HYPER_VSCODE_SYNCED_THEME_PATH

cd $HYPER_VSCODE_SYNCED_THEME_PATH
npm i

localPluginsRegex='/localPlugins: \[([^,]+),?\],?/'
localPluginsReplacement='localPlugins: [\1,"hyper-vscode-synced-theme"],'

sed -i -E "s/$localPluginsRegex/$localPluginsReplacement/" $HYPER_CONFIG_PATH

echo "Installed successfully ✅. To make the plugin active, restart Hyper if it is already started."
