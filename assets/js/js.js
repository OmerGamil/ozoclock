let timerObj = {
    minutes : 0 ,
    seconds : 0 ,
    timerID : 0
}

let muted = false;

function soundButton() {
    let volumeButton = document.getElementById("volume-icon");

    if (volumeButton.classList.contains("fa-volume-mute")){
        muted = false;
        volumeButton.classList.remove("fa-volume-mute");
        volumeButton.classList.add("fa-volume-up");
    } else {
        muted = true;
        volumeButton.classList.remove("fa-volume-up");
        volumeButton.classList.add("fa-volume-mute")
    }
}

function soundTick() {
    if (muted){
        return;
    }
    let tAudio = new Audio("assets/audio/clock-ticking.mp3");
    tAudio.pause();
    tAudio.currentTime = 0;
    tAudio.play();
    setInterval(function() {
        if(tAudio.currentTime > 1){
            tAudio.pause();
        }
    },50)
    if (timerObj.seconds < 2) {
        tAudio.pause();
    }
}

function soundAlarm() {
    let amount = 3;
    let audio = new Audio("assets/audio/timer-sound-effect.mp3");

    for (let i = 0 ; i < amount ; i++) {
        setTimeout(function(){
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }, 1200 * i);
    }
}

function updateVal(key , val) {
    if (val < 0 ) {
        val = 0 ;
        console.log("The Time can't be negative ,Einestein!")
    }
    
    if (key == "seconds") {
        if (val < 10 ) {
            val = "0" + val ;
        }    
        
        if (val > 59) {
            val = 59;
        }
    }
    
    if (key == "minutes") {
        if (val > 300) {
            val = 300;
        }
    }

    let elem = document.getElementById(key);
    elem.innerHTML = val || 0;
    timerObj[key] = val;

}

(function detectChanges(key) {
    let input = document.getElementById(key + "-input") ;

    input.addEventListener("change" , (event) => {
        updateVal(key, input.value);
    });
    input.addEventListener("keyup" , (event) => {
        updateVal(key, input.value);
    });
    
    return arguments.callee;
})("minutes")("seconds");

function startTimer () {
    buttonManager(["start", false] , ["pause", true] , ["stop", true]);
    freezeIputs();
    timerObj.timerID = setInterval(function(){
        soundTick();
        timerObj.seconds--;
        if (timerObj.seconds < 0){
            if (timerObj.minutes == 0) {
                soundAlarm();
                return stopTimer();
            }
            timerObj.seconds = 59;
            timerObj.minutes--;
        }
        
        updateVal("minutes", timerObj.minutes);
        updateVal("seconds", timerObj.seconds);
    }, 1000);
}

function pauseTimer () {
    buttonManager(["start", true] , ["pause", false] , ["stop", true]);
    clearInterval(timerObj.timerID);
}

function stopTimer () {
    clearInterval(timerObj.timerID);
    buttonManager(["start", true] , ["pause", false] , ["stop", false]);
    unFreezeIputs();

    let minutes = document.getElementById("minutes-input");
    let seconds = document.getElementById("seconds-input");

    updateVal("minutes", minutes.value );
    updateVal("seconds", seconds.value );
}


function buttonManager (...buttonArray) {
    for (let i = 0 ; i < buttonArray.length ; i++) {
        let button = document.getElementById(buttonArray[i][0] + "-button");

        if (buttonArray[i][1]){
            button.removeAttribute("disabled");
        } else {
            button.setAttribute("disabled", "disabled");
        }
    }
}

function freezeIputs (){
    let minutes = document.getElementById("minutes-input");
    let seconds = document.getElementById("seconds-input");

    minutes.setAttribute("disabled", "disabled");
    seconds.setAttribute("disabled", "disabled");
}

function unFreezeIputs (){
    let minutes = document.getElementById("minutes-input");
    let seconds = document.getElementById("seconds-input");

    seconds.removeAttribute("disabled");
    minutes.removeAttribute("disabled");
}