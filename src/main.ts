import Phaser from "phaser";
import MyScene from "./scenes/MyScene";

const parent = document.getElementById("game")

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width:400,
    height:300,
    physics: {
        default: "matter",
        matter: {
            // debug: true,
            gravity: { y: 1 },
            enableSleeping: true
        },
    },
    scene: MyScene,
    backgroundColor: "#FFF",
    parent: parent!,
};
new Phaser.Game(config);