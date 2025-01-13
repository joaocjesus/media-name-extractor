// const ptn = require('parse-torrent-name');
// const ptn = require('torrent-name-parser');
const ptt = require("parse-torrent-title");

function getFormattedName(torrentInfo) {
  const { title, year } = torrentInfo;
  const yearStr = !!year ? `(${year})` : '';
  return `${title} ${yearStr}`;
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
  const name = document.getElementById('input').value;
  console.log('name: ', name)
  let result;
  if (name) {
    console.log(`Formatting '${name}'...`)
    const extracted = ptt.parse(name);
    console.log('Extracted: ', extracted);
    result = getFormattedName(extracted);
    console.log('Formatted:', result);
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
      console.log(`Copied: '${outputText}'`);
      if (logStatus) setStatus('Copied to clipboard!');
    }).catch((error) => {
      console.error('Could not copy text: ', error);
      setStatus('Not able to copy to clipboard!', true);
    });
  } else {
    console.log(`No output to copy?!`);
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
    console.error('Could not paste text: ', error);
    setStatus('Error pasting from clipboard!!', true);
  });
}

function runFromClipboard() {
  setStatus('')
  navigator.clipboard.readText().then((text) => {
    const status = [];
    console.log(`Pasted: '${text}'`);

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
    console.error('Could not run from clipboard: ', error);
    setStatus('Error when using text from clipboard!!', true);
  });
}

document.getElementById('goButton').addEventListener('click', formatName);
document.getElementById('copyButton').addEventListener('click', copyToClipboard);
document.getElementById('pasteButton').addEventListener('click', pasteFromClipboard);
document.getElementById('runFromClipboardButton').addEventListener('click', runFromClipboard);