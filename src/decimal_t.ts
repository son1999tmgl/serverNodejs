import Decimal from "decimal.js";

export class decimal_t extends Decimal {
    constructor(n: Decimal.Value | undefined | null) {
        if (n === undefined || n === null) {
            n = 0
        }
        super(n);
    }
    cong(n1: Decimal.Value | undefined | null, n2: Decimal.Value | undefined | null, ...args: any) {
        if (n1 === undefined || n1 === null) {
            n1 = 0
        }
        if (n2 === undefined || n2 === null) {
            n2 = 0
        }
        return (new Decimal(n1)).plus(new Decimal(n2))
    }

    tru(n1: Decimal.Value | undefined | null, n2: Decimal.Value | undefined | null) {
        if (n1 === undefined || n1 === null) {
            n1 = 0
        }
        if (n2 === undefined || n2 === null) {
            n2 = 0
        }
        return (new Decimal(n1)).minus(new Decimal(n2))
    }
}