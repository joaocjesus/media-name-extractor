(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"parse-torrent-title":2}],2:[function(require,module,exports){
const Parser = require("./src/parser").Parser;
const handlers = require("./src/handlers");

const defaultParser = new Parser();

handlers.addDefaults(defaultParser);

exports.addDefaults = handlers.addDefaults;
exports.addHandler = (handlerName, handler, options) => defaultParser.addHandler(handlerName, handler, options);
exports.parse = title => defaultParser.parse(title);
exports.Parser = Parser;

},{"./src/handlers":3,"./src/parser":4}],3:[function(require,module,exports){
exports.addDefaults = /** @type Parser */ parser => {

    // Year
    parser.addHandler("year", /(?!^)[([]?((?:19[0-9]|20[012])[0-9])[)\]]?/, { type: "integer" });

    // Resolution
    parser.addHandler("resolution", /([0-9]{3,4}[pi])/i, { type: "lowercase" });
    parser.addHandler("resolution", /(4k)/i, { type: "lowercase" });

    // Extended
    parser.addHandler("extended", /EXTENDED/, { type: "boolean" });

    // Convert
    parser.addHandler("convert", /CONVERT/, { type: "boolean" });

    // Hardcoded
    parser.addHandler("hardcoded", /HC|HARDCODED/, { type: "boolean" });

    // Proper
    parser.addHandler("proper", /(?:REAL.)?PROPER/, { type: "boolean" });

    // Repack
    parser.addHandler("repack", /REPACK|RERIP/, { type: "boolean" });

    // Retail
    parser.addHandler("retail", /\bRetail\b/i, { type: "boolean" });

    // Remastered
    parser.addHandler("remastered", /\bRemaster(?:ed)?\b/i, { type: "boolean" });

    // Unrated
    parser.addHandler("unrated", /\bunrated|uncensored\b/i, { type: "boolean" });

    // Region
    parser.addHandler("region", /R[0-9]/);

    // Container
    parser.addHandler("container", /\b(MKV|AVI|MP4)\b/i, { type: "lowercase" });

    // Source
    parser.addHandler("source", /\b(?:HD-?)?CAM\b/, { type: "lowercase" });
    parser.addHandler("source", /\b(?:HD-?)?T(?:ELE)?S(?:YNC)?\b/i, { value: "telesync" });
    parser.addHandler("source", /\bHD-?Rip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bBRRip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bBDRip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bDVDRip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bDVD(?:R[0-9])?\b/i, { value: "dvd" });
    parser.addHandler("source", /\bDVDscr\b/i, { type: "lowercase" });
    parser.addHandler("source", /\b(?:HD-?)?TVRip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bTC\b/, { type: "lowercase" });
    parser.addHandler("source", /\bPPVRip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bR5\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bVHSSCR\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bBluray\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bWEB-?DL\b/i, { type: "lowercase" });
    parser.addHandler("source", /\bWEB-?Rip\b/i, { type: "lowercase" });
    parser.addHandler("source", /\b(?:DL|WEB|BD|BR)MUX\b/i, { type: "lowercase" });
    parser.addHandler("source", /\b(DivX|XviD)\b/, { type: "lowercase" });
    parser.addHandler("source", /HDTV/i, { type: "lowercase" });

    // Codec
    parser.addHandler("codec", /dvix|mpeg2|divx|xvid|[xh][-. ]?26[45]|avc|hevc/i, { type: "lowercase" });
    parser.addHandler("codec", ({ result }) => {
        if (result.codec) {
            result.codec = result.codec.replace(/[ .-]/, "");
        }
    });

    // Audio
    parser.addHandler("audio", /MD|MP3|mp3|FLAC|Atmos|DTS(?:-HD)?|TrueHD/, { type: "lowercase" });
    parser.addHandler("audio", /Dual[- ]Audio/i, { type: "lowercase" });
    parser.addHandler("audio", /AC-?3(?:\.5\.1)?/i, { value: "ac3" });
    parser.addHandler("audio", /DD5[. ]?1/i, { value: "dd5.1" });
    parser.addHandler("audio", /AAC(?:[. ]?2[. ]0)?/, { value: "aac" });

    // Group
    parser.addHandler("group", /- ?([^\-. ]+)$/);

    // Season
    parser.addHandler("season", /([0-9]{1,2})xall/i, { type: "integer" });
    parser.addHandler("season", /S([0-9]{1,2}) ?E[0-9]{1,2}/i, { type: "integer" });
    parser.addHandler("season", /([0-9]{1,2})x[0-9]{1,2}/, { type: "integer" });
    parser.addHandler("season", /(?:Saison|Season)[. _-]?([0-9]{1,2})/i, { type: "integer" });

    // Episode
    parser.addHandler("episode", /S[0-9]{1,2} ?E([0-9]{1,2})/i, { type: "integer" });
    parser.addHandler("episode", /[0-9]{1,2}x([0-9]{1,2})/, { type: "integer" });
    parser.addHandler("episode", /[ée]p(?:isode)?[. _-]?([0-9]{1,3})/i, { type: "integer" });

    // Language
    parser.addHandler("language", /\bRUS\b/i, { type: "lowercase" });
    parser.addHandler("language", /\bNL\b/, { type: "lowercase" });
    parser.addHandler("language", /\bFLEMISH\b/, { type: "lowercase" });
    parser.addHandler("language", /\bGERMAN\b/, { type: "lowercase" });
    parser.addHandler("language", /\bDUBBED\b/, { type: "lowercase" });
    parser.addHandler("language", /\b(ITA(?:LIAN)?|iTALiAN)\b/, { value: "ita" });
    parser.addHandler("language", /\bFR(?:ENCH)?\b/, { type: "lowercase" });
    parser.addHandler("language", /\bTruefrench|VF(?:[FI])\b/i, { type: "lowercase" });
    parser.addHandler("language", /\bVOST(?:(?:F(?:R)?)|A)?|SUBFRENCH\b/i, { type: "lowercase" });
    parser.addHandler("language", /\bMULTi(?:Lang|-VF2)?\b/i, { type: "lowercase" });
};

},{}],4:[function(require,module,exports){
function extendOptions(options) {
    options = options || {};

    const defaultOptions = {
        skipIfAlreadyFound: true,
        type: "string",
    };

    options.skipIfAlreadyFound = options.skipIfAlreadyFound || defaultOptions.skipIfAlreadyFound;
    options.type = options.type || defaultOptions.type;

    return options;
}

function createHandlerFromRegExp(name, regExp, options) {
    let transformer;

    if (!options.type) {
        transformer = input => input;
    } else if (options.type.toLowerCase() === "lowercase") {
        transformer = input => input.toLowerCase();
    } else if (options.type.toLowerCase().slice(0, 4) === "bool") {
        transformer = () => true;
    } else if (options.type.toLowerCase().slice(0, 3) === "int") {
        transformer = input => parseInt(input, 10);
    } else {
        transformer = input => input;
    }

    function handler({ title, result }) {
        if (result[name] && options.skipIfAlreadyFound) {
            return null;
        }

        const match = title.match(regExp);
        const [rawMatch, cleanMatch] = match || [];

        if (rawMatch) {
            result[name] = options.value || transformer(cleanMatch || rawMatch);
            return match.index;
        }

        return null;
    }

    handler.handlerName = name;

    return handler;
}

function cleanTitle(rawTitle) {
    let cleanedTitle = rawTitle;

    if (cleanedTitle.indexOf(" ") === -1 && cleanedTitle.indexOf(".") !== -1) {
        cleanedTitle = cleanedTitle.replace(/\./g, " ");
    }

    cleanedTitle = cleanedTitle.replace(/_/g, " ");
    cleanedTitle = cleanedTitle.replace(/([(_]|- )$/, "").trim();

    return cleanedTitle;
}

class Parser {

    constructor() {
        this.handlers = [];
    }

    addHandler(handlerName, handler, options) {
        if (typeof handler === "undefined" && typeof handlerName === "function") {

            // If no name is provided and a function handler is directly given
            handler = handlerName;
            handler.handlerName = "unknown";

        } else if (typeof handlerName === "string" && handler instanceof RegExp) {

            // If the handler provided is a regular expression
            options = extendOptions(options);
            handler = createHandlerFromRegExp(handlerName, handler, options);

        } else if (typeof handler === "function") {

            // If the handler is a function
            handler.handlerName = handlerName;

        } else {

            // If the handler is neither a function nor a regular expression, throw an error
            throw new Error(`Handler for ${handlerName} should be a RegExp or a function. Got: ${typeof handler}`);

        }

        this.handlers.push(handler);
    }

    parse(title) {
        const result = {};
        let endOfTitle = title.length;

        for (const handler of this.handlers) {
            const matchIndex = handler({ title, result });

            if (matchIndex && matchIndex < endOfTitle) {
                endOfTitle = matchIndex;
            }
        }

        result.title = cleanTitle(title.slice(0, endOfTitle));

        return result;
    }
}

exports.Parser = Parser;

},{}]},{},[1]);
