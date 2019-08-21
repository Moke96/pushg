const fetch = require('node-fetch');

let baseURL = '';
const accIDURL = "summoner/v4/summoners/by-name/";
const matchesByAccountIDURL = "match/v4/matchlists/by-account/";
const matchByMatchIDURL = "match/v4/matches/";
const api_key = "RGAPI-1a3db87c-72d8-4d73-b02d-13e261a73675";
const api_key_url = "api_key=" + api_key;

let list = '';

const Leagueheader = {
    "Origin": null,
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": api_key,
};

let gloabalresult = {};

async function getAccID(region, player_name) {
    baseURL = "https://" + region + ".api.riotgames.com/lol/";
    let result = {};

    let requestURL = baseURL + accIDURL + player_name + "?" + api_key_url;
    let parameter = {
        //headers: header,
        method: "GET"
    };

    await fetch(requestURL, parameter)
        .then(data => data.json())
        .then(res => {
            //console.log(res);
            result = res;
        });
    return result.accountId;
}

async function getLastMatch(region, player_name) {
    let result = {};
    let lastMatch = {};
    await getAccID(region, player_name).then(async id => {
        let queueURL = "?queue=450"; //nur ARAM
        let requestURL = baseURL + matchesByAccountIDURL + id + queueURL + "&" + api_key_url;
        let parameter = {
            method: "GET"
        };
        await fetch(requestURL, parameter)
            .then(data => data.json())
            .then(res => {
                //console.log(res);
                lastMatch = res.matches[0];
            });

    });
    return lastMatch;
}
async function getMatchStats(region, player_name) {
    let result = {};
    await  getLastMatch(region, player_name).then(async match => {
        let matchID = match.gameId;
        let requestURL = baseURL + matchByMatchIDURL + matchID + "?" + api_key_url;
        let parameter = {
            method: "GET"
        };

        await fetch(requestURL,parameter)
            .then(data => data.json())
            .then(res => {
                //console.log(res);
                result = res;
            });

    })
    return result;
}
async function getLastMatchStatsFromPlayer(region, player_name){
    let result = {};
    await getMatchStats(region, player_name).then(async match => {
        let players = match.participantIdentities;
        for (i=0;i<players.length;i++){
            if (players[i].player !== undefined && players[i].player.summonerName===player_name){
                var id = players[i].participantId
                break;
            }
        }
        result = match.participants[id-1].stats;
    });
    return result;
}


exports.writeList = async function writeList(region, player_name) {
    await getLastMatchStatsFromPlayer(region, player_name).then(async stats => {
        list = "";
        for (s in stats) {
            list += "  <li class=\"list-group-item\">" + s + ": " + stats[s] + "</li>"
        }
    });
    return list;
};