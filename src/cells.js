import { Column, Table } from "./userObjects";
import mx from "./util";

let tableObject = new Table('TABLENAME');
export const table = new mx.mxCell(tableObject, new mx.mxGeometry(0, 0, 200, 28), 'table');

table.setVertex(true);

// logica de sidebar icon

let columnObject = new Column('COLUMNAME');
export const column = new mx.mxCell(columnObject, new mx.mxGeometry(0, 0, 0, 50));

column.setVertex(true);
column.setConnectable(false);