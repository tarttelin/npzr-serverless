import me from "../me";
import {Character} from "../viewmodels/card";

class ScoreView extends me.Entity {

    constructor(x: number, y: number, character: Character) {
        super(x, y, { image: 'scores', width: 30, height: 30 });
        this.renderable.addAnimation("" + Character[character], [character]);
        this.renderable.setCurrentAnimation("" + Character[character]);
    }

    update(dt: number) {
        super.update(dt);
        return true;
    }
}

export default ScoreView;