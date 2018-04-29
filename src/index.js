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

function preload ()
{
    this.load.image('bg', 'assets/blue.png');
}

function create ()
{
    var logo = this.add.image(256, 256, 'bg');
}
