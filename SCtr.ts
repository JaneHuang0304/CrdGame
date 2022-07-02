
import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3 } from 'cc';
import { TetrisCtrl } from './TetrisCtrl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SCtr
 * DateTime = Tue Jun 28 2022 16:17:21 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = SCtr.ts
 * FileBasenameNoExtension = SCtr
 * URL = db://assets/Script/SCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('SCtr')
export class SCtr extends TetrisCtrl {

    public setTrans(){
        //設置旋轉位置
        this.SpPos = [];
        switch(this.angle){
            case 0:
                this.SpPos.push(new Vec3(80, 40, 0));
                this.SpPos.push(new Vec3(40, 40, 0));
                this.SpPos.push(new Vec3(40, 0, 0));
                this.SpPos.push(new Vec3(0, 0, 0));
                this.angle = 90;
            break;

            case 90:
                this.SpPos.push(new Vec3(0, 80, 0));
                this.SpPos.push(new Vec3(0, 40, 0));
                this.SpPos.push(new Vec3(40, 40, 0));
                this.SpPos.push(new Vec3(40, 0, 0));
                this.angle = 0;
                break;
        }

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
