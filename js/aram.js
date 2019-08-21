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