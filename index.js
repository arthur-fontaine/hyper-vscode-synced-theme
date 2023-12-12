const execSync = require('child_process').execSync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const existsSync = require('fs').existsSync;
const mkdirSync = require('fs').mkdirSync;
const path = require('path');
const globSync = require('glob').globSync;
const json5 = require('json5');
const worker = require('worker_threads');

const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

if (!HOME) {
  throw new Error('Could not find home directory');
}

const VSCODE_SUPPORT_PATH = path.join(HOME, 'Library', 'Application\\ Support', 'Code');
const VSCODE_USER_FILES_PATH = path.join(HOME, '.vscode');

const CACHE_PATH = path.join(__dirname, '.cache');
if (!existsSync(CACHE_PATH)) {
  mkdirSync(CACHE_PATH);
}

function cacheVscodeTheme(theme) {
  const themePath = path.join(CACHE_PATH, 'theme.json');
  writeFileSync(themePath, json5.stringify(theme));
}

function getCachedVscodeTheme() {
  const themePath = path.join(CACHE_PATH, 'theme.json');
  try {
    const theme = json5.parse(readFileSync(themePath).toString());
    return theme;
  } catch (e) {
    return null;
  }
}

function refreshCachedVscodeTheme() {
  const darkVscodeTheme = getVscodeTheme(true, true);
  const lightVscodeTheme = getVscodeTheme(false, true);

  cacheVscodeTheme({ darkVscodeTheme, lightVscodeTheme });
}

function getVscodeTheme(systemIsDark, forceRefresh = false) {
  const cachedVscodeTheme = getCachedVscodeTheme();

  if (cachedVscodeTheme && !forceRefresh) {
    return cachedVscodeTheme[systemIsDark ? 'darkVscodeTheme' : 'lightVscodeTheme'];
  }

  const vscodeSettings = execSync(`cat ${path.join(VSCODE_SUPPORT_PATH, 'User', 'settings.json')}`).toString();
  const vscodeSettingsJSON = json5.parse(vscodeSettings);

  const {
    'workbench.colorTheme': colorTheme,
    'workbench.preferredDarkColorTheme': preferredDarkColorTheme,
    'workbench.preferredLightColorTheme': preferredLightColorTheme,
    'apc.font.family': uiFontFamily,
    'terminal.integrated.fontFamily': terminalFontFamily,
    'editor.fontFamily': editorFontFamily,
    'terminal.integrated.fontSize': editorFontSize,
    'terminal.integrated.lineHeight': editorLineHeight,
  } = vscodeSettingsJSON;

  const themeName = (systemIsDark ? preferredDarkColorTheme : preferredLightColorTheme) || colorTheme;

  const allExtensionsPackageJsonPaths = globSync(path.join(VSCODE_USER_FILES_PATH, 'extensions', '**', 'package.json'));

  const themePath = allExtensionsPackageJsonPaths.map(path => {
    const themesContributes = json5.parse(readFileSync(path).toString()).contributes?.themes;
    if (!themesContributes) {
      return null;
    }
    const theme = themesContributes.find(theme => theme.label === themeName);
    if (!theme) {
      return null;
    }
    return path.replace('package.json', theme.path);
  }).find(path => path);

  if (!themePath) {
    throw new Error(`Could not find theme ${themeName}`);
  }

  const vscodeTheme = json5.parse(readFileSync(themePath).toString());

  return {
    ...vscodeTheme,
    uiFontFamily,
    fontFamily: terminalFontFamily || editorFontFamily,
    fontSize: editorFontSize,
    lineHeight: editorLineHeight,
  };
}

