const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const replaceTemplate = require("./modules/template-modules");
///////////////////////////////////////////
// FILES//
//Syncronyous way
//const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
//console.log(textIn);

//const textOut = `write to file plus ${textIn}.\n`;
//console.log(textOut);

//fs.writeFileSync("./txt/output.txt", textOut);
//console.log("file written");

// Asyncronyous way readind writing files

/*fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("error baby!!!");
  console.log(data1);
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
        console.log("your file has been written !!!");
      });
    });
  });
}); */

///////////////////////////////////////////
// SERVER//

//read once file for API in SYNC version

const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const templateCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const templateProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);
//end
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  //console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  //const pathname = req.url;
  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map(el => replaceTemplate(templateCard, el))
      .join("");
    //console.log(cardsHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    //console.log(query);
    res.end(output);
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text-html"
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listen on port 8000");
});
