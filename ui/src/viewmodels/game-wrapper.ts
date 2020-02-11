import GameView from "./game";
import {Card, Game as GameModel, Player} from "../graphql/model";
import PlayerViewModel, {PlayState} from "./player";
import CardViewModel, {BodyPart, Character} from "./card";
import {observe} from "rxjs-observe";


export default class GameViewWrapper {

    private readonly game: GameView;
    private static cards: CardViewModel[] = [];
    private readonly _playerName: string;

    constructor(gameView: GameView, playerName: string) {
        this.game = gameView;
        this._playerName = playerName;
    }

    updateView = (gameState: GameModel) => {
        const playerState = this.currentPlayer(gameState);
        const opponentState = this.opponent(gameState);
        const self = this;

        function syncPlayer(playerState: Player, player: PlayerViewModel) {
            playerState.hand.filter(c => !player.hand.cards.map(card => card.id).includes(c.id))
                .forEach(c => {
                    player.hand.addCard(self.convert(c));
                });
            playerState.stacks.filter(s => !player.stacks.map(stack => stack.id).includes(s.id))
                .forEach(s => {
                    player.addStack(s.id);
                });
            playerState.stacks.forEach((stack) => {
                let stackViewModel = player.stacks.find(s => s.id === stack.id)!;
                let cardsToAdd = stack.head.filter(s => !stackViewModel.head.cards.map(svm => svm.id).includes(s.id));
                cardsToAdd.reverse().forEach(c => stackViewModel.head.addCard(self.convert(c)));
                cardsToAdd = stack.torso.filter(s => !stackViewModel.torso.cards.map(svm => svm.id).includes(s.id));
                cardsToAdd.reverse().forEach(c => stackViewModel.torso.addCard(self.convert(c)));
                cardsToAdd = stack.legs.filter(s => !stackViewModel.legs.cards.map(svm => svm.id).includes(s.id));
                cardsToAdd.reverse().forEach(c => stackViewModel.legs.addCard(self.convert(c)));
            });
            player.playState = PlayState[playerState.playState];
            player.setScore(playerState.completed.map(c => Character[c]));
        }

        syncPlayer(playerState, this.game.player);
        syncPlayer(opponentState, this.game.opponent);
        gameState.discardPile.filter(c => !this.game.discardPile.cards.map(card => card.id).includes(c.id))
            .reverse()
            .forEach(c => {
                this.game.discardPile.addCard(this.convert(c));
            });
    };

    opponent = (game: GameModel): Player => {
        let player = game.players.find(p => p.userId === this._playerName);
        if (player) {
            return game.players.filter(p => p.userId !== this._playerName)[0];
        }
        return game.players[0];
    };

    currentPlayer = (game: GameModel): Player => {
        let player = game.players.find(p => p.userId === this._playerName);
        if (player) {
            return player;
        }
        return game.players[1];
    };

    private convert = (card: Card) => {
        let existingCard = GameViewWrapper.cards.find(c => c.id === card.id);
        if (existingCard) return existingCard;
        let character: Character = Character[card.characterType];
        let bodyPart: BodyPart = BodyPart[card.bodyPart];
        let {observables, proxy} = observe(new CardViewModel(character, bodyPart, card.id));
        proxy.observe = observables;
        GameViewWrapper.cards.push(proxy);
        return proxy;
    }
}