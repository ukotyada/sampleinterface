// Example 1: sets up service wrapper, sends initial message, and
// receives response.
var prompt = require('prompt-sync')();

var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: '21bf0a9d-6d70-4a4d-ac7a-103376fa9aa0', // replace with username from service key
  password: 'V5JsbbAAG8UZ', // replace with password from service key
  path: { workspace_id: '3c700559-3328-4a06-862d-d5c0f34664b7' }, // replace with workspace ID
  version_date: '2016-07-11'
});

// Start conversation with empty message.
function chatBoxMessage(message, cb){
    conversation.message(message, cb);
};
conversation.message({}, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  // If an intent was detected, log it out to the console.
  if (response.intents.length > 0) {
    console.log('Detected intent: #' + response.intents[0].intent);
  }

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      console.log(response.output.text[0]);

  }

  // Prompt for the next round of input.
  var newMessageFromUser = prompt('>> ');
  conversation.message({
    input: { text: newMessageFromUser }
    }, processResponse)
}