let TimerObj = {
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
    let T_audio = new Audio("Clock-Ticking.mp3");
    T_audio.pause();
    T_audio.currentTime = 0;
    T_audio.play();
    setInterval(function() {
        if(T_audio.currentTime >1){
            T_audio.pause();
        }
    },50)
    if (TimerObj.seconds < 2) {
        T_audio.pause();
    }
}

function soundAlarm() {
    let amount = 3;
    let audio = new Audio("Timer_Sound_Effect.mp3");

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

    $("#" + key).html(val || 0);
    TimerObj[key] = val;

}

(function detectChanges (key){
    let input = "#" + key + "-input" ;

    $(input).change(function() {
        updateVal(key, $(input).val());
    });
    $(input).keyup(function() {
        updateVal(key, $(input).val());
    });
    
    return arguments.callee;
})("minutes")("seconds");

function startTimer () {
    buttonManager(["start", false] , ["pause", true] , ["stop", true]);
    freezeIputs();
    TimerObj.timerID = setInterval(function(){
        soundTick();
        TimerObj.seconds--;
        if (TimerObj.seconds < 0){
            if (TimerObj.minutes == 0) {
                soundAlarm();
                return stopTimer();
            }
        TimerObj.seconds = 59;
        TimerObj.minutes--;
        }
        
        updateVal("minutes", TimerObj.minutes);
        updateVal("seconds", TimerObj.seconds);
    }, 1000);
}

function pauseTimer () {
    buttonManager(["start", true] , ["pause", false] , ["stop", true]);
    clearInterval(TimerObj.timerID);
}

function stopTimer () {
    clearInterval(TimerObj.timerID);
    buttonManager(["start", true] , ["pause", false] , ["stop", false]);
    unFreezeIputs();

    updateVal("minutes", $("#minutes-input").val());
    updateVal("seconds", $("#seconds-input").val());
}


function buttonManager (...buttonArray) {
    for (let i = 0 ; i < buttonArray.length ; i++) {
        let button = "#" + buttonArray[i][0] + "-button";

        if (buttonArray[i][1]){
            $(button).removeAttr("disabled");
        } else {
            $(button).attr("disabled", "disabled");
        }
    }
}

function freezeIputs (){
    $("#minutes-input").attr("disabled", "disabled");
    $("#seconds-input").attr("disabled", "disabled");
}

function unFreezeIputs (){
    $("#minutes-input").removeAttr("disabled");
    $("#seconds-input").removeAttr("disabled");
}