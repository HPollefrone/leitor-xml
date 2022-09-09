const fs = require("fs");
const JSZip = require("jszip");
//const path = require("path");
const xml2js = require("xml2js");
const _ = require("lodash");
const {addDays, compareAsc, format, parse} = require("date-fns");


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
                
                const dataVenc = convertDateFromCNAB(formatDate(dataVencimento));
                if (dataVencimentoValida(dataVenc.year, dataVenc.month, dataVenc.day)) {
                  datas.notas.push(notas);
                } else {
                  // logger.debug(
                  //   'Data de vencimento invalida para o CNPJ %s com dataVencimento %s e valor %d (datas corte: min %s e max %s)',
                  //   cnpj,
                  //   (dataVencimento.year+"/"+dataVencimento.month+"/"+dataVencimento.day+' dd/MM/yyyy'),
                  //   valorTotal,
                  //   format(addDays(new Date(), 7), 'dd/MM/yyyy'),
                  //   format(addDays(new Date(), 120), 'dd/MM/yyyy'),
                  // );
                  //console.log(dataVenc.year, dataVenc.month, dataVenc.day)
                  datas.notasInvalidas.push(notas);
                }


              //datas.notas.push(notas);        
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

/**ENTENDER SE DATA DO CNAB ESTÁ ENTRE HOJE+7 DIAS && HOJE+120DIAS */
const dataMinVencimento = (year, month, day) =>
  compareAsc(new Date(year, month, day), addDays(new Date(), 7));

const dataMaxVencimento = (year, month, day) =>
  compareAsc(addDays(new Date(), 120), new Date(year, month, day));

const dataVencimentoValida = (year, month, day) => // (+new Date() + Math.floor(Math.random() * 4)) % 2 === 0;
dataMinVencimento(year, month, day) > 0 && dataMaxVencimento(year, month, day) > 0;

  
//const cnabDate = parseInt(050722)
//const cnabDateObj = convertDateFromCNAB(cnabDate); 
  
  
  
function convertDateFromCNAB(cnabDate) {
    //console.log(`antes de formatar: ${cnabDate}`)
    const day = cnabDate.substring(0,2);
    const month = cnabDate.substring(2,4);
    const year = '20'+cnabDate.substring(4,);
    const date = { 
      'year': year,
      'month': String(parseInt(month)-1) ,
      'day': String(day)
    };
    
    //console.log(`year:${date.year}, month:${date.month}, day:${date.day}`)
    return date
  }; 

/**
return{
    cnpjCedente,
    listaCnpj,
    notas,
    notasInvalidas,
    listaCpfs,
} 

 */
