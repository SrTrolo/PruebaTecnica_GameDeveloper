
import { _decorator, Component, Node, Label, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PaytableSymbolController
 * DateTime = Sat Aug 09 2025 17:33:07 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = PaytableSymbolController.ts
 * FileBasenameNoExtension = PaytableSymbolController
 * URL = db://assets/Scripts/SlotApp/PaytableSymbolController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('PaytableSymbolController')
export class PaytableSymbolController extends Component {

    @property(Label) private symbolPricesLabel: Label = null;
    @property(Node) private paytableSymbol : Node = null;
    private _paytableSymbolIndex : number = 0;

    onLoad() {

    }

    public updatePaytableSymbol(sprite: SpriteFrame, value: number, bet: number, reels: number) {
        this.paytableSymbol.getComponent(Sprite).spriteFrame = sprite;

        this.symbolPricesLabel.string = `x${reels}: ${value * reels}`;

        //MULTIPLICAR POR LA BET CUANDO LA APLIQUES
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
