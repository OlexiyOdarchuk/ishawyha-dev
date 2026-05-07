import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import styles from './Hero.module.css';

export const Hero = () => {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className={styles.hero}>
      <motion.div 
        className={styles.content}
        style={{ y: y1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>{t.hero.title}</h1>
        <h2 className={styles.subtitle}>{t.hero.subtitle}</h2>
        <p className={styles.description}>{t.hero.description}</p>
        
        <div className={styles.cta}>
          <a href="#projects" className={styles.primaryBtn}>{t.sections.projects}</a>
          <a href="https://t.me/NeShawyha" target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
            Telegram
          </a>
        </div>
      </motion.div>
      
      <div className={styles.glow} />
    </section>
  );
};
