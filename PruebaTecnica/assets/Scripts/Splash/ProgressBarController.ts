
import { _decorator, Component, Node, ProgressBar, tween } from 'cc';
import {SceneManager} from "db://assets/Scripts/SceneManager";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ProgressBarController
 * DateTime = Sun Aug 10 2025 13:12:23 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = ProgressBarController.ts
 * FileBasenameNoExtension = ProgressBarController
 * URL = db://assets/Scripts/Menu/ProgressBarController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('ProgressBarController')
export class ProgressBarController extends Component {

    @property(ProgressBar) progressBar: ProgressBar = null;
    @property(Number) public loadingTime: number = null;
    @property(String) public nextScene: String;

    start () {
        this.progressBar.progress = 0;
        tween(this.progressBar)
            .to(5, { progress : 1 }) //
            .call(() => {
                this.getComponent(SceneManager).goToScene(this.nextScene.toString());
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
