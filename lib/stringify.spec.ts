import fs from "fs";
import { expect } from "chai";
import Json from ".";


describe("Json.stringify", () => {
  fs.readdirSync(`${__dirname}/tests`, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith("y_") && entry.name.endsWith(".json"))
    .forEach((entry) => {
      const file = `${__dirname}/tests/${entry.name}`;
      const value = JSON.parse(fs.readFileSync(file, "utf8"));

      it(`${entry.name.substr(2)} without spaces`, () => {
        expect(Json.stringify(value)).to.eql(JSON.stringify(value));
      });

      it(`${entry.name.substr(2)} with spaces`, () => {
        expect(Json.stringify(value, undefined, "  ")).to.eql(JSON.stringify(value, undefined, "  "));
      });
    });
});
