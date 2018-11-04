// Made by Victor Monsch

//region Init

window.onload = init;

function init()
{
    soundInit();
    keyInit();
    changeInit();
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
        this.volume = 1;
    }

    start(offset)
    {
        this.oscillator = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.gain.gain.value = this.volume;
        this.oscillator.type = this.type;
        this.oscillator.frequency.value = this.frequency + offset;

        this.oscillator.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.oscillator.start();
    }

    stop()
    {
        this.gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + 1);
    }

    clear()
    {
        this.oscillator.stop();
        this.gain.disconnect(this.context.destination);
        this.oscillator.disconnect(this.gain);

        this.oscillator = null;
    }

    setType(type) {
        this.type = type;
        if (this.oscillator)
        {
            this.oscillator.type = type;
        }
    }

    setFrequency(frequency) {
        this.frequency = frequency;
        if (this.oscillator)
        {
            this.oscillator.frequency = frequency;
        }
    }

    setVolume(volume)
    {
        this.volume = volume;

        if (this.gain && this.gain.gain.value !== 0.00001)
        {
            this.gain.gain.exponentialRampToValueAtTime(volume, this.context.currentTime + 1)
            //this.gain.gain.value = volume;
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

function stopSound(key)
{
    if (key in soundIndex) {
        soundIndex[key].stop();
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

    if (!pressedKeys.includes(key))
    {
        event.preventDefault();

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
    event.preventDefault();

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

//region Change

function changeInit()
{
    document.getElementById("type").addEventListener("change", typeChange);
    document.getElementById("volume").addEventListener("change", volumeChange);
}

function typeChange()
{
    let radios = document.getElementsByName("type");

    radios.forEach(function(radio)
    {
        if (radio.checked)
        {
            updateType(radio.id)
        }
    });
}

function updateType(type)
{
    soundIndex.forEach(function(sound)
    {
        sound.setType(type);
    });
}

function volumeChange()
{
    let slider = document.getElementById("volume");

    updateVolume(slider.value);
}

function updateVolume(volume)
{
    soundIndex.forEach(function(sound)
    {
        sound.setVolume(volume);
    });
}

//endregion

