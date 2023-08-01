import { Howl } from "howler";

function useEffectSound(src, volume = 1) {
  let sound;
  const soundInject = (src) => {
    sound = new Howl({ src });
    sound.volume(volume);
  };
  soundInject(src);
  return sound;
}

export default useEffectSound;
