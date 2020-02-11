import StackSlot from "./stack-slot";
import {observe} from "rxjs-observe";
import {BodyPart} from "./card";

class Stack {
    head: StackSlot;
    torso: StackSlot;
    legs: StackSlot;
    id: string;

    constructor(id: string) {
        this.id = id;
        const initHead = (stack: Stack) => {
            let stackSlot = new StackSlot(stack, BodyPart.Head);
            const { observables, proxy } = observe(stackSlot);
            stackSlot.observe = observables;
            return proxy;
        };
        const initTorso = (stack: Stack) => {
            let stackSlot = new StackSlot(stack, BodyPart.Torso);
            const { observables, proxy } = observe(stackSlot);
            stackSlot.observe = observables;
            return proxy;
        };
        const initLegs = (stack: Stack) => {
            let stackSlot = new StackSlot(stack, BodyPart.Legs);
            const { observables, proxy } = observe(stackSlot);
            stackSlot.observe = observables;
            return proxy;
        };
        this.head = initHead(this);
        this.torso = initTorso(this);
        this.legs = initLegs(this);
    }
}

export default Stack;