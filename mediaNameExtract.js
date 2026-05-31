const ptt = require("parse-torrent-title");

function toPascalCaseTitle(title) {
  return (title || '').toLowerCase().replace(/[a-z0-9]+(?:'[a-z0-9]+)?/gi, word => (
    word.charAt(0).toUpperCase() + word.slice(1)
  ));
}

function getFormattedName(torrentInfo) {
  const { title, year } = torrentInfo;
  const shouldFormatTitle = document.getElementById('formatTitle').checked;
  let result = shouldFormatTitle ? toPascalCaseTitle(title) : title;
  const showDate = document.getElementById('addYear').checked;
  if (showDate) {
    const yearStr = !!year ? ` (${year})` : '';
    result += yearStr;
  }
  return result;
}

function getOutput() {
  return document.getElementById('outputArea').textContent;
}

function setStatus(status, error) {
  const statusElement = document.getElementById('status');
  statusElement.className = error ? 'error' : '';

  if (typeof (status) === "string") {
    statusElement.textContent = status;
    return;
  }

  statusElement.innerHTML = '';
  status.forEach(line => {
    const lineElement = document.createElement('div');
    lineElement.textContent = line;
    statusElement.appendChild(lineElement);
  });
}

function formatName(logStatus = true) {
  if (logStatus) setStatus('')
  const name = document.getElementById('input').value + '';
  let result;
  if (name) {
    const extracted = ptt.parse(name);
    result = getFormattedName(extracted);
    const keepFileExt = document.getElementById('keepFileExt').checked;
    if (keepFileExt && name.includes('.')) {
      result += '.' + name.split('.').pop();
    }
    if (logStatus) setStatus('Formatted!');
  } else {
    setStatus('No input!', true);
  }

  document.getElementById('outputArea').textContent = result;
}

function copyToClipboard(logStatus = true) {
  if (logStatus) setStatus('')
  const outputText = getOutput();
  if (outputText) {
    navigator.clipboard.writeText(outputText).then(() => {
      if (logStatus) setStatus('Copied to clipboard!');
    }).catch((error) => {
      setStatus('Not able to copy to clipboard!', true);
    });
  } else {
    setStatus('No output to copy!', true);
  }
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then((text) => {
    const status = [];
    if (text.length === 0) {
      setStatus('No text in clipboard?!', true);
      return;
    }
    document.getElementById('input').value = text;
    status.push('Pasted from clipboard!');
    setStatus(status);
  }).catch(function (error) {
    setStatus('Error pasting from clipboard!!', true);
  });
}

function runFromClipboard() {
  setStatus('')
  navigator.clipboard.readText().then((text) => {
    const status = [];
    document.getElementById('input').value = text;
    status.push('Pasted from clipboard!');
    setStatus(status);

    formatName(false);
    status.push('Formatted name!');
    setStatus(status);

    copyToClipboard(false);
    status.push('Copied to clipboard!');
    setStatus(status);
  }).catch(function (error) {
    setStatus('Error when using text from clipboard!!', true);
  });
}

document.getElementById('goButton').addEventListener('click', formatName);
document.getElementById('copyButton').addEventListener('click', copyToClipboard);
document.getElementById('pasteButton').addEventListener('click', pasteFromClipboard);
document.getElementById('runFromClipboardButton').addEventListener('click', runFromClipboard);

const optionsButton = document.getElementById('optionsButton');
const optionsMenu = document.getElementById('optionsMenu');

function closeOptionsMenu() {
  optionsButton.setAttribute('aria-expanded', 'false');
  optionsMenu.hidden = true;
}

optionsButton.addEventListener('click', function () {
  const isOpen = optionsButton.getAttribute('aria-expanded') === 'true';
  optionsButton.setAttribute('aria-expanded', !isOpen);
  optionsMenu.hidden = isOpen;
});

document.addEventListener('click', function (e) {
  if (!optionsMenu.hidden && !e.target.closest('.options-dropdown')) {
    closeOptionsMenu();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !optionsMenu.hidden) {
    closeOptionsMenu();
    optionsButton.focus();
  }
});

document.getElementById('input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') formatName();
});

document.addEventListener('paste', function (e) {
  if (document.activeElement === document.getElementById('input')) return;
  const text = e.clipboardData.getData('text');
  if (!text) { setStatus('No text in clipboard?!', true); return; }
  const status = [];
  document.getElementById('input').value = text;
  status.push('Pasted from clipboard!');
  setStatus(status);
  formatName(false);
  status.push('Formatted name!');
  setStatus(status);
  copyToClipboard(false);
  status.push('Copied to clipboard!');
  setStatus(status);
});

(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  const sunPath = 'M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm8-8a1 1 0 110 2h-1a1 1 0 110-2h1zM5 12a1 1 0 110 2H4a1 1 0 110-2h1zm11.95-6.364a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM8.172 15.95a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zm9.192 1.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM8.172 8.05a1 1 0 01-1.414 0l-.707-.707A1 1 0 017.465 5.93l.707.707a1 1 0 010 1.414zM12 7a5 5 0 100 10A5 5 0 0012 7z';
  const moonPath = 'M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      icon.innerHTML = '<path d="' + sunPath + '"/>';
      label.textContent = 'Light mode';
    } else {
      icon.innerHTML = '<path d="' + moonPath + '"/>';
      label.textContent = 'Dark mode';
    }
    localStorage.setItem('theme', theme);
  }

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  toggle.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
