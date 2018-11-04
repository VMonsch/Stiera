class Sound
{
    constructor(context, key, type, frequency)
    {
        this.context = context;
        this.key = key;
        this.type = type;
        this.frequency = frequency;
    }

    play()
    {
        this.oscillator = this.context.createOscillator();
        this.oscillator.type = this.type;
        this.oscillator.frequency.value = this.frequency;

        this.oscillator.connect(context.destination);
        this.oscillator.start();
    }

    stop()
    {
        this.oscillator.stop();
        this.oscillator.disconnect(context.destination);

        this.oscillator = null;
    }
}