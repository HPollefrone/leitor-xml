const fs = require("fs");
const xml2js = require("xml2js");


fs.readFile(__dirname + '/teste2.xml', function (err, data){
    if (err) throw new Error(err);

    const parser = new xml2js.Parser();

    parser.parseStringPromise(data)
        .then(function (res){
            //console.log(res.nfeProc.NFe[0].infNFe[0].emit[0])
            //CNPJ CEDENTE - EMITENTE
            console.log(res.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0])
            //CNPJ SACADO - DET
            console.log(res.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0])            
            //DATA VENCIMENTO
            console.log(res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].dVenc[0])
            //VALOR DA NOTA
            console.log(res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].vDup[0])           
            //DUPLICATA == CÓDIGO DO BOLETO 
            console.log(res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].nDup[0])

            

        })
        .catch(function (err){
            console.log(err);
        })

});