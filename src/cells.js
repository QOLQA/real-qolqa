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

let tableObject = new Table('TABLENAME');
export const table = new mx.mxCell(tableObject, new mx.mxGeometry(0, 0, 200, 28), 'table');

table.setVertex(true);

// logica de sidebar icon

let columnObject = new Column('COLUMNAME');
export const column = new mx.mxCell(columnObject, new mx.mxGeometry(0, 0, 0, 15));

column.setVertex(true);
column.setConnectable(false);