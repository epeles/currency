const https = require('https');
const http = require('http');
const printError = e => console.error(e.message);

const getStock = moedaDestino => {
        const printStock = (origem, destino, rate, updated) => {
            console.log(`${origem} 1 =  ${destino} ${parseFloat(rate).toFixed(2).replace('.',',')} 
(Updated in ${updated} - UTC)`);
     //       console.log(`From ${origem} to ${destino}. Rate: ${parseFloat(rate).toFixed(2)}. Updated in ${updated} - UTC.`);
        }

        //Connect to the API URL https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=5MB0G4MPRK9SOC7D
        //Documentação em https://www.alphavantage.co/documentation/
        const req = https.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${moedaDestino.toUpperCase()}&apikey=5MB0G4MPRK9SOC7D`, res => {
            if (res.statusCode === 200) {  
                let body = "";
                //Read the data
                res.on('data',data => {
                    body += data.toString();
            //        console.dir(`Before parsing: ${body}`);
                });
                res.on('end', () => {
                    try {
                        //Parse the data
                        const stock = JSON.parse(body);
                      //  console.dir(`After parsing: ${stock}`);
                        //Print the data
                        printStock(stock["Realtime Currency Exchange Rate"]["1. From_Currency Code"], stock["Realtime Currency Exchange Rate"]["3. To_Currency Code"], stock["Realtime Currency Exchange Rate"]["5. Exchange Rate"], stock["Realtime Currency Exchange Rate"]["6. Last Refreshed"]);
                    } catch(e) {
                        printError(e);
                    }    
                });
            }  
            else {
                const message = `Houve um erro ao tentar acessar: (${http.STATUS_CODES[res.statusCode]})`;
                const statusCodeError = new Error(message);
                printError(statusCodeError);
            }    
        req.on('error',printError);        
})};       

const currency = process.argv.slice(2);   
currency.forEach(getStock);