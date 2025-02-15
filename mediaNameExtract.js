const ptt = require("parse-torrent-title");

function getFormattedName(torrentInfo) {
  const { title, year } = torrentInfo;
  let result = title;
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
  statusElement.style.color = error ? 'red' : 'cornflowerblue';

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
