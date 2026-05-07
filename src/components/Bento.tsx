import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { Trophy, ShieldAlert, Cpu, Code2, ExternalLink, Send } from 'lucide-react';
import styles from './Bento.module.css';

export const Bento = () => {
  const { t } = useLanguage();

  return (
    <section id="projects" className={styles.section}>
      <div className="bento-grid">
        {/* Piton Project - Large Card */}
        <motion.div 
          className={`${styles.card} ${styles.large}`}
          whileHover={{ y: -5 }}
        >
          <div className={styles.cardHeader}>
            <Code2 className={styles.icon} />
            <h3>{t.projects_list.piton.title}</h3>
          </div>
          <p>{t.projects_list.piton.description}</p>
          <div className={styles.tags}>
            <span>Go</span>
            <span>Interpreter</span>
            <span>Graphviz</span>
          </div>
          <a href="https://github.com/OlexiyOdarchuk/Piton" className={styles.link}>
            <ExternalLink size={16} />
          </a>
        </motion.div>

        {/* Hackathon 1 - Medium Card */}
        <motion.div 
          className={`${styles.card} ${styles.medium}`}
          whileHover={{ y: -5 }}
        >
          <div className={styles.cardHeader}>
            <Trophy className={styles.gold} />
            <h3>{t.achievements.hackathon_best.title}</h3>
          </div>
          <p>{t.achievements.hackathon_best.description}</p>
          <div className={styles.tags}>
            <span>Go</span>
            <span>C</span>
            <span>Drones</span>
          </div>
        </motion.div>

        {/* SHMiner - Medium Card */}
        <motion.div 
          className={`${styles.card} ${styles.medium}`}
          whileHover={{ y: -5 }}
        >
          <div className={styles.cardHeader}>
            <Cpu className={styles.icon} />
            <h3>{t.projects_list.shminer.title}</h3>
          </div>
          <p>{t.projects_list.shminer.description}</p>
          <div className={styles.tags}>
            <span>Wails</span>
            <span>Go</span>
            <span>Svelte</span>
          </div>
          <a href="https://github.com/OlexiyOdarchuk/Student-Hryvnia-Miner" className={styles.link}>
            <ExternalLink size={16} />
          </a>
        </motion.div>

        {/* Security - Small Card */}
        <motion.div 
          className={`${styles.card} ${styles.small}`}
          whileHover={{ y: -5 }}
        >
          <div className={styles.cardHeader}>
            <ShieldAlert className={styles.accent} />
            <h3>Security</h3>
          </div>
          <p>{t.achievements.security.description}</p>
        </motion.div>

        {/* Hackathon 2 - Medium Card */}
        <motion.div 
          className={`${styles.card} ${styles.medium}`}
          whileHover={{ y: -5 }}
        >
          <div className={styles.cardHeader}>
            <Trophy className={styles.silver} />
            <h3>{t.achievements.hackathon_mate.title}</h3>
          </div>
          <p>{t.achievements.hackathon_mate.description}</p>
          <div className={styles.tags}>
            <span>AI</span>
            <span>Go</span>
            <span>GPT-4o</span>
          </div>
        </motion.div>

        {/* AbitAssistant - Small Card */}
        <motion.div 
          className={`${styles.card} ${styles.small}`}
          whileHover={{ y: -5 }}
        >
          <div className={styles.cardHeader}>
            <Send className={styles.icon} />
            <h3>AbitAssistant</h3>
          </div>
          <p>{t.projects_list.abit.description}</p>
          <a href="https://github.com/OlexiyOdarchuk/AbitAssistant_Bot" className={styles.link}>
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
