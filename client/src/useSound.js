import { useEffect } from "react";
import { Howl } from "howler";

function useSound(src, volume = 1) {
  let sound;
  const soundStop = () => sound.stop();
  const soundPlay = (src) => {
    sound = new Howl({ src });
    sound.volume(volume);
    sound.play();
    sound.loop(true);
  };

  useEffect(() => {
    soundPlay(src);
    return soundStop;
  }, []);
}

export default useSound;
