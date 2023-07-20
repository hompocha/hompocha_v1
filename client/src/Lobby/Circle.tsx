import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {Draggable} from 'gsap/all';
import styles from './Circle.module.css';

gsap.registerPlugin(Draggable);

const Circle = () => {
    const wheelRef = useRef<HTMLUListElement>(null);
    const activeItemRef =useRef<HTMLUListElement>(null);

    useEffect(() => {
        const wheel = Draggable.create(wheelRef.current, {
            type: 'rotation',
            throwProps: true,
            snap: function (endValue) {
                return Math.round(endValue / 90) * 90;
            },
            onDrag: function () {},
            onThrowComplete: function () {
                dragActive();
            },
        });

        gsap.set('#wheel li:not(.active) .details > *', {
            opacity: 0,
            y: -10,
        });

        function dragActive() {
            const rot = wheel[0].rotation / 360;
            const decimal = rot % 1;
            const sliderItems = wheelRef.current?.getElementsByTagName('li');
            const activeItem = wheelRef.current?.querySelector('.active');
        
            const sliderLength = sliderItems?.length || 0;
            let tempIndex = Math.round(sliderLength * decimal);
            let index;
        
            if (rot < 0) {
                index = Math.abs(tempIndex);
            } else {
                index = sliderLength - tempIndex;
            }
        
            if (decimal === 0) {
                index = 0;
            }
        
            gsap.to('#wheel li.active .details > *', {
                opacity: 0,
                y: -10,
                duration: 0.6,
                stagger: 0.1,
            });
        
            if (activeItemRef.current) {
                activeItemRef.current.classList.remove('active');
            }
            if (sliderItems && sliderItems[index]) {
            sliderItems[index].classList.add('active');
            // activeItemRef.current = sliderItems[index];
            }
        
            gsap.to('#wheel li.active .details > *', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
            });
        }
        return () => {
        // wheel[0].kill();
        };
    }, []);
    return (
        <>
        <svg
            className={`svg-mask ${styles.svgMask}`}
            width="600px"
            height="1200px"
            viewBox="0 0 1200 600"
        >   
            <defs>
            <clipPath id="quarterMask">
                <path d="M299.001,26.649L0,325.65c330.267,330.268,865.736,330.268,1196.004,0L897.003,26.649 C731.868,191.784,464.136,191.784,299.001,26.649z" />
            </clipPath>
            </defs>
        </svg>
        <div className={`header ${styles.header}`}></div>
        <div className={`content ${styles.content}`}>
            <ul className={`${styles.featuredSlider}`}> {/*ref={wheelRef}*/}
                <li className={`${styles.active}`}>
                    <div className={`${styles.image}`}>
                    <div className={`${styles.details}`}>
                        <h1 className={`${styles.title}`}>첫번째 방</h1>
                        <hr className={`${styles.small}`} />
                        <h5 className={`${styles.roles}`}>👤👤👤</h5>
                    </div>
                    <img src="https://unsplash.it/1200/900" alt="" />
                    </div>
                </li>
                <li>
                    <div className={`${styles.image}`}>
                        <div className={`${styles.details}`}>
                            <h1 className={`${styles.title}`}>2번째 방</h1>
                            <hr className={`${styles.small}`} />
                            <h5 className={`${styles.roles}`}>👤👤👤</h5>
                        </div>
                        <img src="https://unsplash.it/1200/900" alt="" />
                    </div>  
                </li>
                <li>
                    <div className={`${styles.image}`}>
                        <div className={`${styles.details}`}>
                            <h1 className={`${styles.title}`}>3번째 방</h1>
                            <hr className={`${styles.small}`} />
                            <h5 className={`${styles.roles}`}>👤👤👤</h5>
                        </div>
                        <img src="https://unsplash.it/1200/900" alt="" />
                    </div>
                </li>
                <li>
                    <div className={`${styles.image}`}>
                        <div className={`${styles.details}`}>
                            <h1 className={`${styles.title}`}>4번째 방</h1>
                            <hr className={`${styles.small}`} />
                            <h5 className={`${styles.roles}`}>👤👤👤</h5>
                        </div>
                        <img src="https://unsplash.it/1200/900" alt="" />
                    </div>
                </li>
            </ul>
        </div>  
        </>
    )
}

export default Circle