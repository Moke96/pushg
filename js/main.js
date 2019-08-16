const url= "https://api.pubg.com/shards/";
const header = {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlZmU3NDI2MC05ZmVmLTAxMzctYmZkOC0zOTE0OTdlOTY2MmYiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY1Njk3NjU4LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im1hdXJpY2UtbWF0dXNjIn0.XF8ZcDnn8kb0LyMBatXq7TZksY8iHd2LrT6r7S7Onjw",
    "Accept": "application/vnd.api+json"
};
const data={};
function getPlayerJson(){
    let platform = $("#platform").val() + "/";
    let player_name = $("#player_name").val();
    let player_stats_url = url + platform + "players?filter[playerNames]=" + player_name;
    let parameter= {
        headers: header,
        method:"GET"
    };
    fetch(player_stats_url,parameter)
        .then(data=>data.json())
        .then(res=>{console.log(res)})
        .then(error=>console.log(error))
}