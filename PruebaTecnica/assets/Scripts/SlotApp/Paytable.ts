
import { _decorator, Component, Node, Color, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Paytable
 * DateTime = Sun Aug 03 2025 11:43:43 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = Paytable.ts
 * FileBasenameNoExtension = Paytable
 * URL = db://assets/Scripts/SlotApp/Paytable.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('Paytable')
export class Paytable extends Component {

    @property([SpriteFrame]) symbolSprite: SpriteFrame[] = [];

    public static Paytable: SymbolData[] = [];


    onLoad() {
        // Creación de paytable
        Paytable.Paytable = [
            new SymbolData(0, "BALLOON", this.symbolSprite[0], 2),
            new SymbolData(1, "MUSIC", this.symbolSprite[1], 2),
            new SymbolData(2, "CANDY", this.symbolSprite[2], 2),
            new SymbolData(3, "PAW", this.symbolSprite[3], 5),
            new SymbolData(0, "HAT", this.symbolSprite[4], 5),
            new SymbolData(1, "STAR", this.symbolSprite[5], 10),
            new SymbolData(2, "ALPACA", this.symbolSprite[6], 10),
            new SymbolData(3, "CROWN", this.symbolSprite[7], 15),
        ];
    }
}

export class SymbolData{
    public symbolID: number;
    public symbolName: string;
    public symbolSprite: SpriteFrame;
    public symbolValue: number;

    constructor(symbolID: number, symbolName: string, symbolSprite: SpriteFrame, symbolValue: number) {
        this.symbolID = symbolID;
        this.symbolName = symbolName;
        this.symbolSprite = symbolSprite;
        this.symbolValue = symbolValue;
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
