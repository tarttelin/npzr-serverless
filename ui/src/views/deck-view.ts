import me from '../me';
import CardView from "./card-view";

class DeckView extends me.Entity {
    constructor(x: number, y: number) {
        super(x, y, { image: 'cardFront', width: 400, height: 200});
        this.alwaysUpdate = true;
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
        this.renderable.scale(CardView.width() / 400.0, CardView.height() / 200.0);
        this.resize(CardView.width(), CardView.height());
        this.renderable.addAnimation('back', [4]);
        this.renderable.setCurrentAnimation('back');
        this.renderable.autoTransform = true;
    }
}

export default DeckView;