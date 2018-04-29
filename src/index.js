import 'phaser';

// import the assets as base-64 data-uri strings with url-loader (see webpack.config.js)
import blueSrc from '../assets/blue.png'
import shardsSrc from '../assets/shards.png'
import sfxSrc from '../assets/sfx.mp3'

// the json file can be loaded by webpack. url-loader doesn't apply here
import sfxJson from '../assets/sfx.json'

// this is a small helper to convert the audio (see package.json)
import toArrayBuffer from 'to-array-buffer'

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 512,
    height: 512,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var bg;
var shards;
var emitter;
var timedEvent;

function preload ()
{
    // original loading methods for web (with xhr requests)
    // ____________________________________________________

    //this.load.image('bg', 'assets/blue.png');
    //this.load.spritesheet([{ file: 'assets/shards.png', key: 'shards', config: { frameWidth: 16, frameHeight: 16 } }]);
    //this.load.audioSprite('sfx', ['assets/sfx.ogg', 'assets/sfx.mp3'], 'assets/sfx.json');
}

function create ()
{
    // new methods for loading the assets as data-uri's
    // adding them directly to the textures and/or cache
    // We don't place this in the preloader, because
    // the preloader will immediatly return and
    // we have our own async stuff and the assets won't
    // be ready in the create function where we normally
    // add our gameObjects
    // _________________________________________________

    var nAssets = 4;
    var nLoaded = 0; // keep track

    // method for a simple image
    this.textures.addBase64('bg', blueSrc);
    nLoaded++;

    // method for a spritesheet
    var shardsImg = new Image();
    shardsImg.onload = () => {
        this.textures.addSpriteSheet('shards', shardsImg, { frameWidth: 16, frameHeight: 16 });
        // check if assets are ready then call actual phaser create function
        nLoaded++;
        if (nLoaded >= nAssets) {
            var actualCreate = createGameObjects.bind(this);
            actualCreate();
        }
    };
    shardsImg.src = shardsSrc;

    // method for an audiosprite json file
    this.cache.json.add('sfx', sfxJson);
    nLoaded++;

    // method for an audiosprite json file
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.decodeAudioData(toArrayBuffer(sfxSrc), (buffer) => {
        this.cache.audio.add('sfx', buffer);
        // check if assets are ready then call actual phaser create function
        nLoaded++;
        if (nLoaded >= nAssets) {
            var actualCreate = createGameObjects.bind(this);
            actualCreate();
        }
    }, (e) => { console.log("Error with decoding audio data" + e.err); });
}

// the rest of the code is to check if everything loaded correctly
// normally we place this in the create function
function createGameObjects ()
{
    bg = this.add.image(256, 256, 'bg');
    shards = this.add.particles('shards');
    emitter = shards.createEmitter({
        frame: [0, 1, 2, 3],
        x: 200,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 2, end: 0 },
        lifespan: 600,
        gravityY: 800,
        frequency: -1,
        rotate: { min: -540, max: 540 }
    });
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
}

function onEvent ()
{
    emitter.explode(8, 128 + Math.floor(Math.random() * 256), 128 + Math.floor(Math.random() * 256));
    this.sound.playAudioSprite('sfx', 'glass');
}
