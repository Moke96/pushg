const fetch = require('node-fetch');

let baseURL = '';
const accIDURL = "summoner/v4/summoners/by-name/";
const matchesByAccountIDURL = "match/v4/matchlists/by-account/";
const matchByMatchIDURL = "match/v4/matches/";
const api_key = "RGAPI-682f96d3-b7ff-415e-a89a-d2b315e889ad";
const api_key_url = "api_key=" + api_key;

let list = '';
let region = '';
let player_name = '';

const Leagueheader = {
    "Origin": null,
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": api_key,
};

let gloabalresult = {};

async function getAccID() {
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
                if (res.status !== undefined){
                    if (res.status.status_code === 403){
                        console.log("API Key veraltet!");
                    }else {
                        console.log(res.status_code + ": " + res.status.message);
                    }
                    lastMatch = null;
                }else{
                    lastMatch = res.matches[0];
                }
                //console.log(res);
            });
    });
    return lastMatch;
}
async function getMatchStats() {
    let result = {};
    await  getLastMatch().then(async match => {
        if (match !== null){
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
        }else {
            result = null;
        }
    });
    return result;
}
async function getLastMatchStatsFromPlayer(){
    let result = {};
    await getMatchStats().then(async match => {
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


exports.writeList = async function writeList(reg, name) {
    region = reg;
    player_name = name;
    await getLastMatchStatsFromPlayer().then(async stats => {
        list = "";
        for (s in stats) {
            list += "  <li class=\"list-group-item\">" + s + ": " + stats[s] + "</li>"
        }
    });
    return list;
};