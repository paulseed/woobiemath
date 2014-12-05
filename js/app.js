var answer;
var done1s;
var done10s;
var done100s;
var volume;
var level;
var stage;
var levelUpBln = false;
var skipCount;
var timeout_Dialog;
var timeout_Hint;

//TODO: let Woobie try 3 times and if she still gets it wrong automatic generate a new problem.
//TODO: add an animation to stage faces transitions something like the pow but only more subtle;
//TODO: add modal for too many skips
//TODO: add modal for reset
//TODO: add onclick event for hover replacement on touch screens

function init() {
    try {

        preload();
        $("#copyDate").html(new Date().getFullYear());

        if (typeof(Storage) !== "undefined") {
            stage = localStorage.getItem("stage") ? localStorage.getItem("stage") : 0;
            level = localStorage.getItem("level") ? localStorage.getItem("level") : 1;
            volume = localStorage.getItem("volume") ? localStorage.getItem("volume") : true;
            skipCount = localStorage.getItem("skipCount") ? localStorage.getItem("skipCount") : 0;
        } else {
            stage = 0;
            level = 1;
            volume = true;
            skipCount = 0;
        }
        for (var i = 1; i <= stage; i++) {
            $('#face-' + i).attr("src","res/img/faces/" + i + ".gif")
        }
        if (volume == "false") {
            //document.getElementById("x-mark").style.display = "inline";
            $("#x-mark").show();
            volume = false;
        } else {
            volume = true;
            $("#x-mark").hide();
            //document.getElementById("x-mark").style.display = "none";
        }
        //may not want to do this
        getProblems();
    }
    catch (err) {
        alert(err.message);
    }
}
function preload(){
    try{
        if (document.images) {
            var img1 = new Image();
            var img2 = new Image();
            var img3 = new Image();
            var img4 = new Image();
            var img5 = new Image();
            var img6 = new Image();
            var img7 = new Image();
            var img8 = new Image();
            var img9 = new Image();
            var img10 = new Image();
            var img12 = new Image();

            img1.src = "res/img/kitten/1.gif";
            img2.src = "res/img/kitten/2.gif";
            img3.src = "res/img/kitten/3.gif";
            img4.src = "res/img/kitten/4.gif";
            img5.src = "res/img/kitten/5.gif";
            img6.src = "res/img/puppy/1.gif";
            img7.src = "res/img/puppy/2.gif";
            img8.src = "res/img/puppy/3.gif";
            img9.src = "res/img/puppy/4.gif";
            img10.src = "res/img/pow.png";
            img12.src = "res/img/powXX.png";
        }

        var audio1 = new Audio();
        var audio2 = new Audio();
        var audio3 = new Audio();
        var audio4 = new Audio();
        var audio5 = new Audio();

        audio1.src = "res/audio/fart.wav";
        audio2.src = "res/audio/yay.wav";
        audio3.src = "res/audio/bubbles.wav";
        audio4.src = "res/audio/whah_whah.wav";
        audio5.src = "res/audio/ufo.wav";
    }
    catch(err){
        alert(err.message);
    }
}

