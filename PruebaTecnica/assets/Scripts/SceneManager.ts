
import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SceneManager
 * DateTime = Sun Aug 10 2025 13:28:21 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = SceneManager.ts
 * FileBasenameNoExtension = SceneManager
 * URL = db://assets/Scripts/SceneManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('SceneManager')
export class SceneManager extends Component {
    public goToScene(_event: Event, sceneName: string) {
        director.loadScene(sceneName, (err) => {
            if (err) {
                console.error(`No se pudo cargar la escena "${sceneName}":`, err);
            }
        });
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
