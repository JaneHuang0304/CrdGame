
import { _decorator, Component, Node, Prefab, instantiate, Vec3, EventMouse, input, Input, Label, Sprite, math, Button } from 'cc';
import { frontCtr } from './frontCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = gameManager
 * DateTime = Thu Apr 07 2022 11:04:39 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = gameManager.ts
 * FileBasenameNoExtension = gameManager
 * URL = db://assets/Script/gameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
 enum GameStat{
    GS_INI,
    GS_ING,
    GS_END,
}; 

@ccclass('gameManager')
export class gameManager extends Component {
    @property({type: Prefab})
    public CrdPrfb: Prefab | null = null;

    @property({type: Label})
    public Timer: Label | null = null;

    @property({type: Label})
    public lanSay: Label | null = null;

    @property({type: Label})
    public pairNum: Label | null = null;

    @property({type: Button})
    public mediumBtn: Button | null = null;   

    @property({type: Button})
    public easyBtn: Button | null = null;   

    @property({type: Button})
    public hardBtn: Button | null = null;   

    @property({type: Sprite})
    public startMain: Sprite | null = null; 
    
    @property({type: Sprite})
    public endMain: Sprite | null = null; 

    private nowTime: number;
    public crdRow: number;
    public cardEmptyMap = [];
    public preCrd: Array<frontCtr> = [];
    public machCrd: number;
    private PosX: number;
    private PosY = 204; 
    private CrdPos: Vec3;
    private rand: number; 
    public pairCnt = 3;

    start () {
        this.getStat = GameStat.GS_INI;
    }

    setCrdMap(){
        let cnt = this.crdRow * 3;
        for (let i = 0; i < cnt; i++) {
            this.cardEmptyMap[i] = i + 1;
        }
    }

    setTimer() {
        if (this.Timer) {
            if (this.nowTime > 0){
                this.getStat = GameStat.GS_ING;
                if (this.machCrd == 0){
                    this.lanSay.string = '懶懶說：哎唷不錯唷！';
                    this.getStat = GameStat.GS_END;
                } else {
                    this.nowTime -= 1;
                    this.Timer.string = '' + this.nowTime;
                    if (this.machCrd > 0) {
                        setTimeout(() => {
                            this.setTimer();
                        }, 1000); 
                    } 
                }
            } else {
                if (this.nowTime != null) {
                    this.lanSay.string = '懶懶說：請你加油點！！'
                    this.getStat = GameStat.GS_END;
                }
            }
        }    
    }

    set getStat(value: GameStat){
        switch(value){
            case GameStat.GS_INI:
                if (this.startMain){
                    this.startMain.node.active = true;
                }
                if (this.endMain){
                    this.endMain.node.active = false;
                }
                this.setReSet();
                break;
            case GameStat.GS_ING:
                if (this.startMain){
                    this.startMain.node.active = false;
                }
                if (this.endMain){
                    this.endMain.node.active = false;
                }
                break;
            case GameStat.GS_END:
                this.node.removeAllChildren();
                if (this.startMain){
                    this.startMain.node.active = false;
                }
                if (this.endMain){
                    this.endMain.node.active = true;
                }
                setTimeout(() => {
                    if (this.endMain){
                        this.endMain.node.active = false;
                    }
                    if (this.startMain){
                        this.startMain.node.active = true;
                    }
                }, 1000);                
                break;
        }
    }

    checkPair () {
        let result = false;
        if (this.pairCnt >= 2){
            if ((this.crdRow * 3) % this.pairCnt == 0)
                result = true;
        } 
        return result;
    }

    onMediumBtnClick(){
        this.nowTime = 40;
        this.crdRow = 4;  //3*4
        this.machCrd = (3 * this.crdRow) / this.pairCnt; 
        if (this.checkPair ()){
            this.getStat = GameStat.GS_INI;
        }
    }

    onEasyBtn(){
        this.nowTime = 20;
        this.crdRow = 2;  //3*2
        this.machCrd = (3 * this.crdRow) / this.pairCnt;
        if (this.checkPair ()){
            this.getStat = GameStat.GS_INI;
        }
    }

    onHardBtnClick(){
        this.nowTime = 60;
        this.crdRow = 6; //3*6
        this.machCrd = (3 * this.crdRow) / this.pairCnt;
        if (this.checkPair ()){
            this.getStat = GameStat.GS_INI;
        }
    }

    setReSet(){
        this.cardEmptyMap = [];
        this.preCrd = [];
        if (this.pairNum && this.pairCnt !== 0) {
            this.pairNum.string = `pair：${this.pairCnt}`;
        }
        this.setFront();
        this.setTimer();
    }

    setRandPos() {
        this.rand = 0;
        let rowGapCnt = (19 - (this.crdRow * 2)) / (this.crdRow + 1);
        let rowGap = 100 + (rowGapCnt * 50);
        this.PosX = -500 + rowGap;
        let randIndex = Math.floor(Math.random() * (this.cardEmptyMap.length));
        this.rand = this.cardEmptyMap[randIndex];
        this.cardEmptyMap.splice(randIndex, 1);
        let indexY = Math.ceil(this.rand / this.crdRow);
        let indexX = this.rand - ((this.crdRow * (indexY - 1)) + 1) + 1;
        indexY = this.PosY + ((-200) * (indexY - 1));
        indexX = this.PosX + (rowGap * (indexX - 1));   
        this.CrdPos = new Vec3(indexX, indexY, 0);
    }

    setFront() {
        this.setCrdMap();
        for (let i = 0; i < this.machCrd; i++) {
            for (let j = 0 ; j < this.pairCnt; j++){
                if (this.CrdPrfb){
                    let frontCrd = instantiate(this.CrdPrfb);
                    let frontController = frontCrd.getComponent(frontCtr);
                    frontController.GameCtr = this;
                    frontController.index = i;
                    this.setRandPos();
                    frontController.nowPos = this.rand;
                    frontController.CrdRandPos = this.CrdPos;
                    this.node.addChild(frontCrd);   
                    frontCrd.active = true;
                }
            }
        }
    }

    isMatch(): boolean {
        let result = false;
        if (this.preCrd.length == 0){
            return result;
        }

        let cardNumber = this.preCrd[0].index;
        let matchRows = this.preCrd.filter((crdCtr) => {
            return crdCtr.index == cardNumber;
        });
        result = matchRows.length == this.pairCnt;
        return result;
    }


    // update (deltaTime: number) {
    //     // [4]
    // }
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
