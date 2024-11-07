function uniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

export class Experience {
    constructor() {
        this._rooms = []; // Array of Room objects
    }

    // Getters and setters
    get rooms() {
        return this._rooms;
    }

    set rooms(rooms) {
        this._rooms = rooms;
    }

    // Rooms Methods
    addRoom(name) {
        let room = new Room();
        room.name = name;
        this._rooms.push(room);
        return room;
    }

    deleteRoom(roomId) {
        this._rooms = this._rooms.filter(room => room.id !== roomId);
    }

    getRoom(roomId) {
        return this._rooms.find(room => room.id === roomId);
    }

    // Experience Methods
    exportExperience() {
        return JSON.stringify(this);
    }

    importExperience(json) {
        let obj = JSON.parse(json);
        this._rooms = obj.rooms;
    }
}

export class Room {
    constructor() {
        this._id = uniqueId();
        this._name = "";
        this._src360 = "";
        this._camera = { vertical: 0, horizontal: 0 };
        this._tags = []; // Array of Tag objects
    }

    // Getters and setters
    get id() {
        return this._id;
    }

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

    deleteTag(tagId) {
        this._tags = this._tags.filter(tag => tag.id !== tagId);
    }

    getTag(tagId) {
        return this._tags.find(tag => tag.id === tagId);
    }
}

export class Tag {
    constructor() {
        this._id = uniqueId();
        this._name = 'New tag';
        this._position = { r: 20, theta: 90, phi: 0 };
        this._textColor = '#ffffff';
        this._type = 'tag';
    }

    // Getters and setters
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get textColor() {
        return this._textColor;
    }

    set textColor(color) {
        this._textColor = color;
    }
}

export class TagInfo extends Tag {
    constructor() {
        super();
        this._legend = 'Nouveau Texte';
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

export class TagPorte extends Tag {
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

export class TagText extends Tag {
    constructor() {
        super();
        this._legend = 'Nouveau Texte';
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