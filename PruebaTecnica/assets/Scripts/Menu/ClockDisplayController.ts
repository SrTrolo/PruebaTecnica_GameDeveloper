
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ClockDisplayController
 * DateTime = Sun Aug 10 2025 10:46:32 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = ClockDisplayController.ts
 * FileBasenameNoExtension = ClockDisplayController
 * URL = db://assets/Scripts/Menu/ClockDisplayController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('ClockDisplayController')
export class ClockDisplayController extends Component {
    
    
    @property(Label)
    public timeLabel: Label = null;

    @property(String) url: String;
    private _syncTimer: number = 60; //Petición cada 1 min
    private _currentTime: Date;


    // Reloj interno (Date) que iremos incrementando cada segundo
    start() {
        this.loadURL();
        this.schedule(() => this.loadURL(), this._syncTimer);

        // Avanza el reloj interno cada segundo
        this.schedule(function() {
            if(!this._currentTime) return;
            this._currentTime.setSeconds(this._currentTime.getSeconds() + 1);
            this.updateClock(this._currentTime);
        }, 1);
    }
    public loadURL(){
        fetch(this.url.toString())
            .then((response: Response) => {
                return response.json()
            })
            .then((data) => {
                this._currentTime = new Date(data.datetime);
                this.updateClock(this._currentTime);
            })
            .catch(() => {
                //Soy puto
            });
    }
    private updateClock(time: Date){
        const hh = String("0" + time.getHours()).slice(-2);
        const mm = String("0" + time.getMinutes()).slice(-2);
        const ss = String("0" + time.getSeconds()).slice(-2);

        this.timeLabel.string = `${hh}:${mm}:${ss}`;
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
