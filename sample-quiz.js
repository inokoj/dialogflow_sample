// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

// クイズとヒントの定義
const quiz = [
	{ one : "私は黄色いです。", two : "私は細長いです。", three : "私はくだものです。", answer : "バナナ"},
  　{ one : "私は川です。", two : "私は東北地方にいます。", three : "私は日本一長い川です。", answer : "信濃川"}
];
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function start(agent) {
	// ランダムにクイズを選択
	var quiz_index = Math.floor( Math.random() * 2 );
	let quiz_selected = quiz[quiz_index];
	agent.add('クイズです。私は誰でしょう？' + quiz_selected.one);
	agent.setContext({ name: 'quiz_context', lifespan: 1, parameters: { time: 1, quiz_index: quiz_index, answer: quiz_selected.answer}});
  }
  
  function answer(agent){
	
	// ユーザの回答を取得
	var answer_user = request.body.queryResult.queryText;
	
	// 答えなどを文脈から取得
	var context = agent.getContext('quiz_context');
	var answer_ref = context.parameters.answer;
	
	if (context){
		agent.add('もう一度やる場合は、もう一度、と言ってください。');
		return;
	}
	
	if (answer_user.indexOf(answer_ref) != -1){
	  //正解
	  agent.add('正解です。おめでとうございます。');
	  agent.setContext({ name: 'end', lifespan: 1});
	}
	else{
	  // 不正解
	  var time = context.parameters.time;
	  var quiz_index = context.parameters.quiz_index;
	  let quiz_selected = quiz[quiz_index];
	  
	  if (time == 3){
		// 終了
		agent.add('残念。答えは' + answer_ref + 'です。また遊びましょう。');
		agent.setContext({ name: 'end', lifespan: 1});
		return;
	  }
	  else if (time == 2){
	  	// 3回目のヒント
		let next_hint = quiz_selected.three;
		agent.add('違います。最後のヒントは、' + next_hint);
	  }
	  else if (time == 1){
	  	// 2回目のヒント
		let next_hint = quiz_selected.two;
		agent.add('違います。次のヒントは、' + next_hint);
	  }
	  agent.setContext({ name: 'quiz_context', lifespan: 1, parameters: { time: time+1, quiz_index: quiz_index, answer: answer_ref}});
	}
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', start);
  intentMap.set('Restart', start);
  intentMap.set('Default Fallback Intent', answer);
  agent.handleRequest(intentMap);
});
