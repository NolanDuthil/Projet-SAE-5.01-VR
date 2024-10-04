import Tag from './Tag.js';

export default class TagPorte extends Tag {
    constructor(id, name, action, position = { r: 0, theta: 0, fi: 0 }, textColor) {
        super(id, name, position, textColor);
        this._action = action;
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
