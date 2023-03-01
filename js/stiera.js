// Made by Victor Monsch

//region Init


window.onload = init;

function init()
{
    soundInit();
    keyInit();
    changeInit();

    document.getElementById("title").onclick = function() {
        location.reload();
    };
}

//endregion

//region Sounds

class Sound
{
    constructor(type, frequency)
    {
        this.context = new AudioContext();
        this.type = type;
        this.frequency = frequency;
    }

    start()
    {
        this.oscillator = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.gain.gain.value = 0.2;
        this.oscillator.type = this.type;
        this.oscillator.frequency.value = this.frequency;
        this.detune(getTune());

        this.oscillator.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.oscillator.start();
    }

    stop(echo)
    {
        this.gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + echo);
    }

    clear()
    {
        this.oscillator.stop();
        this.gain.disconnect(this.context.destination);
        this.oscillator.disconnect(this.gain);

        this.oscillator = null;
    }

    setType(type)
    {
        this.type = type;
        if (this.oscillator)
        {
            this.oscillator.type = type;
        }
    }

    detune(tune)
    {
        if (this.oscillator)
        {
            //this.oscillator.detune.setValueAtTime(tune, this.context.currentTime + 1);
            this.oscillator.detune.value = +tune;
        }
    }
}

let frequencyIndex = [];
let soundIndex = []; // this is a dictionary which to each keycode (key) associates a sound object (value)

function soundInit()
{
    // Num keys
    addFrequencyToIndex(222, 261.63);
    addFrequencyToIndex(49, 277.18);
    addFrequencyToIndex(50, 293.66);
    addFrequencyToIndex(51, 311.13);
    addFrequencyToIndex(52, 329.63);
    addFrequencyToIndex(53, 349.23);
    addFrequencyToIndex(54, 369.99);
    addFrequencyToIndex(55, 392);
    addFrequencyToIndex(56, 415.30);
    addFrequencyToIndex(57, 440);
    addFrequencyToIndex(48, 466.16);
    addFrequencyToIndex(219, 493.88);
    addFrequencyToIndex(189, 493.88); //mac
    addFrequencyToIndex(187, 523.25);


    generateSounds();
}

function generateSounds() {
    frequencyIndex.forEach(function(frequency)
    {
        let key = frequencyIndex.indexOf(frequency);
        let sound = new Sound(getType(), frequency);
        addSoundToIndex(key, sound);
    });
}

function addFrequencyToIndex(key, frequency)
{
    frequencyIndex[key] = frequency;
}

function addSoundToIndex(key, sound)
{
    soundIndex[key] = sound;
}

function playSound(key)
{
    if (key in soundIndex) {
        soundIndex[key].start();
    }
}

function stopSound(key, echo)
{
    if (key in soundIndex) {
        soundIndex[key].stop(echo);
    }
}

//endregion

//region Keys

function keyInit()
{
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
}

let pressedKeys = [];

function handleKeydown(event)
{
    let key = event.keyCode; // TODO change because of deprecation

    if (key in soundIndex) {
        event.preventDefault();
    }

    if (!pressedKeys.includes(key))
    {
        pressedKeys.push(key);

        playSound(key);
    }
}

function handleKeyup(event) {
    //event.preventDefault();

    let key = event.keyCode; // TODO change because of deprecation

    stopSound(key, getEcho());
    pressedKeys.pop(); // TODO figure out why delete does not work
}

//endregion

//region Change

function changeInit()
{
    document.getElementById("type").addEventListener("input", typeChange);
    document.getElementById("tune").addEventListener("input", tuneChange);
    document.getElementById("echo").addEventListener("input", echoChange);
}

function typeChange()
{
    updateType(getType());
}

function updateType(type)
{
    soundIndex.forEach(function(sound)
    {
        sound.setType(type);
    });
}

function getType() {
    let radios = document.getElementsByName("type");
    let value = "sine";

    radios.forEach(function(radio)
    {
        if (radio.checked)
        {
            value = radio.value;
        }
    });

    return value;
}

function tuneChange()
{
    updateTune(getTune())
}

function updateTune(tune)
{
    soundIndex.forEach(function(sound)
    {
        sound.detune(tune);
    });
}

function getTune()
{
    let slider = document.getElementById("tune");

    return parseFloat(slider.value);
}

function echoChange()
{
    updateEcho(getEcho())
}

function updateEcho(echo)
{
    soundIndex.forEach(function(sound)
    {

    });
}

function getEcho()
{
    let slider = document.getElementById("echo");

    return parseFloat(slider.value);
}

//endregion

