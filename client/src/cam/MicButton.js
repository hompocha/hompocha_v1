
import { useState } from "react";
import styles from "./MicButton.module.css";

export function MicButton({ onMicToggle, user }) {
  const [micEnabled, setMicEnabled] = useState(true);


  const toggleMic = () => {
    setMicEnabled((prevState) => {
      const enabled = !prevState;
      const publisher = user.getStreamManager();

      if (enabled) {
        publisher.publishAudio(true);
      } else {
        publisher.publishAudio(false);
      }

      onMicToggle(enabled);
      return enabled;
    });
  };

  const labelClassName = micEnabled
    ? `${styles.reactSwitchLabel} ${styles.reactSwitchLabelGreen}`
    : `${styles.reactSwitchLabel} ${styles.reactSwitchLabelGrey}`;

  return (
    <>
      <input
        className={styles.reactSwitchCheckbox}
        id={`reactMicSwtich`}
        type="checkbox"
      />
      <label
        className={labelClassName}
        htmlFor={`reactMicSwtich`}
        onClick={toggleMic}
      >
        <span className={styles.reactSwitchButton}>
          {micEnabled ? "on" : "off"}
        </span>
      </label>
    </>
  );
}
