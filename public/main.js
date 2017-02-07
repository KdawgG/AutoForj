var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition,
    recognition = new SpeechRecognition(),
    output = document.getElementById('output');
// $(document).ready(function(){
//     $("#user").change(function(e) {
//         $.post ("/user",{ user : $(this).val()})
//     });
// });
recognition.continuous = false;
recognition.interimResults = false  ;
recognition.start();
recognition.onstart = function(e) {
    console.log('onstart', e);
};
recognition.onend = function(e) {
    console.log('onend', e);
};
recognition.onresult = function(e) {
	console.log('onresult', e);
    if (typeof(e.results) == 'undefined') {
    	console.log('onresult restart');
        recognition.stop();
        recognition.start();
        return;
    }
    generate(e.results);
};
recognition.onspeechend = function(e) {
    console.log('onspeechend', e);
};
recognition.onerror = function(e) {
    console.log('onerror', e);
};

function generate(items) {
	var i = 0
    var html = ''
    for (i = 0; i < items.length; i += 1) {
        if (check(items[i][0].transcript)) {
            html += '<span>' + items[i][0].transcript + '</span>';
		} else html += items[i][0].transcript;
    }

    let finaloutput = items[0][0].transcript
    $.post("/", {output: finaloutput, user: $("#user").val(), width: $("#width").val()},function(data){
        document.getElementById("result").setAttribute('src', data)
    })
    
    output.innerHTML = html;
};

function check(text) {
    if (text.indexOf('weather') !== -1) {
        console.log('weather');
        return true;
    } else return false;
}   

