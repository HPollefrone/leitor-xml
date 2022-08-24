const fs = require("fs");
const xml2js = require("xml2js");


fs.readFile(__dirname + '/arquivo.xml', function (err, data){
    if (err) throw new Error(err);

    const parser = new xml2js.Parser();

    parser.parseStringPromise(data)
        .then(function (res){
            console.log(res)

        })
        .catch(function (err){
            console.log(err);
        })

});