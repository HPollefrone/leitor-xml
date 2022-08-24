const fs = require("fs");
const JSZip = require("jszip");


fs.readFile("teste.zip", function(err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
        const xmlZip = zip
        console.log('Conteudo ziado - >', xmlZip)
        
});

});