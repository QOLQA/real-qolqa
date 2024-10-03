import mx from "../../util";


export function Column(name) {
  this.name = name;
}

Column.prototype.type = 'String';
Column.prototype.primaryKey = false;
Column.prototype.isForeignKey = false;
Column.prototype.forCardinality = false;
Column.prototype.to = ''
Column.prototype.clone = function () {
  return mx.mxUtils.clone(this);
}

export function Table(name) {
  this.name = name;
}

Table.prototype.isTarget = false
Table.prototype.to = []
Table.prototype.cardinality = '1..1'
Table.prototype.clone = function () {
  return mx.mxUtils.clone(this);
}

let tableObject = new Table('TABLENAME');
export const table = new mx.mxCell(tableObject, new mx.mxGeometry(0, 0, 235, 28), 'table');
// table.getChildCount = () => {
//   return 1;
// };

table.setVertex(true);

// logica de sidebar icon

let columnObject = new Column('COLUMNAME');
export const column = new mx.mxCell(columnObject, new mx.mxGeometry(0, 0, 0, 15));
// column.getChildCount = () => {
//   return 1;
// };

column.setVertex(true);
column.setConnectable(false);