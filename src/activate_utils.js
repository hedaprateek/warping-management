const crypto = require('crypto');
const Buffer = require('buffer').Buffer;
const iv = 'yantra'.padEnd(16, 'a');

function finalizeKey(key) {
    return  key.substr(0, 32).padEnd(32, 'X');
}

module.exports = {
    encrypt: function(text, key) {
        key = finalizeKey(key);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return encrypted.toString('hex');
    },
    decrypt: function(text, key) {
        key = finalizeKey(key);
        let div = Buffer.from(iv);
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), div);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    },
    epochDiffDays: function(epoch1, epoch2) {
        let diff = epoch1 - epoch2;
        return Math.round(diff/84600);
    },
    getEpoch: function(inp_date, reset_at=0) {
        let date_obj = inp_date ? inp_date : new Date();

        if(reset_at === -1) {
            date_obj.setHours(0, 0, 0, 0);
        } else if (reset_at === -1){
            date_obj.setHours(23, 59, 59, 999);
        }
        return parseInt(date_obj.getTime()/1000);
    },
    getDateFromEpoch: function(inp_epoch, in_string=false) {
        let date_obj = new Date(inp_epoch*1000);

        if(in_string) {
            return date_obj.toLocaleDateString() + ' ' + date_obj.toLocaleTimeString();
        }
        return date_obj;
    }
}