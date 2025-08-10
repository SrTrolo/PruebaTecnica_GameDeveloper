
import { _decorator, Component, Node, Label, JsonAsset, resources, instantiate, Prefab, Button, Sprite, Color, Animation} from 'cc';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = QuizController
 * DateTime = Sat Jul 26 2025 11:29:52 GMT+0200 (hora de verano de Europa central)
 * Author = AlbertPitarque
 * FileBasename = QuizController.ts
 * FileBasenameNoExtension = QuizController
 * URL = db://assets/Scripts/QuizApp/QuizController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

//Contenedor de las preguntass
class Question {
    Pregunta: string;
    Respuestas: string[];
    correctIndex: number;
}
//Lista de preguntas
class QuizData {
    quiz: Question[];
}

@ccclass('QuizController')
export class QuizController extends Component {

    // Datos internos
    private quizData: QuizData = null;
    private currentQuestionIndex: number = 0;

    // Estado
    private canAnswer: boolean = false;

    // UI y referencias
    @property(Label) public questionText: Label = null;
    @property(Node) public answerButtonContent: Node = null;
    @property(Prefab) public answerButtonPrefab: Prefab = null;
    @property([Color]) public butonColors: Color[];

    protected onLoad() {
        this.loadQuizJson();
    }

    public loadQuizJson(){
        resources.load("Quiz/Quiz", JsonAsset, (err, jsonAsset)=>{
            if (err) {
                //No se ha podido cargar el json
                return;
            }
            this.quizData = jsonAsset.json as QuizData;
            this.currentQuestionIndex = 0;

            this.showCurrentQuestion();
        });

    }
    private showCurrentQuestion() {
        if(!this.quizData) return;
        this.updateUI();
    }

    private updateUI() {
        //Mostrar siguiente pregunta
        const currentQuestion= this.quizData.quiz[this.currentQuestionIndex];

        //Actualización y animación de la pregunta
        this.questionText.string = currentQuestion.Pregunta.toString();
        this.questionText.node.getComponent(Animation).play();

        //Actualización de las respuestas con sistema de pool dinamica
        const totalAnswers = currentQuestion.Respuestas.length;
        currentQuestion.Respuestas.forEach((answer, i) => {
            this.changeButtonState(true);
            //Creación de botón de respuesta en caso de no existir suficientes
            if (!this.answerButtonContent.children[i]) {
                let newAswerButton= instantiate(this.answerButtonPrefab);
                newAswerButton.parent = this.answerButtonContent;

                //Aplicar evento al pulsar
                const answerButtonComponent = newAswerButton.getComponent(Button);
                if (answerButtonComponent) {
                    answerButtonComponent.node.on(Button.EventType.CLICK, () => {this.answerQuestionHandler(i)}, this);
                }
            }
            //Si existe, activar y actualizar
            const answerButton = this.answerButtonContent.children[i];
            answerButton.active = true;
            this.changeButtonColor(i, 2);
            if (answerButton.children[0].getComponent(Label)) {
                answerButton.children[0].getComponent(Label).string = answer;
            }
        });

        //Desactivar nodos que no necesitemos
        for (let j = totalAnswers; j < this.answerButtonContent.children.length; j++) {
            this.answerButtonContent.children[j].active = false;
        }

        //Al finalizar, podemos contestar
        this.canAnswer = true;
    }

    public answerQuestion(selectedIndex: number) {
        if (!this.quizData) return;
        this.canAnswer = false;
        const question = this.quizData.quiz[this.currentQuestionIndex];

        if (selectedIndex === question.correctIndex) {
            //La respuesta es correcta. Resaltamos el color del botón correcto
            this.changeButtonColor(selectedIndex, 1);

        } else {
            //La respuesta es incorrecta. Resaltamos el botón pulsado y el botón correcto
            this.changeButtonColor(selectedIndex, 0);
            this.changeButtonColor(question.correctIndex, 1);
        }

        //Esperamos dos segundos para cambiar de estado
        this.scheduleOnce(function() {
            this.nextQuestion();
        }, 2);
    }

    private nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.quizData.quiz.length) {
            //Repetimos el flujo
            this.showCurrentQuestion();
        }
        else {
            //Si no hay más preguntas, se finaliza el juego
            this.answerButtonContent.active = false;
            this.questionText.string = ("¡Juego Completado!");
        }
    }

    //Handeler para que cada botón sepa que id de respuesta es
    private answerQuestionHandler(_number: number) {
        if(!this.canAnswer) return;
        this.answerQuestion(_number);
        this.changeButtonState(false);
    }

    //Cambio de color de los botones
    private changeButtonColor(buttonID: number, butonColor:number)
    {
        this.answerButtonContent.children[buttonID].getComponent(Sprite).color = this.butonColors[butonColor];
        //0 -> ROJO
        //1 -> VERDE
        //2 -> BLANCO
    }

    //Cambiar interactuación de los botones
    private changeButtonState(isActive : boolean) {
        this.answerButtonContent.children.forEach((answer) => {
            answer.getComponent(Button).interactable = isActive;
        })
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
