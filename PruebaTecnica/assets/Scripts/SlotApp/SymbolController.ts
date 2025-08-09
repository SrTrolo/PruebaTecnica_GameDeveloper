
import { _decorator, Component, Node, SpriteFrame, Sprite, Animation } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SymbolController
 * DateTime = Fri Aug 01 2025 17:01:04 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = SymbolController.ts
 * FileBasenameNoExtension = SymbolController
 * URL = db://assets/Scripts/SlotApp/SymbolController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('SymbolController')
export class SymbolController extends Component {

    private _symbolID: number;
    private _symbolSprite = null;
    private _symbolAnimation: Animation;

    onLoad() {
        this._symbolAnimation = this.getComponent(Animation);
        this._symbolSprite = this.getComponent(Sprite);
    }

    public getSymbolID(){
        return this._symbolID;
    }

    public changeAnimation(id: number) {
        const clip = this._symbolAnimation.clips[id].name
        this._symbolAnimation.play(clip);
    }

    public updateSymbol(id: number, sprite: SpriteFrame) {
        this._symbolSprite.spriteFrame = sprite;
        this._symbolID = id;
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
