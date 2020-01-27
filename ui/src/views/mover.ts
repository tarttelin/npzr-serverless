import me from "../me";

const tweens = new Map<any, any>();

export default (movable: any, x: number, y: number) => {
    if (tweens.has(movable)) {
        tweens.get(movable).to({x: x, y: y}, 500);
        return;
    }
    tweens.set(movable, new me.Tween(movable.pos).to({x: x, y: y}, 500).onComplete(() => { tweens.delete(movable) }));
    tweens.get(movable).start();
}

export type moveType = (movable: any, x: number, y: number) => void;
