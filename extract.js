const ptn = require('parse-torrent-name');

function getFormattedName(ptn) {
  const { title, year } = ptn;
  const yearStr = !!year ? ` (${year})` : '';
  return `${title}${yearStr}`;
}

function formatName() {
  let name = document.getElementById('input').value;
  let result;
  if (name) {
    console.log(`Formatting '${name}...`)
    const extracted = ptn(name);
    result = getFormattedName(extracted);
  } else {
    result = 'No input!';
  }
  document.getElementById('outputArea').textContent = result;
}

function copyToClipboard() {
  const outputText = document.getElementById('outputArea').textContent;

  if (outputText) {
    navigator.clipboard.writeText(outputText).then(function () {
      console.log(`Copied: '${outputText}'`);
    }).catch(function (error) {
      console.error('Could not copy text: ', error);
    });
  } else {
    console.log(`No output to copy?!`);
  }
}

function readClipboard() {
  return navigator.clipboard.readText().then(function (text) {
    console.log(`Pasted: '${text}'`);
    document.getElementById('input').value = text;
    return text;
  }).catch(function (error) {
    console.error('Could not paste text: ', error);
  });
}

document.getElementById('goButton').addEventListener('click', formatName);
document.getElementById('copyButton').addEventListener('click', copyToClipboard);
document.getElementById('pasteButton').addEventListener('click', readClipboard);