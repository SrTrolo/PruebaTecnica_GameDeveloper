
import {_decorator, Component, Node, EventTarget, log, Prefab, instantiate, Layout, Label, tween} from 'cc';
import {ReelController} from "db://assets/Scripts/SlotApp/ReelController";
import {Paytable} from "db://assets/Scripts/SlotApp/Paytable";
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
    private stoppedReelsCount: number = 0;

    public eventTarget: EventTarget = new EventTarget();

    // Nodos de la interfaz
    @property(Node) public reelsContent: Node = null;
    @property(Node) public balanceLabel: Node = null;

    // Prefabs
    @property(Prefab) public reelPrefab: Prefab = null;

    // Configuración del juego
    @property public symbolAmmount: number = 0;
    @property public reelAmmount: number = 0;

    // Tiempos y animaciones
    @property public reelDelay: number = 0;
    @property public spinDuration: number = 0;
    @property public balanceIncrementTime: number = 0;

    // Valores de juego
    @property public balance: number = 0;
    @property public currentBet: number = 10;

    onLoad() {
        SlotManager.instance = this
        // Suscribirse al evento "reelStopped" (cada Reel avisará cuando termine)
        this.eventTarget.on('reelStopped', this.onReelStopped, this);

        this.balanceLabel.getComponent(Label).string = this.balance.toString();
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
        //Condición para que el boton spin solo funcione cuando estemos en el estado de Idle y se pueda pagar el SPIN;
        const canStart = this.currentState === SlotState.Idle && this.canPay();
        if(!canStart) return;

        //log("Slot: iniciar giro");
        this.currentState = SlotState.Spinning;

        // Iniciar cada reel
        for (let i = 0; i < this.reelsContent.children.length; i++) {
            const reel = this.reelsContent.children[i];

            //Resetear Animaciones de los símbolos;
            reel.getComponent(ReelController).resetAllAnimations();

            //Delay entre los reels al iniciar y al parar
            const startDelay = i * this.reelDelay;
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

    //Booleana para comprobar si puedo pagar el SPIN
    private canPay(): boolean {
        if(this.balance - this.currentBet < 0) {
            log("no puedo spinear");
            return false;
        }
        this.balance = this.balance - this.currentBet;
        this.balanceLabel.getComponent(Label).string = this.balance.toString();
        return true;
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
        const reels = this.reelsContent.children;
        const line = 2;

        //Recogo el simbolo del reel 0;
        const winningID = reels[0].getComponent(ReelController).getSymbolIDAt(line);

        for (let i = 1; i < reels.length; i++) {
            const reelController = reels[i].getComponent(ReelController);
            const currentID = reelController.getSymbolIDAt(line);

            if (currentID !== winningID) {
                console.log('❌ No hay línea ganadora.');
                this.currentState = SlotState.Idle;
                return;
            }
        }

        const winningSymbol = Paytable.Paytable[winningID];
        const totalWin = winningSymbol.symbolValue * reels.length;

        this.updateBalance(totalWin);

        //Animar simbolos de la linia premiada
        reels.forEach((reel) => {
            reel.getComponent(ReelController).animateSymbol(line, 1);
        })

        console.log(`🎉 Línea ganadora con símbolo "${winningSymbol.symbolName}"`);
        console.log(`💰 Premio: ${winningSymbol.symbolValue} x ${reels.length} = ${totalWin}`);


    }

    //Función para actualizar el balance
    //AÑADIR TWEEN
    private updateBalance(ammount: number) {
        const startBalance = this.balance;
        const finalBalance = this.balance + ammount;

        const label = this.balanceLabel.getComponent(Label);

        const counter = { value: startBalance };

        tween(counter)
            .to(this.balanceIncrementTime, { value: finalBalance }, {
                onUpdate: () => {
                    this.balance = Math.round(counter.value);
                    label.string = this.balance.toString();
                },
                onComplete: () => {
                    this.balance = finalBalance;
                    this.currentState = SlotState.Idle;
                }
            })
            .start();


        //this.balance = this.balance + ammount;
        //this.balanceLabel.getComponent(Label).string = this.balance.toString();

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
