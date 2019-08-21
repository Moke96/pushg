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
    platform = $("#platform").val() + "/";
    let player_name = $("#player_name").val();
    let player_stats_url = url + platform + "players?filter[playerNames]=" + player_name;
    let result = {};
    await fetch(player_stats_url, parameter)
        .then(data => data.json())
        .then(res => {
            //console.log(res);
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
        method:"GET"
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

async function writeList() {
    $('#player_stats').html("");
    let list = "";
    await getLatestMatchResults().then(stats => {
        for (s in stats) {
            list += "  <li class=\"list-group-item\">"+s+": "+stats[s]+"</li>"
        }
        $('#player_stats').html(list);
    })
}