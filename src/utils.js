import _ from 'lodash';
import Decimal from 'decimal.js';

export const ROUND_DECIMAL = 3;
export const DECIMAL_MULTIPLIER = 1000;

export function parse(num) {
  if(!isNaN(num) && num) {
    return Number(num);
  } else {
    return Number(0.0);
  }
}

export function MyMath(num) {
  const wrapper = (onum) => ({
    _num: onum,
    add: function(num) {
      let calcVal = this._num.add(num || '0');
      return wrapper(calcVal);
    },
    sub: function(num) {
      let calcVal = this._num.sub(num || '0');
      return wrapper(calcVal);
    },
    mul: function(num) {
      let calcVal = this._num.mul(num || '0');
      return wrapper(calcVal);
    },
    div: function(num) {
      let calcVal = this._num.div(num || '0');
      return wrapper(calcVal);
    },
    floor: function() {
      let calcVal = new Decimal(this._num.toFixed(ROUND_DECIMAL, Decimal.ROUND_DOWN));
      return wrapper(calcVal);
    },
    toString: function() {
      if(this._num.isInteger()){
        return this._num.toString();
      }
      return this._num.toFixed(ROUND_DECIMAL);
    },
    greaterThanOrEqualTo: function(num) {
      return this._num.greaterThanOrEqualTo(num);
    }
  });
  return wrapper(new Decimal(num || '0'));
}

export function round(num, withLeadingZeros=false, decimals=ROUND_DECIMAL) {
  num = parse(num);
  num = Math.round(num + "e" + decimals);
  num = Number(num + "e" + -decimals);
  if(withLeadingZeros) {
    return num.toLocaleString("en",{useGrouping: false,minimumFractionDigits: decimals});
  } else {
    return num;
  }
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

function convertNumberToWords(no) {
  var words = new Array();
  words[0] = '';
  words[1] = 'One';
  words[2] = 'Two';
  words[3] = 'Three';
  words[4] = 'Four';
  words[5] = 'Five';
  words[6] = 'Six';
  words[7] = 'Seven';
  words[8] = 'Eight';
  words[9] = 'Nine';
  words[10] = 'Ten';
  words[11] = 'Eleven';
  words[12] = 'Twelve';
  words[13] = 'Thirteen';
  words[14] = 'Fourteen';
  words[15] = 'Fifteen';
  words[16] = 'Sixteen';
  words[17] = 'Seventeen';
  words[18] = 'Eighteen';
  words[19] = 'Nineteen';
  words[20] = 'Twenty';
  words[30] = 'Thirty';
  words[40] = 'Forty';
  words[50] = 'Fifty';
  words[60] = 'Sixty';
  words[70] = 'Seventy';
  words[80] = 'Eighty';
  words[90] = 'Ninety';
  var atemp = no.toString().split(".");
  var number = atemp[0].split(",").join("");
  var n_length = number.length;
  var words_string = "";
  if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
          received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
          n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
          if (i == 0 || i == 2 || i == 4 || i == 7) {
              if (n_array[i] == 1) {
                  n_array[j] = 10 + parseInt(n_array[j]);
                  n_array[i] = 0;
              }
          }
      }
      let value = "";
      for (var i = 0; i < 9; i++) {
          if (i == 0 || i == 2 || i == 4 || i == 7) {
              value = n_array[i] * 10;
          } else {
              value = n_array[i];
          }
          if (value != 0) {
              words_string += words[value] + " ";
          }
          if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
              words_string += "Crore ";
          }
          if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
              words_string += "Lakh ";
          }
          if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
              words_string += "Thousand ";
          }
          if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
              words_string += "Hundred and ";
          } else if (i == 6 && value != 0) {
              words_string += "Hundred ";
          }
      }
      words_string = words_string.split("  ").join(" ");
  }
  return words_string;
}

export function convertAmountToWords(amount) {
  let [major, dec] = amount.toString().split('.');
  let major_string =  convertNumberToWords(major);
  if(typeof(dec) != 'undefined') {
      let dec_string = convertNumberToWords(dec);
      major_string += ' and  paise ' + dec_string;
  }
  return (major_string + ' only').toUpperCase();
}

export function getAxiosErr(err) {
  let message = '';
  if (err.response) {
    // client received an error response (5xx, 4xx)
    if(_.isString(err.response.data.message)) {
      message = err.response.data.message;
    } else {
      message = err.response.statusText + '. Contact administrator.';
    }
  } else if (err.request) {
    // client never received a response, or request never left
    message = 'Not able to send the request. Contact administrator.';
  } else {
    message = 'Some error occurred. Contact administrator.';
  }
  return message;
}

export function commonUniqueChecker(name, collection, isEdit=false, origName='', nameKey='name') {
  if(isEdit) {
    return !Boolean(_.find(collection, (r)=>(
      r[nameKey].toUpperCase() == name.toUpperCase() && r[nameKey].toUpperCase() != origName.toUpperCase()
    )));
  } else {
    return !Boolean(_.find(collection, (r)=>(r[nameKey].toUpperCase() == name.toUpperCase())));
  }
}

export function getDatesForType(dateType) {
  let today = new Date();
  let from_date = new Date();
  let to_date = new Date();

  if(dateType === 'current-f' || dateType === 'last-f') {
    from_date.setMonth(3);
    from_date.setDate(1);
    to_date.setMonth(2);
    to_date.setDate(31);

    if(today.getMonth()+1 <= 3) {
      let yearDiff = dateType === 'current-f' ? 0 : 1;
      from_date.setFullYear(today.getFullYear()-1-yearDiff);
      to_date.setFullYear(today.getFullYear()-yearDiff);
    } else {
      let yearDiff = dateType === 'current-f' ? 1 : 0;
      from_date.setFullYear(today.getFullYear()-1+yearDiff);
      to_date.setFullYear(today.getFullYear()+yearDiff);
    }
  } else if(dateType === 'current-m') {
    let year = today.getFullYear();
    let month = today.getMonth();
    from_date = new Date(year, month, 1);
    to_date = new Date(year, month + 1, 0);
  } else if(dateType === 'last-m') {
    let year = today.getMonth() === 0 ? today.getFullYear() -1 : today.getFullYear();
    let month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    from_date = new Date(year, month, 1);
    to_date = new Date(year, month + 1, 0);
  }

  return [from_date, to_date];
}