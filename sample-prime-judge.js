// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function primeNumber(num){
    //2 は素数なので true を返す
    if(num === 2) {
      return true;
    }
    else {
      for(var i = 2; i < num; i++) {
        //2以上の数で割ったとき余りが0になれば false を返す。つまり素数ではない。
        if(num % i === 0) {
          return false;
        }
      }
      return true;
    }
　}
  
  function check(agent){
    var text = request.body.queryResult.queryText;
    
    // 数値が抽出されていればそれを使う
    if(request.body.queryResult.parameters.number){
      text = request.body.queryResult.parameters.number;
    }
    
    if (!isNaN(text)){
      var num = parseInt(text);
      if( num >= 2){
        // 素数判定
        if (primeNumber(num)){
          agent.add(text + 'は，素数です．');
        }
        else{
          agent.add(text + 'は，素数ではありません．');
        }
      }
      else{
        agent.add('2以上の数値を言ってください');
      }
    }
    else{
      agent.add(text + 'ですか？数値を言ってください');
    }
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('number', check);
  intentMap.set('Default Fallback Intent', check);
  agent.handleRequest(intentMap);
});
