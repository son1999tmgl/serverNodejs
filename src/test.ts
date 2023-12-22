import express from 'express';
import Decimal from 'decimal.js';


let x = new Decimal(123.12)
let y = new Decimal(14.23)
console.log(x.equals(y));


const app = express();
console.log(1234);
app.listen(3001, () => {
    console.log(`Example app listening on port ${3001}`);
});



