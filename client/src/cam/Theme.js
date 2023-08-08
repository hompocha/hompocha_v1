import styles from "../cam/CamMain.module.css";
import pochaBGM from "../sounds/themeBGM/themePochaBGM.mp3";
import barBGM from "../sounds/themeBGM/themeBarBGM.mp3";
import izakayaBGM from "../sounds/themeBGM/themeIzakayaBGM.mp3";
import { effectSound } from "../effectSound";
import React, {useEffect, useState} from 'react';
import BgmButton from "./BgmButton";
import Modal from "./Modal";
import styless from "../voice/shootingStar.module.scss";

const Theme = ({mode, camMainLoaded,user}) => {
  const [theme,setTheme] = useState(0);
  const [musicOn,setMusicOn] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [shootingStar, setShootingStar] = useState(true);
  let bgImg;
  let bgItem;
  switch (theme) {
    case 0:
      bgImg = `${styles.themePocha}`;
      bgItem = `${styles.themePochaItem}`;
      break;
    case 1:
      bgImg = `${styles.themeBar}`;
      bgItem = `${styles.themeBarItem}`;
      break;
    case 2:
      bgImg = `${styles.themeIzakaya}`;
      bgItem = `${styles.themeIzakayaItem}`;break;
    default:
      break;
  }
  // console.log("wooooo", bgImg, theme);
  useEffect(() => {
    let mainBGM;
    switch (theme) {
      case 0:
        if (mode === undefined) mainBGM = effectSound(pochaBGM, true, 0.1);
        if (musicOn === false) mainBGM.stop();
        break;
      case 1:
        if (mode === undefined) mainBGM = effectSound(barBGM, true, 0.1);
        if (musicOn === false) mainBGM.stop();
        break;
      case 2:
        if (mode === undefined) mainBGM = effectSound(izakayaBGM, true, 0.1);
        if (musicOn === false) mainBGM.stop();
        break;

      default:
        break;
    }
    return () => {
      if (mode === undefined && musicOn === true) {
        mainBGM.stop();
      }
    };
  }, [theme, mode, musicOn]);

  useEffect(() => {
    if(theme === 0)
      setShootingStar(true);
    else
      setShootingStar(false);
  }, [theme]);


  /*테마 변경 시그널 받는 함수 */
  useEffect(() => {
    const handleThemeSignal = (event) => {
      setTheme(prevTheme => (prevTheme + 1) % 3);
    };

    const streamManager = user.getStreamManager();
    if (streamManager && streamManager.stream && streamManager.stream.session) {
      streamManager.stream.session.on("signal:theme", handleThemeSignal);
    }

    return () => {
      if (streamManager && streamManager.stream && streamManager.stream.session) {
        streamManager.stream.session.off("signal:theme", handleThemeSignal);
      }
    };
  }, [user]);

  return (
    <div>
      <div className={bgImg}></div>
      {camMainLoaded && mode===undefined && (<div>
        <div className={bgItem}
             onMouseOver={() => setModalOpen(true)}
             onMouseLeave={() => setModalOpen(false)}></div>
        <div className={styles.bgm}>
          <div className={styles.bgmControl}>
            <BgmButton musicOn={musicOn} setMusicOn={setMusicOn} />
          </div>
        </div>
        {modalOpen && <Modal setModalOpen={setModalOpen} />}
          {shootingStar && (<>
          <div className={styless.night}>
            {Array.from({ length: 24 }, (_, index) => (
              <>
                <div className={styless.shooting_star} key={index}></div>
              </>
            ))}
          </div>
        </>)}
      </div>)}

    </div>
  );
}

export default Theme;
