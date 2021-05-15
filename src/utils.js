const ROUND_DECIMAL = 3;

export function parse(num) {
  if(!isNaN(num)) {
    num = Math.round(num + "e" + ROUND_DECIMAL);
    return Number(num + "e" + -ROUND_DECIMAL);
  } else {
    return Number(0.0);
  }
}