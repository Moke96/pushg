var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index', {stat: null});
});
app.post('/aram', function (req, res) {
    let region = req.body.region;
    let name = req.body.playername;
    const baseURL = "https://" + region + ".api.riotgames.com/lol/";
    const accIDURL = "summoner/v4/summoners/by-name/";
    const matchesByAccountIDURL = "match/v4/matchlists/by-account/";
    const matchByMatchIDURL = "match/v4/matches/";
    const api_key = "RGAPI-a4ae2208-ccd0-46bd-8078-f408eed12523";
    const api_key_url = "api_key=" + api_key;

    const Leagueheader = {
        "Origin": null,
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Riot-Token": api_key,
    };

    let gloabalresult = {};

    async function getAccID() {
        let result = {};

        let requestURL = baseURL + accIDURL + name + "?" + api_key_url;
        let parameter = {
            //headers: header,
            method: "GET"
        };

        await fetch(requestURL, parameter)
            .then(data => data.json())
            .then(res => {
                console.log(res);
                result = res;
            });
        return result.accountId;
    }

    async function getLastMatch() {
        let result = {};
        let lastMatch = {};
        await getAccID().then(async id => {
            let queueURL = "?queue=450"; //nur ARAM
            let requestURL = baseURL + matchesByAccountIDURL + id + queueURL + "&" + api_key_url;
            let parameter = {
                method: "GET"
            };
            await fetch(requestURL, parameter)
                .then(data => data.json())
                .then(res => {
                    console.log(res);
                    lastMatch = res.matches[0];
                });

        });
        return lastMatch;
    }
    async function getMatchStats() {
        let result = {};
        await  getLastMatch().then(async match => {
            let matchID = match.gameId;
            let requestURL = baseURL + matchByMatchIDURL + matchID + "?" + api_key_url;
            let parameter = {
                method: "GET"
            };

            await fetch(requestURL,parameter)
                .then(data => data.json())
                .then(res => {
                    console.log(res);
                    result = res;
                });

        })
        return result;
    }
    async function getLastMatchStatsFromPlayer(){
        let result = {};
        await getMatchStats().then(async match => {
            let players = match.participantIdentities;
            for (i=0;i<players.length;i++){
                if (players[i].player !== undefined && players[i].player.summonerName===name){
                    var id = players[i].participantId
                    break;
                }
            }
            result = match.participants[id-1].stats;
        });
        return result;
    }
    async function writeStatList() {
        await getLastMatchStatsFromPlayer().then(async stats => {
            list = "";
            for (s in stats) {
                list += "  <li class=\"list-group-item\">" + s + ": " + stats[s] + "</li>"
            }
            res.render('aram', {stat: list})
        })
    }
    writeStatList();
});
app.post('/pubg', function (req, res) {
    const url = "https://api.pubg.com/shards/";
    const header = {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlZmU3NDI2MC05ZmVmLTAxMzctYmZkOC0zOTE0OTdlOTY2MmYiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY1Njk3NjU4LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im1hdXJpY2UtbWF0dXNjIn0.XF8ZcDnn8kb0LyMBatXq7TZksY8iHd2LrT6r7S7Onjw",
        "Accept": "application/vnd.api+json"
    };
    let parameter = {
        headers: header,
        method: "GET"
    };
    let platform = "";
    let id = "";
    let playerID = "";
    const data = {};

    /**
     * Holt sich das PlayerObject anhand des eingegebenen Spielernames und Platform
     */
    async function getPlayerJson() {
        platform = req.body.platform + "/";
        let player_name = req.body.playername;
        let player_stats_url = url + platform + "players?filter[playerNames]=" + player_name;
        let result = {};
        await fetch(player_stats_url, parameter)
            .then(data => data.json())
            .then(res => {
                console.log(res);
                result = res;
            });
        return result;
    }

    async function getLatestMatchFromPlayer() {
        const matches_url = "matches/";
        let result = null;
        let parameters = {
            headers: {
                "Accept": "application/vnd.api+json"
            },
            method: "GET"
        };
        await getPlayerJson().then(async playerObject => {
            if (playerObject === undefined || playerObject === null) {
                throw new Error('Kein Spieler Object gefunden!')
            }
            let latestMatchID = playerObject.data[0].relationships.matches.data[0].id;
            playerID = playerObject.data[0].id;
            const latest_Match_url = url + platform + matches_url + latestMatchID;
            await fetch(latest_Match_url, parameters)
                .then(data => data.json())
                .then(res => {
                    console.log(res);
                    result = res;
                })
                .then(error => console.log(error))
        });
        return result;
    }

    async function getLatestMatchResults() {
        let playerStats = {};
        await getLatestMatchFromPlayer().then(matchObject => {
            if (matchObject === undefined || matchObject === null) {
                throw new Error('Kein Match Object gefunden!')
            }
            for (i = 0; i < matchObject.included.length; i++) {
                let match = matchObject.included[i];
                if (match.type === "participant" && match.attributes.stats.playerId === playerID) {
                    playerStats = match.attributes.stats;
                    break;
                }
            }
        });
        return playerStats;
    }

    let list = "";

    async function writeList() {
        list = "";
        await getLatestMatchResults().then(stats => {
            for (s in stats) {
                list += "  <li class=\"list-group-item\">" + s + ": " + stats[s] + "</li>"
            }
            res.render('pubg', {stat: list})
        })
    }

    writeList();
});
app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
