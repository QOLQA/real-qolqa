import mx from "./util";


export function Column(name) {
  this.name = name;
}

Column.prototype.type = 'String';
Column.prototype.primaryKey = false;
Column.prototype.clone = function() {
  return mx.mxUtils.clone(this);
}

export function Table(name) {
  this.name = name;
}

Table.prototype.clone = function() {
  return mx.mxUtils.clone(this);
}

