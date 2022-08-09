import fs from "fs";
import { expect } from "chai";
import Json from ".";


describe("Json.parse", () => {
  fs.readdirSync(`${__dirname}/tests`, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .forEach((entry) => {
      const file = `${__dirname}/tests/${entry.name}`;
      const json = fs.readFileSync(file, "utf8");

      if (entry.name.startsWith("y_")) {
        it(entry.name.substr(2), () => {
          expect(Json.parse(json)).to.eql(JSON.parse(json));
        });
      } else if (entry.name.startsWith("n_")) {
        it(entry.name.substr(2), () => {
          try {
            JSON.parse(json);
            expect.fail("Expected JSON.parse to throw an error");
          } catch (error) {
            expect(() => Json.parse(json)).to.throw(SyntaxError);
          }
        });
      }
    });
});
