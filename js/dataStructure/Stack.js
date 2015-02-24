/*

 A stack of any things,
 hetero- or homogeneous.

 Normal push and pop methods work as expected.
*/

function Stack(descr) {
    this._items = [];
}

// Usage : Stack.isEmpty();
// Return value : true if Stack is empty
Stack.prototype.isEmpty = function () {
    return this._items.length === 0;
};
