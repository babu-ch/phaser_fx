import Phaser from "phaser";
import Image = Phaser.Physics.Matter.Image;

type TEffect = {name:string, args:any[]}

const effects:TEffect[] = [
    { name: "Barrel", args: [2] },
    { name: "Bloom", args: [0x00bfa5] },
    { name: "Blur", args: [1] },
    { name: "Bokeh", args: [0.5, 1, 0.2] },
    { name: "TiltShift", args: [] },
    { name: "Circle", args: [] },
    { name: "ColorMatrix", args: [] },
    { name: "Displacement", args: ['distort', 0.5, 0.5] },
    { name: "Glow", args: [0x00bfa5] },
    { name: "Gradient", args: [] },
    { name: "Pixelate", args: [] },
    { name: "Shadow", args: [] },
    { name: "Shine", args: [1, 1] },
    { name: "Vignette", args: [] },
    { name: "Wipe", args: [] },
    { name: "Reveal", args: [] }
]

export default class MyScene extends Phaser.Scene {
    private santa?: Image
    private smile?: Image
    private santaVelocityX: number = 0

    preload() {
        this.load.image("santa", "./santa.png")
        this.load.image("smile", "./smile.png")
    }
    create() {
        this.matter.world.setBounds(0, 0, this.sys.canvas.width, this.sys.canvas.height)

        // サンタ爆誕
        this.santa =
            this.matter.add.image( 50, 100, "santa")
                .setDisplaySize(100, 100)
                .setStatic(true)
        this.smile =
            this.matter.add.image( 50, 210, "smile")
                .setDisplaySize(100, 100)
                .setStatic(true)
        this.addOption()
        this.setDomEvent()
    }

    update() {
        //  サンタがどっちに動くか
        const santa = this.santa!
        const halfSanta = santa.displayWidth/2;
        if (santa.x >= (this.sys.canvas.width - (halfSanta))) {
            // 左に
            this.santaVelocityX = -1
            santa.setFlipX(false)
        } else if(santa.x <= (halfSanta)) {
            // 右に
            this.santaVelocityX = 1
            santa.setFlipX(true)
        }
        santa.x += this.santaVelocityX
        this.smile!.x += this.santaVelocityX
    }

    private setDomEvent() {
        let effect:TEffect
        let postOrPre:"postFX"|"preFX" = "preFX"
        const setEffect = (effect:TEffect) => {
            this.santa!.preFX!.clear()
            this.santa!.postFX.clear()
            this.smile!.preFX!.clear()
            this.smile!.postFX.clear()
            this.tweens.tweens.forEach((tween) => {
                tween.remove()
            })
            if (!effect || effect.name === "none") {
                return
            }
            const fxs = [
                // @ts-ignore
                this.santa![postOrPre][`add${effect.name}`](...effect.args),
                // @ts-ignore
                this.smile![postOrPre][`add${effect.name}`](...effect.args)
            ]
            console.log(fxs)
            if (effect.name === "ColorMatrix") {
                const tween = this.tweens.addCounter({
                    from: 0,
                    to: 360,
                    duration: 3000,
                    loop: -1,
                    onUpdate: () => {
                        console.error("upd", tween.getValue())
                        if (tween) {
                            fxs.forEach(fx => fx.hue(tween.getValue()));
                        }
                    }
                });
            }
            if (effect.name === "Displacement") {
                fxs.forEach(fx => {
                    this.tweens.add({
                        targets: fx,
                        x: 0.03,
                        y: 0.03,
                        yoyo: true,
                        loop: -1,
                        duration: 2000,
                        ease: "sine.inout"
                    })

                })
            }
            if (effect.name === "Wipe" || effect.name === "Reveal") {
                fxs.forEach(fx => {
                    this.tweens.add({
                        targets: fx,
                        progress: 1,
                        repeatDelay: 1000,
                        hold: 1000,
                        yoyo: true,
                        repeat: -1,
                        duration: 2000
                    });
                })
            }
        }
        document.getElementById("effectList")!.addEventListener("change", (e) => {
            effect = effects.find(effect => effect.name === (e.target as HTMLSelectElement).value) as TEffect
            setEffect(effect)
        })
        document.querySelectorAll("input[name=post_or_pre]").forEach(el => {
            el.addEventListener("change", (e) => {
                postOrPre = (e.target as HTMLInputElement).value === "post" ? "postFX" : "preFX"
                setEffect(effect)
            })
        })
    }

    private addOption() {
        // エフェクトの一覧をセレクトボックスに追加
        effects.forEach(function (effect) {
            const option = document.createElement("option");
            option.value = effect.name
            option.text = effect.name
            document.getElementById("effectList")!.appendChild(option);
        });
    }
}
