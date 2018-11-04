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

    start(offset)
    {
        this.oscillator = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.gain.gain.value = 0.1;
        this.oscillator.type = this.type;
        this.oscillator.frequency.value = this.frequency + offset;
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

let soundIndex = []; // this is a dictionary which to each keycode (key) associates a sound object (value)

function soundInit()
{
    addSoundToIndex(32, new Sound("sine", 261.6)); // -
    addSoundToIndex(67, new Sound("sine", 293.665)); // C
    addSoundToIndex(86, new Sound("sine", 349.228)); // V
    addSoundToIndex(66, new Sound("sine", 440)); // B
}

function addSoundToIndex(key, sound)
{
    soundIndex[key] = sound; // This is a C note played on every spacebar press
}

function playSound(key, offset)
{
    if (key in soundIndex) {
        soundIndex[key].start(offset);
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

    if (!soundIndex[key] == undefined) {
        event.preventDefault();
    }

    if (!pressedKeys.includes(key))
    {
        pressedKeys.push(key);
        let offset = 0;

        if (pressedKeys.includes(37)) // Left arrow
        {
            offset -= 10;
        }
        if (pressedKeys.includes(38)) // Up arrow
        {
            offset += 20;
        }
        if (pressedKeys.includes(39)) // Right arrow
        {
            offset += 10;
        }
        if (pressedKeys.includes(40)) // Down arrow
        {
            offset -= 20;
        }

        playSound(key, offset);
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
    document.getElementById("type").addEventListener("change", typeChange);
    document.getElementById("tune").addEventListener("change", tuneChange);
    document.getElementById("echo").addEventListener("change", echoChange);
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

