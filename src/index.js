import 'phaser';

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
    this.load.image('bg', 'assets/blue.png');

    this.load.spritesheet([{ file: 'assets/shards.png', key: 'shards', config: { frameWidth: 16, frameHeight: 16 } }]);
}

function create ()
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
}
