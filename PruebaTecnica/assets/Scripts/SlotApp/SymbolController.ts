
import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
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

    @property(Sprite)
    sprite: Sprite | null = null;

    // Actualiza el símbolo con una nueva imagen
    public updateSymbol(newSpriteFrame: SpriteFrame) {
        if (this.sprite) {
            this.sprite.spriteFrame = newSpriteFrame;
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
