const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const aram = require('./js/aram');
const pubg = require('./js/pubg');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index', {stat: null});
});

app.post('/aram', async function (req, res) {
    let region = req.body.region;
    let player_name = req.body.playername;

    let data = await aram.writeList(region, player_name);
    res.render('aram', {stat: data})
});

app.post('/pubg', async function (req, res) {
    let platform = req.body.platform + '/';
    let player_name = req.body.playername;

    let data = await pubg.writeList(platform, player_name);
    //console.log(data);
    res.render('pubg', {stat: data});
});

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
