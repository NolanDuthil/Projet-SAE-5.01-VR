import Tag from './Tag.js';

export default class TagText extends Tag {
    constructor(id, name, legend, position = { r: 0, theta: 0, fi: 0 }, textColor) {
        super(id, name, position, textColor);
        this._legend = legend;
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