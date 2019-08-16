const accIDURL = ".api.riotgames.com/lol/summoner/v4/summoners/by-name/";
const api_key = "RGAPI-d907c69f-4d23-4468-8956-4bd83be18564";
const data={};
const header = {
    "Origin": null,
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": api_key,
}
async function getAccID(){
    requestURL = "https://" + "euw1" + accIDURL + "OnlyGlutax";
    let parameter= {
        headers: header,
        method:"GET"
    };
    await fetch(requestURL,parameter)
        .then(data=>data.json())
        .then(res => {
            console.log(res);
            result = res;
        });

}