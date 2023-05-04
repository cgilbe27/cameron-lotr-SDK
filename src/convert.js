const codegen = require("postman-code-generators"); // require postman-code-generators in your project
const sdk = require("postman-collection"); // require postman-collection in your project
const fs = require("fs");
const language = "javascript";
const variant = "fetch";
const options = {
  indentCount: 2,
  indentType: "Space",
  trimRequestBody: true,
  followRedirect: true,
};

const directory = "dist";

const rmDir = function (dirPath) {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (let file of files) {
      const filePath = dirPath + "/" + file;
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmDir(filePath);
      }
    }

  fs.rmdirSync(dirPath);
};

const convert = () => {
  const postmanCollection = JSON.parse(
    fs
      .readFileSync("./postman/Lord of the Rings.postman_collection.json")
      .toString()
      .replaceAll(":id", "{{id}}")
  );
  rmDir(directory);

  if (!fs.existsSync(directory)) {
    fs.mkdir(directory, (err) => {
      if (err) return err;
      const fileExtArr = [];

      for (let endpoints of postmanCollection.item) {
        const endpointItem = endpoints.item;
        if (endpointItem) {
          for (let endpoint of endpointItem) {
            const request = new sdk.Request(endpoint.request);
            // It appears postman-code-generators has a bug when generating auth headers,
            // would need switch statement to do this for each auth method
            request.addHeader({
              key: "Authorization",
              value: "Bearer {{accessToken}}",
            });

            codegen.convert(
              language,
              variant,
              request,
              options,
              function (error, snippet) {
                if (error) {
                  //  handle error
                  throw new Error(error);
                }
                //  handle snippet
                const varRegex = /\{\{[a-zA-Z]*\}\}/gm;
                const variables = snippet.match(varRegex);
                const args = [];
                for (let variable of variables) {
                  snippet = snippet.replaceAll(
                    variable,
                    variable.replaceAll("}}", "}").replaceAll("{{", "${")
                  );
                  args.push(variable.replaceAll("{{", "").replaceAll("}}", ""));
                }

                snippet = snippet
                  .replaceAll('"', "`")
                  .replaceAll("fetch", "return fetch");
                const funcName = endpoint.name.replaceAll(" ", "");

                const template = `export const ${funcName} = async (${args.join(
                  ", "
                )}) => {
      ${snippet}
      }`;
                const fileExt = `${funcName}.js`;
                fileExtArr.push(`./${fileExt}`);
                fs.writeFile(`./dist/${fileExt}`, template, (err) => {
                  if (err) return err;

                  console.log("Directory and File Saved ");
                });
              }
            );
          }
        }
      }

      const index = fileExtArr.map((p) => `export * from '${p}';\n`).join("");

      fs.writeFile(`./dist/index.js`, index, (err) => {
        if (err) return err;

        console.log("Directory and File Saved ");
      });
    });
  }
};

convert();

exports.convert = convert;
