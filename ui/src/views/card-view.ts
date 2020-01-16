import me from '../me';
import Card, {BodyPart, Character} from '../viewmodels/card';

class CardView extends me.DraggableEntity {
    readonly card: Card;
    private currentTween: any;

    constructor(x: number, y: number, card: Card, faceDown: boolean) {
        super(x, y, { image: 'cardFront', width: 100, height: 50, framewidth: 400, frameheight: 200 });
        let animation = this.defineAnimation(card, false);
        this.renderable.scale(CardView.width() / 400.0, CardView.height() / 200.0);
        this.renderable.resize(CardView.width(), CardView.height());
        this.renderable.setCurrentAnimation(animation);
        this.autoDepth = false;
        this.card = card;
    }

    static width() {
        return 100;
    }

    static height() {
        return 50;
    }

    updateWhenPaused = true;

    dragStart(e: any) {
        if (this.card.isMovable) {
            super.dragStart(e);
            me.game.world.moveToTop(this);
        }
    }

    dragEnd(e: any) {
        let card: Card = this.card;
        let originalParent = card.parent;
        let changedParent = false;
        let subscription = card.observe?.parent?.subscribe(value => { changedParent = (originalParent !== value)})!;
        super.dragEnd(e);
        me.timer.setTimeout(() => {
            if (!changedParent) {
                card.parent?.addCard(card);
            }
            subscription.unsubscribe();
        }, 250);
    }

    update(dt: number) {
        if (this.card.parent !== undefined) {
            super.update(dt);
            return true;
        }
        return false;
    }

    defineAnimation(card: Card, faceDown: boolean) {
        if (faceDown) {
            this.renderable.addAnimation('back', [4]);
            return 'back';
        }
        if (card.bodyPart !== BodyPart.Wild && card.character !== Character.Wild) {
            this.renderable.addAnimation('idle', [(card.character + (card.bodyPart * 5))], 1);
            return 'idle';
        } else if (card.bodyPart !== BodyPart.Wild) {
            let row = card.bodyPart * 5;
            this.renderable.addAnimation(BodyPart[card.bodyPart], [row, row + 1, row + 2, row + 3], 500);
            return BodyPart[card.bodyPart];
        } else if (card.character !== Character.Wild) {
            let column = card.character;
            this.renderable.addAnimation(Character[card.character], [column, column + 5, column + 10], 500);
            return Character[card.character];
        } else {
            this.renderable.addAnimation('wild', Array.from([0,1,2,3,5,6,7,8,10,11,12,13]), 500);
            return 'wild';
        }
    }

    moveTo(x: number, y: number) {
        if (this.currentTween) {
           this.currentTween.to({x: x, y: y}, 500);
           return;
        }
        this.currentTween = new me.Tween(this.pos).to({x: x, y: y}, 500).onComplete(() => { this.currentTween = undefined; });
        this.currentTween.start();
    }
}

export default CardView;