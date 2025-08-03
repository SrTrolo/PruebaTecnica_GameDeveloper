
import {
    _decorator,
    Component,
    Node,
    SpriteFrame,
    tween,
    Vec3,
    log,
    UITransform,
    Layout,
    Prefab,
    math,
    Sprite,
    instantiate
} from 'cc';
import {SlotManager} from "db://assets/Scripts/SlotApp/SlotManager";
import {Paytable} from "db://assets/Scripts/SlotApp/Paytable";

const {randomRangeInt} = math;
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ReelController
 * DateTime = Fri Aug 01 2025 16:35:55 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = ReelController.ts
 * FileBasenameNoExtension = ReelController
 * URL = db://assets/Scripts/SlotApp/ReelController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ReelController')
export class ReelController extends Component {
    @property reelId: number = 0;
    @property reelSpeed: number = 0;

    @property(Prefab) public symbolPrefab: Prefab = null;


    private _symbols: Node[] = [];

    private _symbolSpacing: number = 50;
    private _totalSpacing : number = 0;
    private _symbolHeight: number = 300;
    private _finalPosY: number = 0;
    private _initialPosY: number = 0;

    private _canSpin : boolean = false;
    private _canStop : boolean = false;
    private _spinTime : number = 5;

    private _maxSpeed : number = 1000;

    private setReelProperties(symbolAmmount: number) {
        this._symbols = this.node.children;
        //Tamaño del simbolo (Hecho para que todos sean iguales)
        this._symbolHeight =  this._symbols[0].getComponent(UITransform).contentSize.height;
        //Spacing del layout
        this._symbolSpacing = this.getComponent(Layout).spacingY;
        //Espaciado entre simbolos
        this._totalSpacing = this._symbolHeight + this._symbolSpacing;
        //Posición de spawn de los simbolos
        this._initialPosY = this._symbols[0].position.y + this._totalSpacing;
        //Posición de despawn de los simbolos
        this._finalPosY = this._initialPosY - (this._totalSpacing * symbolAmmount);
    }

    public createSymbols(symbolAmmount: number) {
        for (let i = 0; i < symbolAmmount; i++) {
            let newSymbol= instantiate(this.symbolPrefab);
            newSymbol.parent = this.node;
            this.updateSymbol(newSymbol);
        }
        //Hago Update del Layout para actualizar las posiciones de los símbolos:
        this.node.getComponent(Layout).updateLayout();
        this.setReelProperties(symbolAmmount);
    }

    startSpin() {
        if (this._canSpin) return;

        log(`Reel ${this.reelId}: inicio de giro`);
        //TWEEN DE VELOCIDAD
        this.reelSpeed = this._maxSpeed;
        this._canSpin = true;
    }

    update(deltaTime: number) {
        //Condición para que la logica del update solo se lea cuando _canSpin
        if (!this._canSpin) return;

        for (let i = 0; i < this._symbols.length; i++) {

            const symbol = this._symbols[i];
            const currentPos = symbol.position;

            // Movimiento de los simbolos
            const posY = currentPos.y - this.reelSpeed * deltaTime;
            symbol.setPosition(currentPos.x, posY, currentPos.z);

            // Si pasa el límite inferior, recolocar arriba
            if (posY < this._finalPosY) {
                const resetY = posY + this._totalSpacing * this._symbols.length;
                symbol.setPosition(currentPos.x, resetY, currentPos.z);
                this.updateSymbol(symbol);

                // Parada de los reels si _canStop
                if (this._canStop) {
                    //Reseteamos boleanas
                    this._canStop = false;
                    this._canSpin = false;
                    this.reelSpeed = 0;

                    //Actualizar posiciones del array de simbolos
                    this._symbols = this.getNewSymbolPosition(i);

                    //Forzar posición exacta de los simbolos
                    for (let j = 0; j < this._symbols.length; j++) {
                        const newSymbol = this._symbols[j];
                        const y = this._initialPosY - (this._totalSpacing * j);

                        newSymbol.setPosition(0, y, 0);
                    }
                    //Una vez colocados, informar a SlotManager de que ha terminado el SPIN
                    SlotManager.instance.eventTarget.emit('reelStopped', this.reelId);
                    log(`Reel ${this.reelId}: fin de giro`);
                }
            }
        }
    }

    private updateSymbol(symbol: Node) {
        //Escoger simbolo random de la paytable
        const randomSymbol= Paytable.Paytable[randomRangeInt(0, Paytable.Paytable.length - 1)];
        //log(`Símbolo elegido: ${randomSymbol.symbolName}`);
        //Actualizar visuales
        symbol.getComponent(Sprite).spriteFrame = randomSymbol.symbolSprite;
    }

    public getNewSymbolPosition(startIndex: number): Node[] {
        // Crear el nuevo array ordenado lógicamente desde el símbolo con id: startIndex
        const newSymbols = [];

        for (let i = 0; i < this._symbols.length; i++) {
            const pos = (startIndex + i) % this._symbols.length;
            newSymbols.push(this._symbols[pos]);
        }
        return newSymbols;
    }

    public stopSpin() {
        if(!this._canSpin) return;
        //TWEEN BAJAR VELOCIDAD
        this._canStop = true;
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
