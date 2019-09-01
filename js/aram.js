const fetch = require('node-fetch');

let baseURL = '';
const accIDURL = "summoner/v4/summoners/by-name/";
const matchesByAccountIDURL = "match/v4/matchlists/by-account/";
const matchByMatchIDURL = "match/v4/matches/";
const api_key = "RGAPI-62795466-deb6-4561-b705-3bc09d433ee8";
const api_key_url = "api_key=" + api_key;

let list = '';
let region = '';
let player_name = '';

let parameter = {
    method: "GET"
};

async function getAccID() {
    baseURL = "https://" + region + ".api.riotgames.com/lol/";
    let result = {};

    let requestURL = baseURL + accIDURL + player_name + "?" + api_key_url;

    await fetch(requestURL, parameter)
        .then(data => data.json())
        .then(res => {
            //console.log(res);
            result = res;
        });
    return result.accountId;
}

async function getLastMatch() {
    let lastMatch = {};
    await getAccID().then(async id => {
        let queueURL = "?queue=450"; //nur ARAM
        let requestURL = baseURL + matchesByAccountIDURL + id + queueURL + "&" + api_key_url;
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
        if(match !== null) {
            let players = match.participantIdentities;
            for (i=0;i<players.length;i++){
                if (players[i].player !== undefined && players[i].player.summonerName===player_name){
                    var id = players[i].participantId;
                    break;
                }
            }
            result = match.participants[id-1];
        } else {
            result = null;
        }
    });
    return result;
}


exports.writeList = async function writeList(reg, name) {
    region = reg;
    player_name = name;
    await getLastMatchStatsFromPlayer().then(async participant => {
        list = "";
        for (s in participant) {
            list += "<li class=\"list-group-item\">" + s + ":" + participant[s] + "</li>"
        }
        for (s in participant.stats) {
            list += "<li class=\"list-group-item\">" + s + ":" + participant.stats[s] + "</li>"
        }
    });
    return list;
};