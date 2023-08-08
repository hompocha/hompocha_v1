import { useState } from "react";
import styles from "./BgmButton.module.css";

function BgmButton({ musicOn, setMusicOn }) {
  const labelClassName = musicOn
    ? `${styles.reactSwitchLabel} ${styles.reactSwitchLabelGreen}`
    : `${styles.reactSwitchLabel} ${styles.reactSwitchLabelGrey}`;
  return (
    <>
      <div
        className={`${musicOn ? styles.bgmOnState : styles.bgmOffState}`}
      ></div>
      <input
        className={styles.reactSwitchCheckbox}
        id={`reactBgmSwitch`}
        type="checkbox"
      />
      <label
        className={labelClassName}
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
