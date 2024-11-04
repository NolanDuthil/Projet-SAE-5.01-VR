import Tag from './Tag.js';

export default class TagText extends Tag {
    constructor() {
        super();
        this._legend = '';
        this._type = "text";
    }

    // Getters and setters for legend
    get legend() {
        return this._legend;
    }

    set legend(value) {
        this._legend = value;
    }
}