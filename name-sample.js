//
// 指定された名前に応じて部屋番号を取得する Fulfillment
//

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

	function getRoomNumber(agent){
		
		// name パラメータを取得
		var name = request.body.queryResult.parameters.name;
		//var name = request.body.queryResult.outputContexts[0].parameters.name;
		var room = 'none';

		// 指定された名前に応じて部屋番号を取得
		if(name == '河原先生'){
			room = '408';
		}
		else if(name == '井上先生'){
			room = '417';
		}
		else if(name == '原さん'){
			room = '417';
		}

		// 応答を追加
		if (room != 'none'){
			agent.add(name + 'の部屋は' + room + '号室です。');
		}
		else{
			agent.add('すみません。' + name + 'の部屋はわかりません。');
		}
	}

	// Run the proper function handler based on the matched Dialogflow intent name
	let intentMap = new Map();
	intentMap.set('Greeting', getRoomNumber);
	agent.handleRequest(intentMap);
});
