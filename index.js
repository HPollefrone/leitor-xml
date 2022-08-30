const fs = require("fs");
const JSZip = require("jszip");
//const path = require("path");
const xml2js = require("xml2js");


const parser = new xml2js.Parser();
var datas = {
    cnpjCedente:[],
    listaCnpj:[],
    notas:[],
    notasInvalidas:[],
    listaCpfs:[],
};


var index = 0
fs.readFile("teste.zip", function (err, data) {
  if (!err) {
    
    var zip = new JSZip();
    zip.loadAsync(data).then(function (contents) {
      Object.keys(contents.files).forEach(function (filename) {
        zip
          .file(filename)
          .async("nodebuffer")
          .then(function (content) {
            parser.parseStringPromise(content).then(function (res) {
  
              const cedente = 
                res.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0];
                if(index === 0){datas.cnpjCedente.push(cedente)}

              const sacado = 
                res.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0];
                datas.listaCnpj.push(sacado);

              const dataVencimento =
                res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].dVenc[0];

              const valorNota =
                res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].vDup[0];

              const duplicata =
                res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].nDup[0];
                datas.notas.push(duplicata)
            
                

                const somaValores = map.get(cnpj);
                if (somaValores) valorTotal += somaValores

                //to iterate trough content
                index += 1;           

            });

            console.dir(datas);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    });
  }
});


/**
return{
    cnpjCedente,
    listaCnpj,
    notas,
    notasInvalidas,
    listaCpfs,
} 

 */