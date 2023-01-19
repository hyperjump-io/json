import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { expect } from "chai";
import * as Json from "./index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
