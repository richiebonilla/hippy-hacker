const axios = require("axios");
const fs = require("fs");

String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.split(search).join(replacement);
};

function getUsernameFromUrl(url) {
  const regex = /\/([A-Za-z0-9_-]*$)/;
  const username = url.match(regex)[1];
  return username;
}

function createCSVOutput(headers, dataForRows) {
  let csvString = "";
  csvString += createCSVRow(headers);

  dataForRows.forEach(rowOfData => {
    csvString += createCSVRow(rowOfData);
  });

  return csvString;
}

function getCSVHeaders(dataSample, arrayOfDesiredKeys) {
  let headers = [];
  for (let key in dataSample) {
    if (dataSample.hasOwnProperty(key)) {
      headers.push(key);
    }
  }
  return filterOnlyForDesiredHeaders(headers, arrayOfDesiredKeys);
}

function createCSVRow(dataArray) {
  return dataArray.reduce((accumulator, current, index, srcArray) => {
    accumulator += cleanStringForCSV(String(current));
    index === srcArray.length - 1
      ? (accumulator += "\n")
      : (accumulator += "<//>");
    return accumulator;
  }, "");
}

function cleanStringForCSV(string) {
  return string.replaceAll(/\r/, "").replaceAll(/\n/, "");
}

function getDesiredKeysFromConfig() {
  const config = JSON.parse(
    fs.readFileSync("config.json", { encoding: "utf-8" })
  );
  const arrayOfConfigKeys = Object.keys(config);
  const arrayOfDesiredKeys = arrayOfConfigKeys.filter(key => {
    return config[key] === true;
  });
  return arrayOfDesiredKeys;
}

function filterForOnlyDesiredData(data, arrayOfDesiredKeys) {
  let onlyDesiredData = {};
  arrayOfDesiredKeys.forEach(key => (onlyDesiredData[key] = data[key]));
  return onlyDesiredData;
}

function filterOnlyForDesiredHeaders(headers, arrayOfDesiredKeys) {
  return headers.filter(header => arrayOfDesiredKeys.includes(header));
}

const contents = fs.readFileSync("input.txt", { encoding: "utf-8" });
const usersToFind = contents
  .replaceAll(/\n/, "")
  .replaceAll(/\s/, "")
  .split(",")
  .filter(el => (el === "" ? false : true));

const usernames = usersToFind.map(string => {
  if (string.includes("/")) {
    return getUsernameFromUrl(string);
  } else {
    return string;
  }
});

console.log("usernames: ", usernames);

const promiseArray = usernames.map(username => {
  return new Promise((resolve, reject) => {
    return axios
      .get(`https://api.github.com/users/${username}`)
      .then(response => {
        console.log(`success: ${response.data.login} (${response.data.name})`);
        resolve(response.data);
      })
      .catch(err => {
        console.log(new Error(err));
      });
  });
});

const arrayOfDesiredKeys = getDesiredKeysFromConfig();

if (arrayOfDesiredKeys.length === 0)
  console.log("Warning: All options set to false in config.json.");

const userData = Promise.all(promiseArray).then(arrayOfResponses => {
  const arrayOfFilteredResponses = arrayOfResponses.map(response => {
    return filterForOnlyDesiredData(response, arrayOfDesiredKeys);
  });

  const arrayOfRowsOfData = arrayOfFilteredResponses.map(user => {
    let rowOfData = [];
    for (let key in user) {
      if (user.hasOwnProperty(key)) {
        rowOfData.push(user[key]);
      }
    }
    return rowOfData;
  });

  const output = createCSVOutput(
    getCSVHeaders(arrayOfResponses[0], arrayOfDesiredKeys),
    arrayOfRowsOfData
  );

  fs.writeFileSync("output.txt", output);
});
