// function injectedFunction() {
// 	document.body.style.backgroundColor = "orange";
//   }

// chrome.action.onClicked.addListener(async () => {
// 	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// 	chrome.scripting.executeScript({
// 		target: { tabId: tab.id },
// 		// files: ["content.js"],
// 		func : injectedFunction,
// 	});
// });


try {
	// Called when the user clicks on the browser action
	// chrome.action.onClicked.addListener(function (tab) {
	// 	// Send a message to the active tab
	// 	chrome.tabs.query({ active: true, currentWindow: true },
	// 		function (tabs) {
	// 			var activeTab = tabs[ 0 ];
	// 			chrome.tabs.sendMessage(activeTab.id,
	// 				{ "message": "apply_changes" }
	// 			);
	// 		});
	// });

	chrome.action.onClicked.addListener((tab) => {
		chrome.scripting.executeScript({
		  target: { tabId: tab.id },
		  files: ["content.js"]
		});
	  });

} catch (err) {
	console.error('error in background.js', err)
}



// try{
// 	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 		if (message.action === 'messageFromContentScript') {
// 		  console.log('Received message from content script:', message.data);
	  
// 		  // Example: Sending a response back to the content script
// 		  sendResponse('Message received by extension');
// 		}
// 	  });
	  
// }catch(err){
// 	console.error('error 2222 in background.js', err)
// }