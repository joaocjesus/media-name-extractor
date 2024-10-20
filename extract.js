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

function setStatus(text, error) {
  document.getElementById('status').style = 'color: cornflowerblue';
  if (error) {
    document.getElementById('status').style = 'color: red';
  }
  document.getElementById('status').textContent = text;
}

function formatName() {
  setStatus('');
  const name = document.getElementById('input').value;
  console.log('name: ', name)
  let result;
  if (name) {
    console.log(`Formatting '${name}'...`)
    const extracted = ptt.parse(name);
    console.log('Extracted: ', extracted);
    result = getFormattedName(extracted);
    console.log('Formatted:', result);
    setStatus('Formatted!');
  } else {
    setStatus('No input!', true);
  }
  document.getElementById('outputArea').textContent = result;
}

function formatNameFrom(nameToFormat) {
  setStatus('');
  console.log('nameToFormat: ', nameToFormat)
  if (nameToFormat) {
    console.log(`Formatting '${nameToFormat}'...`)
    const extracted = ptt.parse(nameToFormat);
    console.log('Extracted: ', extracted);
    const result = getFormattedName(extracted);
    console.log('Formatted:', result);
    document.getElementById('outputArea').textContent = result;
    setStatus('Formatted!');
    // document.getElementById('goButton').click();
    // copyToClipboard(result);
  } else {
    setStatus('No name provided! (formatNameFrom)', true);
  }
}

function copyToClipboard() {
  const outputText = getOutput();
  if (outputText) {
    navigator.clipboard.writeText(outputText).then(() => {
      console.log(`Copied: '${outputText}'`);
      setStatus('Copied to clipboard!');
    }).catch((error) => {
      console.error('Could not copy text: ', error);
      setStatus('Not able to copy to clipboard!', true);
    });
  } else {
    console.log(`No output to copy?!`);
  }
}

function readClipboard() {
  let name;
  navigator.clipboard.readText().then((text) => {
    console.log(`Pasted: '${text}'`);
    document.getElementById('input').value = text;
    setStatus('Pasted from clipboard!');
    formatName();
  }).catch(function (error) {
    console.error('Could not paste text: ', error);
    setStatus('Error pasting from clipboard!!', true);
  });
}

document.getElementById('goButton').addEventListener('click', formatName);
document.getElementById('copyButton').addEventListener('click', copyToClipboard);
document.getElementById('pasteButton').addEventListener('click', readClipboard);