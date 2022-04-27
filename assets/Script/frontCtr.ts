
import { _decorator, Component, Node, Animation, animation, SpriteFrame, Sprite, resources, ImageAsset, Vec3, math, BatchedSkinningModelComponent, random, dragonBones } from 'cc';
import { gameManager } from './gameManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = frontCtr
 * DateTime = Thu Apr 07 2022 11:15:29 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = frontCtr.ts
 * FileBasenameNoExtension = frontCtr
 * URL = db://assets/Script/frontCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('frontCtr')
export class frontCtr extends Component {

    @property({type: gameManager})
    public GameCtr: gameManager | null = null;

    private anim: Animation;
    public nowPos: number; //1~6...18
    public index: number;  //0~2...8
    private isBack = true;
    public CrdRandPos: Vec3;

    public needChangedSpiriteFrame = false;
    private animRunTime: number = 0;
    private isRunAnimate: Boolean = false;

    start () {
        this.node.setPosition(this.CrdRandPos);
        this.anim = this.node.getComponent(Animation);
    }

    async onClick(){
        if (this.isRunAnimate)
            return;

        if (!this.isBack)
            return;

        if (this.GameCtr.preCrd.length == this.GameCtr.pairCnt)
            return;

        await this.showCrd();
        // await this.runAnim('open', true);
        // await this.runAnim('close', false);
        // console.log('haha');
    }

    async runAnim(action: string, isWait: boolean) {
        console.log(`action:: ${action}`);
        switch(action) {
            case "open":
                this.animRunTime = 0;
                this.anim.play();
                this.needChangedSpiriteFrame = true;
                break;

            case "close":
                this.animRunTime = 0;
                this.anim.play('flipClose');
                this.needChangedSpiriteFrame = true;
                break;

            default:
                break;
        }

        this.isRunAnimate = true;
        return new Promise((resolve, reject) => {
            if (isWait){
                setTimeout(() => {
                    this.isRunAnimate = false;
                    resolve("");
                }, 1000);
            }else{
                resolve("");
            }
        });        
   
    }

    setAnim(action: string) {
        console.log(`${this.index} run setAnim ${action}`)
        switch(action) {
            case "open":
                this.animRunTime = 0;
                this.anim.play();
                this.needChangedSpiriteFrame = true;
                break;

            case "close":
                this.animRunTime = 0;
                this.anim.play('flipClose');
                this.needChangedSpiriteFrame = true;
                break;

            default:
                break;
        }

        this.isRunAnimate = true;
        setTimeout(() => {
            this.isRunAnimate = false;
        }, 1000)
    }

    async showCrd() {
        this.GameCtr.preCrd.push(this.node.getComponent(frontCtr)); 
        this.setAnim('open');
        let isClose = await this.IsMatch();
        await this.Close(isClose);
    }

    async IsMatch(): Promise<boolean> {
        return new Promise((resolve, reject) => {        
            if (this.GameCtr.preCrd.length == this.GameCtr.pairCnt){
                setTimeout(() => {  
                    if (this.GameCtr.isMatch()) {
                        this.GameCtr.preCrd.forEach((crdCtr) => {
                            crdCtr.node.active = false;
                        });
                        this.GameCtr.preCrd = [];
                        this.GameCtr.machCrd -= 1;  
                        resolve(false); 
                    } else {
                        resolve(true);
                    }                
                }, 1000);
            } else {
                resolve(false); 
            }
        });
    }

    async Close(isClose: boolean){
        return new Promise((resolve, reject) => {
            console.log(`run close promise`);
            if (isClose) {
                this.GameCtr.preCrd.forEach((crdCtr) => {
                    crdCtr.setAnim("close");
                });
                setTimeout(() => {
                    this.GameCtr.preCrd = [];
                    resolve("");
                }, 1000);
            } else{
                resolve("");
            }
        });

    }

    update (deltaTime: number) {
        if (this.needChangedSpiriteFrame) {
            this.animRunTime += deltaTime;
            if (this.animRunTime >= 0.5) {
                let picUrl;
                if (!this.isBack) {
                    picUrl = '懶懶卡牌背面/spriteFrame';
                } else {
                    picUrl = `懶懶卡牌${this.index + 1}/spriteFrame`;
                }
                this.setCrdPic(picUrl);
                this.isBack = !this.isBack;
                this.needChangedSpiriteFrame = false;
            }
        }
    }

    setCrdPic(pic: string){
        resources.load(pic, SpriteFrame, (err: any, spriteFrame) => {
            let sprite = this.getComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
         });
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