function getTheme(systemIsDark) {
  const vscodeTheme = getVscodeTheme(systemIsDark);

  const FOREGROUND_COLOR = vscodeTheme.colors['editor.foreground'] || vscodeTheme.colors['foreground'];
  const BACKGROUND_COLOR = vscodeTheme.colors['editor.background'] || vscodeTheme.colors['background'];
  const BORDER_COLOR = vscodeTheme.colors['editorCursor.foreground'] || vscodeTheme.colors['editorCursor'];
  const CURSOR_COLOR = vscodeTheme.colors['editorCursor.foreground'] || vscodeTheme.colors['editorCursor'];

  const BLACK = vscodeTheme.colors['terminal.ansiBlack'] || vscodeTheme.colors['black'];
  const RED = vscodeTheme.colors['terminal.ansiRed'] || vscodeTheme.colors['red'];
  const GREEN = vscodeTheme.colors['terminal.ansiGreen'] || vscodeTheme.colors['green'];
  const YELLOW = vscodeTheme.colors['terminal.ansiYellow'] || vscodeTheme.colors['yellow'];
  const BLUE = vscodeTheme.colors['terminal.ansiBlue'] || vscodeTheme.colors['blue'];
  const MAGENTA = vscodeTheme.colors['terminal.ansiMagenta'] || vscodeTheme.colors['magenta'];
  const CYAN = vscodeTheme.colors['terminal.ansiCyan'] || vscodeTheme.colors['cyan'];
  const WHITE = vscodeTheme.colors['terminal.ansiWhite'] || vscodeTheme.colors['white'];
  const LIGHT_BLACK = vscodeTheme.colors['terminal.ansiBrightBlack'] || vscodeTheme.colors['brightBlack'];
  const LIGHT_RED = vscodeTheme.colors['terminal.ansiBrightRed'] || vscodeTheme.colors['brightRed'];
  const LIGHT_GREEN = vscodeTheme.colors['terminal.ansiBrightGreen'] || vscodeTheme.colors['brightGreen'];
  const LIGHT_YELLOW = vscodeTheme.colors['terminal.ansiBrightYellow'] || vscodeTheme.colors['brightYellow'];
  const LIGHT_BLUE = vscodeTheme.colors['terminal.ansiBrightBlue'] || vscodeTheme.colors['brightBlue'];
  const LIGHT_MAGENTA = vscodeTheme.colors['terminal.ansiBrightMagenta'] || vscodeTheme.colors['brightMagenta'];
  const LIGHT_CYAN = vscodeTheme.colors['terminal.ansiBrightCyan'] || vscodeTheme.colors['brightCyan'];

  const colors = {
    black: BLACK,
    red: RED,
    green: GREEN,
    yellow: YELLOW,
    blue: BLUE,
    magenta: MAGENTA,
    cyan: CYAN,
    white: WHITE,
    lightBlack: LIGHT_BLACK,
    lightRed: LIGHT_RED,
    lightGreen: LIGHT_GREEN,
    lightYellow: LIGHT_YELLOW,
    lightBlue: LIGHT_BLUE,
    lightMagenta: LIGHT_MAGENTA,
    lightCyan: LIGHT_CYAN,
    colorCubes: WHITE,
    grayscale: FOREGROUND_COLOR,

    _foregroundColor: FOREGROUND_COLOR,
    _backgroundColor: BACKGROUND_COLOR,
    _borderColor: BORDER_COLOR,
    _cursorColor: CURSOR_COLOR,
  };

  return {
    foregroundColor: FOREGROUND_COLOR,
    backgroundColor: BACKGROUND_COLOR,
    borderColor: BORDER_COLOR,
    cursorColor: CURSOR_COLOR,
    colors,
    css: `
      .cursor-node {
              backgroundColor: ${WHITE} !important;
              border-color: ${WHITE} !important;
      }
      .hyper_main {
        border: none !important;
      }
      .tab_tab {
        border: 0;
      }
      .tab_textActive {
        border-bottom: 2px solid ${WHITE};
      }
    `,
    ...vscodeTheme.uiFontFamily && {
      uiFontFamily: vscodeTheme.uiFontFamily,
    },
    ...vscodeTheme.fontFamily && {
      fontFamily: vscodeTheme.fontFamily,
    },
    ...vscodeTheme.fontSize && {
      fontSize: vscodeTheme.fontSize,
    },
    ...vscodeTheme.lineHeight && {
      lineHeight: vscodeTheme.lineHeight,
    },
  };
}

exports.decorateConfig = (config) => {
  let systemIsDark = false;
  try {
    systemIsDark = execSync('defaults read -g AppleInterfaceStyle').toString().trim() === 'Dark';
  } catch (e) {
    // ignore
  }

  const theme = getTheme(systemIsDark);
  new worker.Worker(__filename, {
    workerData: {
      refreshCachedVscodeTheme: true
    }
  });

  return Object.assign({}, config, {
    ...theme,
    css: `
      ${config.css || ''}
      ${theme.css}
    `
  });
};

let darkModeListenerAdded = false;
exports.middleware = (store) => (next) => (action) => {
  if (!darkModeListenerAdded) {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
      store.dispatch({
        type: "UPDATE_THEME"
      });
    });
    darkModeListenerAdded = true;
  }
  next(action);
};

exports.reduceUI = (state, action) => {
  switch (action.type) {
    case "UPDATE_THEME":
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = getTheme(systemIsDark);

      return state
        .set("foregroundColor", theme.foregroundColor)
        .set("backgroundColor", theme.backgroundColor)
        .set("borderColor", theme.borderColor)
        .set("cursorColor", theme.cursorColor)
        .set("colors", theme.colors)
        // @ts-ignore
        .set("termCSS", `${window.config.termCSS || ""} ${theme.termCSS}`)
        // @ts-ignore
        .set("css", `${window.config.css || ""} ${theme.css}`);
  }
  return state;
};

if (worker.workerData?.refreshCachedVscodeTheme) {
  refreshCachedVscodeTheme();
}
