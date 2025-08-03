import { _decorator, Component, view, Vec3, UITransform } from 'cc';
const { ccclass } = _decorator;

@ccclass('AspectRatioScaler')
export class AspectRatioScaler extends Component {

    private baseWidth: number = 0;
    private baseHeight: number = 0;
    private aspectRatio: number = 1;

    onLoad() {
        // Guardamos tamaño inicial del node como referencia de aspect ratio

        const uiTransform = this.getComponent(UITransform);

        this.baseWidth = uiTransform.width;
        this.baseHeight = uiTransform.height;
        this.aspectRatio = this.baseWidth / this.baseHeight;

        this.adjustScale();

        view.setResizeCallback(this.adjustScale.bind(this));
    }

    onDestroy() {
        //Limpieza de callback para evitar cualquier comportamiento inesperado si el nodo se destruye y se crea rápido después
        if (view.setResizeCallback) {
            view.setResizeCallback(null);
        }
    }

    private adjustScale() {
        const screenSize = view.getVisibleSize();
        const screenRatio = screenSize.width / screenSize.height;

        let scale: number;

        if (screenRatio > this.aspectRatio) {
            // Pantalla más ancha que el node -> ajustamos por altura
            scale = screenSize.height / this.baseHeight;
        } else {
            // Pantalla más alta que el node -> ajustamos por ancho
            scale = screenSize.width / this.baseWidth;
        }

        // Escalamos proporcionalmente
        this.node.setScale(new Vec3(scale, scale, 1));

        // Tener anchor (0.5, 0.5) para que se centre
        this.node.setPosition(new Vec3(0, 0, 0));
    }
}