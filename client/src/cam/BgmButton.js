import { useState } from "react";
import styles from "./BgmButton.module.css";

function BgmButton({ musicOn, setMusicOn }) {
  return (
    <>
      <input
        className={styles.reactSwitchCheckbox}
        id={`reactBgmSwitch`}
        type="checkbox"
      />
      <label
        className={styles.reactSwitchLabel}
        htmlFor={`reactBgmSwitch`}
        onClick={() => {
          if (musicOn === true) setMusicOn(false);
          if (musicOn === false) setMusicOn(true);
        }}
      >
        <span className={styles.reactSwitchButton}>
          {musicOn ? "on" : "off"}
        </span>
      </label>
    </>
  );
}
export default BgmButton;
