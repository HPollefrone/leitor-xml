const fs = require("fs");
const JSZip = require("jszip");
//const path = require("path");
const xml2js = require("xml2js");
const _ = require("lodash");

const parser = new xml2js.Parser();
var datas = {
  cnpjCedente: String(),
  listaCnpj: Array(),
  notas: Array(),
  notasInvalidas: Array(),
  listaCpfs: Array(),
};

var index = 0;
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

              const notas = {
                "razaoSocialSacado": String(),
                "cnpj":  String(),
                "dataVencimento": String(),
                "valorNota": 0.0,
                "duplicatas": String(),

              }

              const cedente = res.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0];
              if (index === 0) {
                datas.cnpjCedente = cedente;
              }

              const sacado = res.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0];
                notas.cnpj = sacado;

              const dataVencimento =
                res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].dVenc[0];
                notas.dataVencimento = formatDate(dataVencimento);

              const valorNota =
                res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].vDup[0];
                datas.listaCnpj.push({ cnpj: sacado, valorTotal: parseFloat(valorNota) });
                notas.valorNota = parseFloat(valorNota)
              
              const duplicata = res.nfeProc.NFe[0].infNFe[0].ide[0].nNF[0];
                notas.duplicatas = duplicata


              datas.notas.push(notas);        
              index += 1; 
                
            });

            //console.dir(datas);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    }); //.then(data => { console.dir(datas); console.log(data) });
  }
});

/**timer gambiarra */
function func1(number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(77 + number), 1000);
  });
}
func1(4).then((number) => {
  let objTeste = datas.listaCnpj;
  /**função para conversão de dados  --->*/

  let map = objTeste.reduce((prev, next) => {
    if (next.cnpj in prev) {
      prev[next.cnpj].valorTotal =
        prev[next.cnpj].valorTotal += next.valorTotal;
    } else {
      prev[next.cnpj] = next;
    }
    return prev;
  }, {});
  //return da função
  let result = Object.keys(map).map((cnpj) => map[cnpj]);

  /** <--- função para conversão de dados*/

  datas.listaCnpj = result;
  console.log(datas);
});



function formatDate(date){
  const newDate = date.substring(8,)+
                  date.substring(5,7)+
                  date.substring(2,4);

  return newDate
}
/**
return{
    cnpjCedente,
    listaCnpj,
    notas,
    notasInvalidas,
    listaCpfs,
} 

 */
