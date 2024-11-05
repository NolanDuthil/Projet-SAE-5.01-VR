import Tag from "./Tag.js";
import TagText from "./TagText.js";
import TagPorte from "./TagPorte.js";
import TagInfo from "./TagInfo.js";

export default class Room {
    constructor() {
        this._name = "";
        this._src360 = "";
        this._camera = { vertical: 0, horizontal: 0 };
        this._tags = []; // Array of Tag objects
    }

    // Getters and setters
    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get src360() {
        return this._src360;
    }

    set src360(src360) {
        this._src360 = src360;
    }

    get camera() {
        return this._camera;
    }

    set camera(camera) {
        this._camera = camera;
    }

    get tags() {
        return this._tags;
    }

    set tags(tags) {
        this._tags = tags;
    }

    // Tags Methods
    addInfoTag(name) {
        let tag = new TagInfo();
        tag.name = name;
        this._tags.push(tag);
        return tag;
    }

    addTextTag(name) {
        let tag = new TagText();
        tag.name = name;
        this._tags.push(tag);
        return tag;
    }

    addPorteTag(name) {
        let tag = new TagPorte();
        tag.name = name;
        this._tags.push(tag);
        return tag;
    }

    deleteTag(tagName) {
        this._tags = this._tags.filter(tag => tag.name !== tagName);
    }

    getTag(tagName) {
        return this._tags.find(tag => tag.name === tagName);
    }
}