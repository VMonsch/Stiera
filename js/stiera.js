// Made by Victor Monsch

window.onload = init;

let context;

function init()
{
    context = new AudioContext();
    soundInit(context);
    keyInit();
}

//region Sounds


let soundIndex = []; // this is a dictionary which to each keycode (key) associates a sound object (value)

function soundInit()
{
    addSoundToIndex(32, "sine", 261.6); // This is a C note played on every spacebar press
}

function addSoundToIndex(key, type, frequency)
{
    soundIndex[key] = createSound(type, frequency);
    console.log(soundIndex);
}

//endregion

//region Player

function playSound(key)
{
    if (key in soundIndex) {
        soundIndex[key].connect(context.destination);
        soundIndex[key].start();
    }
}

function stopSound(key)
{
    if (key in soundIndex) {
        soundIndex[key].stop();
        soundIndex[key].disconnect(context.destination);
    }
}

/*
let context;

function playerInit() {
    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(event) {
        alert('We\'re using web audio... you\'re not. Please update your browser !');
    }

    var dogBarkingBuffer = null;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    function loadDogSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                dogBarkingBuffer = buffer;
            }, onError);
        }
        request.send();
    }
}
*/
//endregion

//region Keys

function keyInit() {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
}

function handleKeydown(event) {
    playSound(event.keyCode);
}

function handleKeyup(event) {
    stopSound(event.keyCode);
}

function getKey(event) {
    let key;

    if (event.key !== undefined)
    {
        key = event.key;
    }
    else if (event.keyIdentifier !== undefined)
    {
        key = event.keyIdentifier;
    }
    else if (event.keyCode !== undefined)
    {
        key = event.keyCode;
    }

    return key;
}

//endregion

