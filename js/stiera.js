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

class Sound
{
    constructor(context, type, frequency)
    {
        this.context = context;
        this.type = type;
        this.frequency = frequency;
    }

    start()
    {
        this.oscillator = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.oscillator.type = this.type;
        this.oscillator.frequency.value = this.frequency;

        this.oscillator.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.oscillator.start();
    }

    stop()
    {
        this.gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + 1);
        //this.gain.disconnect(this.context.destination);

        //this.clear();
    }

    clear()
    {
        this.oscillator.stop();
        this.gain.disconnect(this.context.destination);
        this.oscillator.disconnect(this.gain);

        this.oscillator = null;
    }
}

let soundIndex = []; // this is a dictionary which to each keycode (key) associates a sound object (value)

function soundInit()
{
    addSoundToIndex(32, new Sound(context, "triangle", 261.6)); // This is a C note played on every spacebar press
    addSoundToIndex(86, new Sound(context, "triangle", 440)); // This is a C note played on every spacebar press
}

function addSoundToIndex(key, sound)
{
    soundIndex[key] = sound; // This is a C note played on every spacebar press
}

function playSound(key) {
    if (key in soundIndex) {
        soundIndex[key].start();
    }
}

function stopSound(key) {
    if (key in soundIndex) {
        soundIndex[key].stop();
    }
}


//endregion

//region Player

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

let pressedKeys = [];

function handleKeydown(event) {
    let key = event.keyCode; // TODO change because of deprecation

    if (!pressedKeys.includes(key)) {
        pressedKeys.push(key);
        playSound(key);
    }
}

function handleKeyup(event) {
    let key = event.keyCode; // TODO change because of deprecation

    stopSound(key);
    pressedKeys.pop(key);
}

/*function getKey(event) {
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
}*/

//endregion

