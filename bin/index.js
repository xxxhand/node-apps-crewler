const Cluster = require('cluster');
const App = require('./../bootstrap/App');


const server = require('http').createServer(App).listen(8089);
server.on('listening', () => {
    console.log(`Server up on ${server.address().port}`);
});
server.on('error', err => {
    console.error(`Server error ${err}`);
});

// const aa = `<meta itemprop="name" content="大掌門普拉斯"/>
// <meta itemprop="applicationCategory" content="GAME_ROLE_PLAYING"/>`;
// console.log(aa);
// const reg = /^(<meta\sitemprop=\".).+\/>/ig;

// const arr = aa.match(reg);
// console.log(arr);