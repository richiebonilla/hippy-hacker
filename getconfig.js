const axios = require("axios");
const fs = require("fs");

const sampleQuery = "https://api.github.com/users/octocat";

async function fetchData(url) {
  return await axios
    .get(url)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(new Error(err));
    });
}

function turnAllConfigValuesToBooleans(json, bool) {
  let newJSON = {};
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      newJSON[key] = bool;
    }
  }
  return newJSON;
}

function writeJSONToFile(json) {
  let config = JSON.stringify(json, null, " ");
  fs.writeFileSync("config.json", config);
}

fetchData(sampleQuery)
  .then(data => {
    return turnAllConfigValuesToBooleans(data, true);
  })
  .then(json => {
    writeJSONToFile(json);
  })
  .then(_ => console.log("Config created in config.json"))
  .catch(err => new Error(err));
