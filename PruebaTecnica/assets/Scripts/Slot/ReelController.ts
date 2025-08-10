
import {
    _decorator,
    Component,
    Node,
    tween,
    log,
    UITransform,
    Layout,
    Prefab,
    math,
    instantiate,
    Animation
} from 'cc';
import {SlotManager} from "db://assets/Scripts/Slot/SlotManager";
import {Paytable} from "db://assets/Scripts/Slot/Paytable";
import {SymbolController} from "./SymbolController";

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

    @property(Prefab) public symbolPrefab: Prefab = null;
    @property(Node) public symbolContent: Node = null;

    private _symbols: Node[] = [];

    private _symbolSpacing: number = 0;
    private _totalSpacing : number = 0;
    private _symbolHeight: number = 0;
    private _finalPosY: number = 0;
    private _initialPosY: number = 0;

    private _canSpin : boolean = false;
    private _canStop : boolean = false;

    private _currentReelSpeed : number = 0;

    private _reelAnimation : Animation = null;

    private _forceSymbol : number = -1;

    private setReelProperties(symbolAmmount: number) {
        this._symbols = this.symbolContent.children;
        //Tamaño del simbolo (Hecho para que todos sean iguales)
        this._symbolHeight =  this._symbols[0].getComponent(UITransform).contentSize.height;
        //Spacing del layout
        this._symbolSpacing = this.symbolContent.getComponent(Layout).spacingY;
        //Espaciado entre simbolos
        this._totalSpacing = this._symbolHeight + this._symbolSpacing;
        //Posición de spawn de los simbolos
        this._initialPosY = this._symbols[0].position.y + this._totalSpacing;
        //Posición de despawn de los simbolos
        this._finalPosY = this._initialPosY - (this._totalSpacing * symbolAmmount);
        //Animación de los reels
        this._reelAnimation = this.symbolContent.getComponent(Animation);
    }

    public createSymbols(symbolAmmount: number) {
        for (let i = 0; i < symbolAmmount; i++) {
            let newSymbol= instantiate(this.symbolPrefab);
            newSymbol.parent = this.symbolContent;
            this.updateSymbol(newSymbol);
        }
        //Hago Update del Layout para actualizar las posiciones de los símbolos:
        this.symbolContent.getComponent(Layout).updateLayout();
        this.setReelProperties(symbolAmmount);
    }

    public playReelAnimation(id: number) {
        const clip = this._reelAnimation.clips[id].name
        this._reelAnimation.play(clip);
    }

    startSpin(finalSpeed:number, time:number, forceSymbol:number) {
        if (this._canSpin) return;
        this._canSpin = true;

        //Int para forzar simbolos
        this._forceSymbol = forceSymbol;

        //Animación del reel
        this.playReelAnimation(0);
        log(`Reel ${this.reelId}: inicio de giro`);

        //Incremento de la velocidad
        const increaseState: { speed: number } = { speed: this._currentReelSpeed };

        tween(increaseState)
            .to(time, { speed: finalSpeed }, {
                easing:"quadOut",
                onUpdate: () => {
                    this._currentReelSpeed = increaseState.speed;
                },
                onComplete: () => {
                    this._currentReelSpeed = Math.round(finalSpeed);
                }
            })
            .start();
    }

    update(deltaTime: number) {
        //Condición para que la logica del update solo se lea cuando _canSpin
        if (!this._canSpin) return;

        for (let i = 0; i < this._symbols.length; i++) {

            const symbol = this._symbols[i];
            const currentPos = symbol.position;

            // Movimiento de los simbolos
            const posY = currentPos.y - this._currentReelSpeed * deltaTime;
            symbol.setPosition(currentPos.x, posY, currentPos.z);

            // Si pasa el límite inferior, recolocar arriba
            if (posY < this._finalPosY) {

                // Parada de los reels si _canStop
                if (this._canStop) {
                    //Animación reel
                    this.playReelAnimation(1);
                    //Reseteamos boleanas
                    this._canStop = false;
                    this._canSpin = false;
                    this._currentReelSpeed = 0;

                    //Actualizar posiciones del array de simbolos
                    this._symbols = this.getNewSymbolPosition(i);

                    //Forzar posición exacta de los simbolos
                    for (let j = 0; j < this._symbols.length; j++) {
                        const newSymbol = this._symbols[j];
                        const y = this._initialPosY - (this._totalSpacing * (j+1));
                        newSymbol.setPosition(0, y, 0);
                    }
                    //Una vez colocados, informar a SlotManager de que ha terminado el SPIN
                    log(`Reel ${this.reelId}: fin de giro`);
                    SlotManager.instance.eventTarget.emit('reelStopped', this.reelId);

                }
                else{
                    //Colocar simbolo correctamente
                    const resetY = posY + this._totalSpacing * this._symbols.length;
                    symbol.setPosition(currentPos.x, resetY, currentPos.z);
                    this.updateSymbol(symbol);
                }
            }
        }
    }

    private updateSymbol(symbol: Node) {
        //Escoger simbolo random de la paytable
        const paytable = Paytable.Paytable;
        let symbolID = this._forceSymbol;

        if(this._forceSymbol < 0){
            symbolID = randomRangeInt(0, paytable.length);
        }

        const data = paytable[symbolID];
        symbol.getComponent(SymbolController).updateSymbol(data.symbolID, data.symbolSprite);

    }

    public getNewSymbolPosition(startIndex: number): Node[] {
        // Crear el nuevo array ordenado lógicamente desde el símbolo con id: startIndex
        const newSymbols = [];

        for (let i = 1; i < this._symbols.length + 1; i++) {
            const pos = (startIndex + i) % this._symbols.length;
            newSymbols.push(this._symbols[pos]);
        }

        return newSymbols;
    }

    public getSymbolIDAt(symbolIndex: number): number {
        return this._symbols[symbolIndex].getComponent(SymbolController).getSymbolID();
    }
    public animateSymbol(symbolIndex: number, animationID: number) {
        this._symbols[symbolIndex].getComponent(SymbolController).changeAnimation(animationID);
    }
    public resetAllAnimations() {
        for (let i = 0; i < this._symbols.length; i++) {
            this._symbols[i].getComponent(SymbolController).changeAnimation(0);
        }
    }

    public stopSpin(finalSpeed: number, time: number) {
        if(!this._canSpin) return;

        //Decremento de la velocidad
        const decreaseState: { speed: number } = { speed: this._currentReelSpeed };
        tween(decreaseState)
            .to(time, { speed: finalSpeed }, {
                easing:"quadOut",
                onUpdate: () => {
                    this._currentReelSpeed = decreaseState.speed;
                },
                onComplete: () => {
                    this._canStop = true;
                }
            })
            .start();
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
