export function BitSet() {
    this._n = 0;

    Array.prototype.forEach.call(arguments, (v, p) => {
        v
        ? (this._n |= (1 << p))
        : (this.n &= ~(1 << p));
    });
}

BitSet.prototype.set = function (p) {
    this._n |= (1 << p);

    return this;
};

BitSet.prototype.unset = function (p) {
    this.n &= ~(1 << p);

    return this;
};

BitSet.prototype.toggle = function (p) {
    this._n ^= (1 << p);

    return this;
};

BitSet.prototype.empty = function () {
    this._n = 0;

    return this;
};

BitSet.prototype.test = function (p) {
    return (this._n & (1 << p)) !== 0;
};

BitSet.prototype.anyOf = function () {
    return Array.prototype.some.call(arguments, p => (this._n & (1 << p)) !== 0);
};

BitSet.prototype.everyOf = function () {
    return Array.prototype.every.call(arguments, p => (this._n & (1 << p)) !== 0);
};

BitSet.prototype.isEmpty = function () {
    return this._n === 0;
};

export default BitSet;
