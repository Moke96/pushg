const fetch = require('node-fetch');

const championsURL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json ";
const championSquareURL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/";

async function getChampions() {
    let result = '';
    await fetch(championsURL)
        .then(data => data.json())
        .then(res => {
            result = res;
        });
    return result;
}

exports.getChampionSquare = async function (stats) {
    let result ='';
    let champions = '';
    let championName = '';
    await getChampions()
        .then(res => {
            champions = res;
        });
    for(i in champions.data) {
        if(champions.data[i].key === stats.championId.toString()) {
            championName = champions.data[i].id.toString();
            result = ('<img src=' + championSquareURL + championName + '.png>');
            console.log(championName);
            console.log(result);
            return result;
        }
    }
}