import Tag from './Tag.js';

export default class TagPorte extends Tag {
    constructor() {
        super();
        this._action = null;
        this._type = "porte";
    }

    // Getters and setters for action
    get action() {
        return this._action;
    }

    set action(value) {
        this._action = value;
    }
}
