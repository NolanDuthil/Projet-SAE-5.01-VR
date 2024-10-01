import Tag from './Tag.js';

export default class TagPorte extends Tag {
    constructor(id, name, action, position = { r: 0, theta: 0, fi: 0 }) {
        super(id, name, position, "porte");
        this._action = action;
    }

    // Getters and setters for action
    get action() {
        return this._action;
    }

    set action(value) {
        this._action = value;
    }
}
