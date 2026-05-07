import { useState, useEffect } from 'react';
import styles from './PitonDemo.module.css';

const CODE_SAMPLES = [
  `якщо 5 > 3 {
  друк("Привіт, Світ!")
}`,
  `функція сума(а, б) {
  повернути а + б
}`,
  `для і від 1 до 5 {
  друк(і)
}`
];

export const PitonDemo = () => {
  const [codeIndex, setCodeIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  
  useEffect(() => {
    let currentCode = CODE_SAMPLES[codeIndex];
    let i = 0;
    setDisplayedCode('');
    
    const interval = setInterval(() => {
      setDisplayedCode(currentCode.slice(0, i + 1));
      i++;
      if (i === currentCode.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCodeIndex((prev) => (prev + 1) % CODE_SAMPLES.length);
        }, 3000);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [codeIndex]);

  return (
    <section className={styles.section}>
      <div className={styles.window}>
        <div className={styles.titleBar}>
          <div className={styles.dots}>
            <span className={styles.red} />
            <span className={styles.yellow} />
            <span className={styles.green} />
          </div>
          <div className={styles.title}>piton_example.pt</div>
        </div>
        <div className={styles.content}>
          <pre className={styles.code}>
            <code>{displayedCode}</code>
            <span className={styles.cursor} />
          </pre>
        </div>
      </div>
    </section>
  );
};
