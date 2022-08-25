const fs = require("fs");
const JSZip = require("jszip");


fs.readFile("teste.zip", function(err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
        const res = zip
        console.log(res.files)
        res.files
            
        });
        //console.log(res.nfeProc.NFe[0].infNFe[0].emit[0])
        //CNPJ CEDENTE - EMITENTE
        //console.log(res.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0])
        //CNPJ SACADO - DET
        //console.log(res.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0])            
        //DATA VENCIMENTO
        //console.log(res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].dVenc[0])
        //VALOR DA NOTA
        //console.log(res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].vDup[0])           
        //DUPLICATA == CÓDIGO DO BOLETO 
        //console.log(res.nfeProc.NFe[0].infNFe[0].cobr[0].dup[0].nDup[0])
        
});

