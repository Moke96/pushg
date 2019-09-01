let node = document.getElementById('player_stats');

let championsURL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json ";
let championSquareURL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/";

async function getChampions() {
    let result = '';
    await fetch(championsURL)
        .then(data => data.json())
        .then(res => {
            result = res;
        });
    return result;
}

async function getChampionSquare(stats) {
    let result ='';
    let champions = '';
    let championName = '';
    await getChampions()
        .then(res => {
            champions = res;
        });
    for(i=0; i<champions.data.length();i++) {
        if(champions.data[i].key === stats.championID) {
            championName = champions.data[i].id;
        }
    }
    console.log(champions.data);

    node.html('<img src=' + championSquareURL + 'Aatrox' + '.png');
}