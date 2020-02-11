// @ts-ignore
let melon: any = undefined;

// The wrapper here is to introduce a testing seam.

const mo = {
    get game():any {
        return _me().game;
    },
    get Entity():any {
        return _me().Entity
    },
    get DraggableEntity():any {
        return _me().DraggableEntity;
    },
    get timer():any {
        return _me().timer;
    },
    get Rect():any {
        return _me().Rect;
    },
    get Renderable():any {
        return _me().Renderable;
    },
    get Container():any {
        return _me().Container;
    },
    get Tween():any {
        return _me().Tween;
    },
    get DroptargetEntity():any {
        return _me().DroptargetEntity;
    },
    get video():any {
        return _me().video;
    },
    get audio():any {
        return _me().audio;
    },
    get loader():any {
        return _me().loader;
    },
    get state():any {
        return _me().state;
    },
    get sys():any {
        return _me().sys;
    },
    get device():any {
        return _me().device;
    },
    get event():any {
        return _me().event;
    },
    get plugin():any {
        return _me().plugin;
    },
    get debug():any {
        return _me().debug;
    },
    get input():any {
        return _me().input;
    },
    get Stage():any {
        return _me().Stage;
    },
    get ColorLayer():any {
        return _me().ColorLayer;
    }
};

function _me():any {
    if (melon) return melon.me;
    console.log("create melon");
    melon = require("melonjs");
    melon.me.boot();
    return melon.me;
}

export default mo;