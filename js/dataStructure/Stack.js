/*

 A stack of any things,
 hetero- or homogeneous.

*/

function Stack(descr) {
    this._items = [];
}

// Usage : Stack.isEmpty();
// Return value : true if Stack is empty
Stack.prototype.isEmpty = function () {
    return this._items.length === 0;
};

// Usage : Stack.push(a);
// Post : a is on top of the Stack.
Stack.prototype.push = function (a) {
    this._items.push(a);
};

// Usage : Stack.pop();
// Post : The item at the top of the Stack
//        has been removed.
// Return value : The item at the top of the Stack.
Stack.prototype.pop = function () {
    return this._items.pop();
};