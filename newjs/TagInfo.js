import Tag from './Tag.js';

export default class TagInfo extends Tag {
    constructor() {
        super();
        this._legend = '';
        this._type = "info";
    }

    // Getters and setters for legend
    get legend() {
        return this._legend;
    }

    set legend(value) {
        this._legend = value;
    }
}
