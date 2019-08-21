const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pubg = require('./js/pubg');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index', {stat: null});
});

app.post('/aram', function (req, res) {
    const aram = require('./js/aram');
    aram.getAccID()
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
