import { Howl } from "howler";

function effectSound(src, repeatBool, volume) {
  let sound;
  const soundInject = (src) => {
    sound = new Howl({ src });
    sound.volume(volume);
    sound.play();
    sound.loop(repeatBool);
  };
  soundInject(src);
  return sound;
}

export { effectSound };
