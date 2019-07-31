let teams = require('./teams.json');
const fs = require('fs');
const request = require('request');

async function generateTeams() {

  const newTeams = teams.players.reduce((acc, cur, index) => {
    if (index === 1) {
      const set = {};

      for (team of teams.teams) {
        set[team] = [];
        if (acc[team])
          set[team].push(acc[team]);
        else
          set[team].push(-1);
      }

      acc = set;
    }

    for (team of teams.teams) {
      if (cur[team])
        acc[team].push(cur[team]);
      else
        acc[team].push(-1);
    }
    return acc;
  });

  fs.writeFile("./warbot.json", JSON.stringify(newTeams), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });

  return new Promise((resolve, reject) => {
    request({
      uri: 'https://api.myjson.com/bins',
      method: 'POST',
      json: newTeams,
    }, (err, response, body) => {
      if (err) {
        reject(err);
      } 
      resolve(response);
    });

  });
}

generateTeams().then((result) => {
  console.log(result.body.uri);
});