function getProblems() {

    try {
        var min = 10;
        var max = 99;

        var value1 = localStorage.getItem("value1") ? parseInt(localStorage.getItem("value1")) : getRandomInt(min, max);
        var value2 = localStorage.getItem("value2") ? parseInt(localStorage.getItem("value2")) : getRandomInt(min, max);
        localStorage.setItem("value1", value1);
        localStorage.setItem("value2", value2);

        answer = value1 + value2;

        var number1 = value1.toString();
        var number2 = value2.toString();

        var top1s = number1[1];
        var top10s = number1[0];
        var bottom1s = number2[1];
        var bottom10s = number2[0];

        $("#top1s").html(top1s);
        $("#top10s").html(top10s);
        $("#bottom1s").html(bottom1s);
        $("#bottom10s").html(bottom10s);

        done1s = false;
        done10s = false;
        done100s = false;
        document.getElementById("selected1s").innerHTML = null;
        document.getElementById("selected10s").innerHTML = null;
        document.getElementById("selected100s").innerHTML = null;
        document.getElementById("invisible").style.display = "inline";
        document.getElementById("levelNum").innerHTML = level;
        document.getElementById("carry10s").style.display = "none";
        document.getElementById("carry100s").style.display = "none";
        document.getElementById("selected1s").style.display = "none";
        document.getElementById("selected10s").style.display = "none";
        document.getElementById("selected100s").style.display = "none";
        document.getElementById("answers1s").style.display = "inline";
        document.getElementById("answers10s").style.display = "none";
        document.getElementById("answers100s").style.display = "none";
    }
    catch (err) {
        alert(err.message);
    }
}
function getRandomInt(min, max) {
    try {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    catch (err) {
        alert(err.message);
    }
}
function checkAnswer() {
    try {
        var ones = parseInt(document.getElementById("selected1s").innerHTML);
        var tens = parseInt(document.getElementById("selected10s").innerHTML) * 10;
        var hundreds = parseInt(document.getElementById("selected100s").innerHTML) * 100;
        if (hundreds > 900) {
            hundreds = 0;
        }
        var given = hundreds + tens + ones;
        var picker = getRandomInt(1, 6);
        var selected_text;
        var selected_audio;
        var audio;

        if (given == answer) {
            dialog("You are super amazing! That was the right answer!!!", "You're ready for another, lets move on.");
            selected_text = "puppy/" + picker;

            picker = getRandomInt(1, 3);
            if (picker == 1) {
                selected_audio = "res/audio/bubbles.wav";
            }
            else {
                selected_audio = "res/audio/yay.wav";
            }
            audio = new Audio(selected_audio);
            localStorage.removeItem("value1");
            localStorage.removeItem("value2");
            getProblems();
            incrementStage();
        } else {
            dialog("You are totally awesome, however your math skills aren't.", "Lets try that one again.");
            selected_text = "kitten/" + picker;

            picker = getRandomInt(1, 3);
            if (picker == 1) {
                selected_audio = "res/audio/fart.wav";
            }
            else {
                selected_audio = "res/audio/whah_whah.wav";
            }
            audio = new Audio(selected_audio);
            decrementStage();
        }
        selected_text = "res/img/" + selected_text + ".gif";
        document.getElementById('animal').src = selected_text;
        if (volume) {
            audio.play();
        }

        document.getElementById("carry10s").style.display = "none";
        document.getElementById("carry100s").style.display = "none";
        document.getElementById("selected1s").style.display = "none";
        document.getElementById("selected10s").style.display = "none";
        document.getElementById("selected100s").style.display = "none";
        document.getElementById("answers1s").style.display = "inline";
        document.getElementById("submit").style.display = "none";
        document.getElementById("skip").style.display = "inline";

        done1s = false;
        done10s = false;
        done100s = false;
        document.getElementById("selected1s").innerHTML = null;
        document.getElementById("selected10s").innerHTML = null;
        document.getElementById("selected100s").innerHTML = null;
        document.getElementById("invisible").style.display = "inline";
    }
    catch (err) {
        alert(err.message);
    }
}
function decrementStage() {
    try {
        if (stage > 0) {
            document.getElementById('face-' + stage).src = "res/img/faces/12.gif";
            if (stage >= 1) {
                stage--;
                localStorage.setItem("stage", stage);
            }
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function incrementStage() {
    try {
        stage++;
        localStorage.setItem("stage", stage);
        var stage_image;
        if (stage <= 10) {
            stage_image = "res/img/faces/" + stage + ".gif";
            document.getElementById('face-' + stage).src = stage_image;
        } else {
            stage = 0;
            localStorage.setItem("stage", stage);
            level++;
            skipCount = 0;
            localStorage.setItem("skipCount", skipCount);
            localStorage.setItem("level", level);
            levelUpBln = true;
            for (var i = 1; i <= 10; i++) {
                stage_image = "res/img/faces/12.gif";
                document.getElementById('face-' + i).src = stage_image;
            }
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function carry(id) {
    try {
        window.setTimeout(function () {
            if (document.getElementById(id).style.display == "inline") {
                document.getElementById(id).style.display = "none";
                if (id == "carry100s") {
                    document.getElementById("invisible").style.display = "inline";
                }
            } else {
                document.getElementById(id).style.display = "inline";
                if (id == "carry100s") {
                    document.getElementById("invisible").style.display = "none";
                }
            }
        }, 300);
    }
    catch (err) {
        alert(err.message);
    }
}
function selectValue(column, value, next, showgo) {
    try {
        document.getElementById("answers" + column).style.display = "none";
        document.getElementById("chosen" + column).style.display = "inline";
        document.getElementById("selected" + column).style.display = "inline";
        if (value == 13) {
            document.getElementById("selected" + column).style.opacity = "0";
        } else {
            document.getElementById("selected" + column).style.opacity = "1";
        }
        document.getElementById("selected" + column).innerHTML = value;
        if (next != "nonext") {
            var already_done = false;
            switch (column) {
                case "1s":
                    if (done10s) {
                        already_done = true;
                    }
                    break;
                case "10s":
                    if (done100s) {
                        already_done = true;
                    }
                    break;
            }
            if (!already_done) {
                document.getElementById("answers" + next).style.display = "inline";
                document.getElementById("selected" + next).style.display = "none";
                document.getElementById("chosen" + next).style.display = "none";
            }
        }
        var hasValue = !!document.getElementById("selected" + column).innerHTML;
        switch (column) {
            case "1s":
                if (hasValue) {
                    done1s = true;
                }
                break;
            case "10s":
                if (hasValue) {
                    done10s = true;
                }
                break;
            case "100s":
                if (hasValue) {
                    done100s = true;
                }
                break;
        }
        if (showgo || (document.getElementById("selected1s").innerHTML &&
            document.getElementById("selected10s").innerHTML &&
            document.getElementById("selected100s").innerHTML) ||
            (done100s && done10s && done1s)) {
            showGo();
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function showGo() {
    try {
        document.getElementById("submit").style.display = "inline";
        document.getElementById("skip").style.display = "none";
    }
    catch (err) {
        alert(err.message);
    }
}
function levelUp() {
    try {
        var powName = "pow";
        if (levelUpBln) {
            if (level >= 10) {
                powName = "powXX";
            }
            levelUpBln = false;
            document.getElementById(powName + "Img").className += " load";
            var ufo_audio = "res/audio/ufo.wav";
            var audio = new Audio(ufo_audio);
            if (volume) {
                audio.play();
            }
            window.setTimeout(function () {
                document.getElementById("levelNum").innerHTML = level;
            }, 2000);

            window.setTimeout(function () {
                document.getElementById(powName + "Img").className = "";
            }, 4000);
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function reloadAnswers(column) {
    try {
        document.getElementById("answers1s").style.display = "none";
        document.getElementById("answers10s").style.display = "none";
        document.getElementById("answers100s").style.display = "none";
        document.getElementById("chosen1s").style.display = "inline";
        document.getElementById("selected1s").style.display = "inline";
        document.getElementById("chosen10s").style.display = "inline";
        document.getElementById("selected10s").style.display = "inline";
        document.getElementById("chosen100s").style.display = "inline";
        document.getElementById("selected100s").style.display = "inline";
        document.getElementById("answers" + column).style.display = "inline";
        document.getElementById("chosen" + column).style.display = "none";
        document.getElementById("selected" + column).style.display = "none";
        document.getElementById("submit").style.display = "none";
        document.getElementById("skip").style.display = "inline";
    }
    catch (err) {
        alert(err.message);
    }
}
function dialog(text1, text2) {
    try {
        window.clearTimeout(timeout_Dialog);
        if (document.getElementById("dialog").style.display == "inline") {
            document.getElementById("dialog").style.display = "none";
            levelUp();
        }
        else {
            document.getElementById("dialog").style.display = "inline";
            document.getElementById("placeholder").innerHTML = text1;
            document.getElementById("placeholder2").innerHTML = text2;
            timeout_Dialog = window.setTimeout(function () {
                document.getElementById("dialog").style.display = "none";
                levelUp();
            }, 5000);
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function toggleVolume() {
    try {
        if (document.getElementById("x-mark").style.display == "inline") {
            document.getElementById("x-mark").style.display = "none";
            volume = true;
        }
        else {
            document.getElementById("x-mark").style.display = "inline";
            volume = false;
        }
        localStorage.setItem("volume", volume);
    }
    catch (err) {
        alert(err.message);
    }
}
function skip() {
    try {
        skipCount++;
        localStorage.setItem("skipCount", skipCount);
        // only allow 3 skips per stage
        if (skipCount <= 3) {
            localStorage.removeItem("value1");
            localStorage.removeItem("value2");
            getProblems();
        }
        else {
            alert("You have used all your skips for this level");
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function show_hint(valueA, valueB) {
    try {
        window.clearTimeout(timeout_Hint);
        var hintNum1;
        var hintNum2;
        if (valueA >= valueB) {
            hintNum1 = valueA - 1;
            hintNum2 = valueB;
        } else {
            hintNum1 = valueB - 1;
            hintNum2 = valueA;
        }
        var sum = parseInt(hintNum2) + parseInt(hintNum1);
        document.getElementById("hintText").innerHTML = "Here is a super useful hint!";
        document.getElementById("hint1").innerHTML = hintNum1.toString();
        document.getElementById("hint3").innerHTML = hintNum2.toString();
        document.getElementById("hint5").innerHTML = sum.toString();

        if (document.getElementById("hint").style.display == "inline") {
            document.getElementById("hint").style.display = "none";
        }
        else {
            document.getElementById("hint").style.display = "inline";
            timeout_Hint = window.setTimeout(function () {
                document.getElementById("hint").style.display = "none";
                levelUp();
            }, 5000);
        }
    }
    catch (err) {
        alert(err.message);
    }
}
function showPow() {
    try {
        var powName = "powImg";

        if (level >= 10) {
            powName = "powImgXX";
        }

        document.getElementById(powName).className += " load";
        var audio = new Audio("res/audio/ufo.wav");
        if (volume) {
            audio.play();
        }
        window.setTimeout(function () {
            document.getElementById("levelNum").innerHTML = level;
        }, 2000);

        window.setTimeout(function () {
            document.getElementById(powName).className = "";
        }, 4000);
    }
    catch (err) {
        alert(err.message);
    }
}
function reset() {
    try {
        if (confirm("Do you want to reset to level 1?")) {
            localStorage.clear();
            for (var i = 1; i <= 10; i++) {
                document.getElementById('face-' + i).src = "res/img/faces/12.gif";
            }
            level = 1;
            stage = 0;
            skipCount = 0;
            document.getElementById("x-mark").style.display = "none";
            getProblems();
        }
    }
    catch (err) {
        alert(err.message);
    }
}