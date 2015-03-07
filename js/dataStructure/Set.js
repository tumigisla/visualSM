function Set() {
    this._objects = [];
};

// Makes sure there are no duplicates.
Set.prototype.add = function(object) {
    for (var i = 0; i < this._objects.length; i++)
        if (this._objects[i] === object)
            return; // object already in set
    this._objects.push(object);
};

Set.prototype.contains = function(object) {
    return util.contains(this._objects, objects);
};

Set.prototype.getObject = function(index) {
    return this._objects[index];
};

Set.prototype.length = this._objects ? this._objects.length : 0;

Set.prototype.isEmpty = this.length === 0;