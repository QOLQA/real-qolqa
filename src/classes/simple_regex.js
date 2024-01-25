import { RegularExpressions } from "../services/regex";

export class SimpleRegex extends RegularExpressions {
  constructor() {
    super();
    this.regexCardinality = /^(1\.\.1|1\.\.\*|\.\.1)$/;
  }

  isValidCardinality(cardinality) {
    return (this.regexCardinality.test(cardinality))
  }
}
