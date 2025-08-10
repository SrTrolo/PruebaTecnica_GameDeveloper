
import {_decorator, Component, Node, EventTarget, Prefab, instantiate, Label, tween, Button, EventHandler} from 'cc';
import {ReelController} from "db://assets/Scripts/Slot/ReelController";
import {Paytable} from "db://assets/Scripts/Slot/Paytable";
import {PaytableSymbolController} from "db://assets/Scripts/Slot/PaytableSymbolController";
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
    @property(Node) public paytableSymbolContent: Node = null;

    // Prefabs
    @property(Prefab) public reelPrefab: Prefab = null;
    @property(Prefab) public paytableSymbolPrefab: Prefab = null;

    // Configuración del juego
    @property public symbolAmmount: number = 0;
    @property public reelAmmount: number = 0;
    @property public reelSpeed: number = 0;
    @property public spinDuration: number = 0;

    // Tiempos y animaciones
    @property public reelDelay: number = 0;
    @property public decreaseSpinDuration: number = 0;
    @property public increaseSpinDuration: number = 0;
    @property public balanceIncrementTime: number = 0;


    // Valores de juego
    @property public balance: number = 0;
    @property public spinCost: number = 10;

    onLoad() {
        SlotManager.instance = this
        // Suscribirse al evento "reelStopped" (cada Reel avisará cuando termine)
        this.eventTarget.on('reelStopped', this.onReelStopped, this);
        //Actualización del texto del balance
        this.balanceLabel.getComponent(Label).string = `BALANCE:\n${this.balance}`;
    }

    start() {
        this.createReels();
        this.createPaytable();
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

    private createPaytable(){
        //Instanciación de los simbolos disponibles de la paytable
        for (let i = 0; i < Paytable.Paytable.length; i++) {
            let newPaytableSymbol = instantiate(this.paytableSymbolPrefab);
            newPaytableSymbol.parent = this.paytableSymbolContent;

            const data = Paytable.Paytable[i];
            //Pasamos los datos de la paytable
            newPaytableSymbol.getComponent(PaytableSymbolController).updatePaytableSymbol(
                data.symbolSprite,
                data.symbolValue,
                this.spinCost,
                this.reelAmmount,
            );
            //Pasarle el valor del simbolo al botón como customEventData
            const newPaytableSymbolButton = newPaytableSymbol.children[0].getComponent(Button);
            if (newPaytableSymbolButton) {
                const event = new EventHandler();
                event.target = this.node;
                event.component = 'SlotManager';
                event.handler = 'startSpin';
                event.customEventData = i.toString();

                newPaytableSymbolButton.clickEvents.push(event);
            }
        }
    }

    public startSpin(event: Event, customEventData: string) {
        //Condición para que el boton spin solo funcione cuando estemos en el estado de Idle y se pueda pagar el SPIN;
        const canStart = this.currentState === SlotState.Idle && this.canPay();
        if(!canStart) return;

        this.currentState = SlotState.Spinning;

        // Pasamos a INT el customEventData que recibimos del botón SPIN o de los botones de la Paytable
        const forceSymbolID = parseInt(customEventData);

        // Iniciar cada reel
        for (let i = 0; i < this.reelsContent.children.length; i++) {
            const reel = this.reelsContent.children[i];

            //Resetear Animaciones de los símbolos premiados;
            reel.getComponent(ReelController).resetAllAnimations();

            //Delay entre los reels al iniciar y al parar
            const startDelay = i * this.reelDelay;
            const stopDelay = this.spinDuration + startDelay;

            this.scheduleOnce(() => {
                //SPIN de los reels con el valor que recibimos del botón SPIN o de los botones de la Paytable
                reel.getComponent(ReelController).startSpin(this.reelSpeed, this.increaseSpinDuration, forceSymbolID);
            }, startDelay);

            this.scheduleOnce(() => {
                //STOP de los reels
                reel.getComponent(ReelController).stopSpin(400, this.decreaseSpinDuration);
            }, stopDelay);
        }
    }

    //Booleana para comprobar si puedo pagar el SPIN
    private canPay(): boolean {
        if(this.balance - this.spinCost < 0) {
            //No tenemos dinero suficiente
            return false;
        }
        this.balance = this.balance - this.spinCost;
        this.balanceLabel.getComponent(Label).string = `BALANCE:\n${this.balance}`;
        return true;
    }

    // Callback cada vez que un Reel termina su giro
    private onReelStopped(reelId: number) {
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
        //Linia que vamos a comparar
        const line = 2;

        //Recogo el simbolo del reel 0;
        const winningID = reels[0].getComponent(ReelController).getSymbolIDAt(line);

        for (let i = 1; i < reels.length; i++) {
            const reelController = reels[i].getComponent(ReelController);
            const currentID = reelController.getSymbolIDAt(line);

            if (currentID !== winningID) {
                //No hay premio
                this.currentState = SlotState.Idle;
                return;
            }
        }
        //Si se termina el flujo, todos los reels tienen el mismo simbolo = hay premio
        const winningSymbol = Paytable.Paytable[winningID];
        const totalWin = winningSymbol.symbolValue * reels.length;

        //Actualizamos balance
        this.updateBalance(totalWin);

        //Animar simbolos de la linia premiada
        reels.forEach((reel) => {
            reel.getComponent(ReelController).animateSymbol(line, 1);
        })
    }

    //Función para actualizar el balance
    private updateBalance(ammount: number) {
        const startBalance = this.balance;
        const finalBalance = this.balance + ammount;

        const label = this.balanceLabel.getComponent(Label);

        //Animación de incremento del balance a balanceFinal
        const counter = { value: startBalance };
        tween(counter)
            .to(this.balanceIncrementTime, { value: finalBalance }, {
                onUpdate: () => {
                    //Redondear siempre a numero entero
                    this.balance = Math.round(counter.value);
                    label.string = `BALANCE:\n${this.balance}`;
                },
                onComplete: () => {
                    //Forzamos actualización del balance y cambiamos de estado
                    this.balance = finalBalance;
                    this.currentState = SlotState.Idle;
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
