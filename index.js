const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
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

app.post('/pubg', function (req, res) {
    let platform = req.body.platform + '/';
    let player_name = req.body.playername;

    pubg.writeList(platform, player_name)
        .then(data => res.render('pubg', {stat: data}))
        .catch(err => console.log(err));
});

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
