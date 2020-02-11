// @ts-ignore
let melon: any;

// The wrapper here is to introduce a testing seam.

const me = {
    get game() {
        return _me().game;
    },
    get Entity() {
        return _me().Entity
    },
    get DraggableEntity() {
        return _me().DraggableEntity;
    },
    get timer() {
        return _me().Timer;
    },
    get Rect() {
        return _me().Rect;
    },
    get Renderable() {
        return _me().Renderable;
    },
    get Container() {
        return _me().Container;
    },
    get Tween() {
        return _me().Tween;
    },
    get DroptargetEntity() {
        return _me().DroptargetEntity;
    },
    get video() {
        return _me().video;
    },
    get audio() {
        return _me().audio;
    },
    get loader() {
        return _me().loader;
    },
    get state() {
        return _me().state;
    },
    get sys() {
        return _me().sys;
    },
    get device() {
        return _me().device;
    },
    get event() {
        return _me().event;
    },
    get plugin() {
        return _me().plugin;
    },
    get debug() {
        return _me().debug;
    },
    get input() {
        return _me().input;
    },
    get Stage() {
        return _me().Stage;
    },
    get ColorLayer() {
        return _me().ColorLayer;
    }
};

function _me():any {
    if (melon) return melon;
        melon = require("melonjs");
    return melon;
}
export default me;