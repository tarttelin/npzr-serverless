import Game from "./viewmodels/game";
import me from './me';
import resources from './resources';

class GameContainer {
    game: Game;

    constructor(game: Game) {
        this.game = game;
        // Initialize the video.
        if (!me.video.init(640, 480, { wrapper : "screen", scale: "auto", scaleMethod : "flex-width" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.addEventListener('load', () => {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
        me.sys.pauseOnBlur = false;
    }

    loaded() {
        const PlayScreen = require('./screens/play');
        me.state.set(me.state.PLAY, new PlayScreen(this.game));

        // Start the game.
        me.state.change(me.state.PLAY);
        me.sys.pauseOnBlur = false;
    }

    static boot(game: Game) {
        const container = new GameContainer(game);

        // Mobile browser hacks
        if (me.device.isMobile) {
            // Prevent the webview from moving on a swipe
            window.document.addEventListener("touchmove", function (e) {
                e.preventDefault();
                window.scroll(0, 0);
                return false;
            }, false);

            me.event.subscribe(me.event.WINDOW_ONRESIZE, () => {
                window.scrollTo(0, 1);
            });
        }

        return container;
    }
}

export default GameContainer;