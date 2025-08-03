
import { _decorator, Component, Node, Label, JsonAsset, resources, log, instantiate, Prefab, Button, Sprite, Color, CCBoolean} from 'cc';

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

class Question {
    Pregunta: string;
    Respuestas: string[];
    correctIndex: number;
}

class QuizData {
    quiz: Question[];
}

@ccclass('QuizController')
export class QuizController extends Component {

    private quizData: QuizData = null;
    private currentQuestionIndex: number = 0;

    @property(Label) public questionText: Label = null;
    @property(Node) public answerButtonContent: Node = null;
    @property(Prefab) public answerButtonPrefab: Prefab = null;
    @property(CCBoolean) private canAnswer: boolean = false;

    protected onLoad() {
        //globalThis.quiz = this;
        this.loadQuizJson();
    }

    public loadQuizJson(){
        resources.load("Quiz/Quiz", JsonAsset, (err, jsonAsset)=>{
            if (err) {
                log("Error al cargar el json", err);
                return;
            }
            this.quizData = jsonAsset.json as QuizData;
            this.currentQuestionIndex = 0;

            this.showCurrentQuestion();
        });

    }
    private showCurrentQuestion() {
        if(!this.quizData) return;

        const question = this.quizData.quiz[this.currentQuestionIndex];
        log("Current Question", question);
        question.Respuestas.forEach((answer, i) => {
            log(`${i}: ${answer}`);
        })
        this.updateUI();
    }
    public answerQuestion(selectedIndex: number) {
        if (!this.quizData) return;
        this.canAnswer = false;
        const question = this.quizData.quiz[this.currentQuestionIndex];

        if (selectedIndex === question.correctIndex) {
            log("¡Respuesta correcta!");
            this.changeButtonColor(selectedIndex, Color.GREEN);

        } else {
            log("Incorrecto. La respuesta correcta era: " + `${question.Respuestas[question.correctIndex]}`);
            this.changeButtonColor(selectedIndex, Color.RED);
            this.changeButtonColor(question.correctIndex, Color.GREEN);
        }
        this.scheduleOnce(function() {
            this.nextQuestion();
        }, 2);
    }
    private nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.quizData.quiz.length) {
            this.showCurrentQuestion();
        }
        else {
            log("¡Juego Completado!");
            this.answerButtonContent.active = false;
            this.questionText.string = ("¡Juego Completado!");
        }
    }
    private updateUI() {
        const currentQuestion= this.quizData.quiz[this.currentQuestionIndex];
        this.questionText.string = currentQuestion.Pregunta.toString();

        const totalAnswers = currentQuestion.Respuestas.length;

        currentQuestion.Respuestas.forEach((answer, i) => {
            this.changeButtonState(true);
            if (!this.answerButtonContent.children[i]) {
                let newAswerButton= instantiate(this.answerButtonPrefab);
                newAswerButton.parent = this.answerButtonContent;

                const answerButtonComponent = newAswerButton.getComponent(Button);
                if (answerButtonComponent) {
                    answerButtonComponent.node.on(Button.EventType.CLICK, () => {this.answerQuestionHandler(i)}, this);
                }
            }

            const answerButton = this.answerButtonContent.children[i];
            answerButton.active = true;
            this.changeButtonColor(i, Color.WHITE);
            if (answerButton.children[0].getComponent(Label)) {
                answerButton.children[0].getComponent(Label).string = answer;
            }
        });

        for (let j = totalAnswers; j < this.answerButtonContent.children.length; j++) {
            this.answerButtonContent.children[j].active = false;
        }

        this.canAnswer = true;
    }
    private answerQuestionHandler(_number: number) {
        if(!this.canAnswer) return;
        this.answerQuestion(_number);
        this.changeButtonState(false);
    }
    private changeButtonColor(buttonID: number, butonColor:Color)
    {
        this.answerButtonContent.children[buttonID].getComponent(Sprite).color = butonColor;
    }
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
