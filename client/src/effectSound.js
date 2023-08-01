import { Howl } from "howler";

function effectSound(src) {
  let sound;
  const soundInject = (src) => {
    sound = new Howl({ src });
    sound.volume(1);
    sound.play();
  };
  soundInject(src);
  return sound;
}

export { effectSound };
