/**
* A Set, having some of the attributes of a mathematical set,
* like containing no duplicates.
* Can contain objects of any kind.
*
* @class Set
* @constructor
*/
function Set() {
    this._objects = [];
    this.isMarked = false;
};

/**
* Adds an object this Set.
*
* Post: The object has been added to this Set, if it wasn't there already.
*
* @method add
* @param {Object} object is an object of any kind.
*/
Set.prototype.add = function(object) {
    for (var i = 0; i < this._objects.length; i++)
        if (this._objects[i] === object)
            return; // object already in set
    this._objects.push(object);
};

/**
* Removes an object from this Set.
*
* Post: The object has been remved to this Set.
*
* @method remove
* @param {Object} object is an object of any kind.
*/
Set.prototype.remove = function(object) {
    var index = this.indexOf(object);
    delete this._objects[index];
};

/**
* Indicates whether this Set contains a given object.
*
* @method containes
* @param {Object} object is an object of any kind.
* @return {Boolean} true iiff this Set contains the given object.
*/
Set.prototype.contains = function(object) {
    if (this.length() === 0) return false;
    for (var i = 0; i < this.length(); i++)
        if (this.getObject(i).id === object.id) // id's should be unique
            return true;
    return false;
};

/**
* Gets an object from this Set, by index.
*
* @method getObject
* @param {Number} index is an an index in this Set.
* @return {Object} The object at the given index.
*/
Set.prototype.getObject = function(index) {
    return this._objects[index];
}; 

/**
* Gets the length of this Set.
*
* @method length
* @return {Number} The length of this Set.
*/
Set.prototype.length = function(){
    return this._objects ? this._objects.length : 0;
};

/**
* Indicates whether this Set is empty.
*
* @method isEmpty
* @return {Boolean} true iiff this set is empty.
*/
Set.prototype.isEmpty = function() {
    return this.length() === 0;
};

/**
* Gets the index of an object in this Set.
*
* @method indexOf
* @param {Object} object is an object of any kind.
* @return {Number} The index of the given object in this Set.
*/
Set.prototype.indexOf = function(object) {
    return this._objects.indexOf(object);
};