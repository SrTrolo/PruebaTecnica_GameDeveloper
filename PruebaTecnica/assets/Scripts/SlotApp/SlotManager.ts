
import {_decorator, Component, Node, EventTarget, log, Prefab, instantiate, Layout} from 'cc';
import {ReelController} from "db://assets/Scripts/SlotApp/ReelController";
import {SymbolData} from "db://assets/Scripts/SlotApp/Paytable";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SlotManager
 * DateTime = Sat Aug 02 2025 15:25:36 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = SlotManager.ts
 * FileBasenameNoExtension = SlotManager
 * URL = db://assets/Scripts/SlotApp/SlotManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

enum SlotState {
    Idle,
    Spinning,
    Result
}

@ccclass('SlotManager')
export class SlotManager extends Component {
    public static instance: SlotManager;
    private currentState: SlotState = SlotState.Idle;

    public eventTarget: EventTarget = new EventTarget();

    @property(Node) reelsContent: Node = null;
    @property(Prefab) public reelPrefab: Prefab = null;

    @property symbolAmmount: number = 0;
    @property reelAmmount: number = 0;

    @property reelDelay: number = 0;
    @property spinDuration: number = 0;


    // Contador de reels que han notificado su parada
    private stoppedReelsCount: number = 0;


    onLoad() {
        SlotManager.instance = this
        // Suscribirse al evento "reelStopped" (cada Reel avisará cuando termine)
        this.eventTarget.on('reelStopped', this.onReelStopped, this);
    }

    start() {
        this.createReels();
    }

    private createReels(){
        for (let i = 0; i < this.reelAmmount; i++) {
            let newReelNode= instantiate(this.reelPrefab);
            newReelNode.parent = this.reelsContent;

            let newReel= newReelNode.getComponent(ReelController);
            newReel.createSymbols(this.symbolAmmount);
            newReel.reelId = i;
        }
    }

    public startSpin() {
        //Condición para que el boton spin solo funcione cuando el state = IDLE
        if (this.currentState !== SlotState.Idle) return;

        //log("Slot: iniciar giro");
        this.currentState = SlotState.Spinning;

        // Iniciar cada reel
        for (let i = 0; i < this.reelsContent.children.length; i++) {
            const reel = this.reelsContent.children[i];
            //Añadir delay entre los reels al iniciar
            const startDelay = i * this.reelDelay;
            //Añadir delay entre los reels al parar
            const stopDelay = this.spinDuration + startDelay;

            this.scheduleOnce(() => {
                //SPIN de los reels
                reel.getComponent(ReelController).startSpin();
            }, startDelay);

            this.scheduleOnce(() => {
                //STOP de los reels
                reel.getComponent(ReelController).stopSpin();
            }, stopDelay);
        }
    }

    // Callback cada vez que un Reel termina su giro
    private onReelStopped(reelId: number) {
        //console.log(`Reel ${reelId} detenido`);
        this.stoppedReelsCount++;

        // Verificar si todos los reels han parado
        if (this.stoppedReelsCount >= this.reelsContent.children.length) {
            this.stoppedReelsCount = 0;
            this.currentState = SlotState.Result;
            this.calculateResult();
        }
    }

    private calculateResult() {
        /**const reels = this.reelsContent.children;

        // Linea que se comprueba
        const winSymbol = 2;

        const symbolsInLine: SymbolData[] = [];

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i].getComponent(ReelController);

            const reelSymbols = reel.getNewSymbolPosition(0);
            const symbolNode = reelSymbols[winSymbol];

            if (!symbolNode || !symbolNode["data"]) {
                console.warn(`Símbolo faltante o sin data en Reel ${i}, fila ${winSymbol}`);
                return;
            }

            symbolsInLine.push(symbolNode["data"]);
        }

        const first = symbolsInLine[0];
        const isWinning = symbolsInLine.every(s => s.symbolID === first.symbolID);

        if (isWinning) {
            console.log(`🎉 Línea ganadora con símbolo "${first.symbolName}" (ID: ${first.symbolID})`);
            // Aquí sumar premio o mostrar animación
        } else {
            console.log(`❌ No hay coincidencia en la línea central.`);
        }
        **/
        this.currentState = SlotState.Idle;
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
