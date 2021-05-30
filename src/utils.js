const ROUND_DECIMAL = 3;

export function parse(num) {
  if(!isNaN(num) && num) {
    return Number(num);
  } else {
    return Number(0.0);
  }
}

export function round(num) {
  num = parse(num);
  num = Math.round(num + "e" + ROUND_DECIMAL);
  return Number(num + "e" + -ROUND_DECIMAL);
}

export const getDefaultRow = (cols) => {
  let row = {}
  cols.forEach((col)=>{
    if(col.id?.startsWith('btn')) {
      return;
    }
    row[col.accessor] = 0;
  });
  return row;
}
