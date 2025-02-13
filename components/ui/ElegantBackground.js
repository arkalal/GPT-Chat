"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import styles from "./ElegantBackground.module.scss";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "white-08",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`${styles.elegant_shape} ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className={styles.elegant_shape__container}
      >
        <div
          className={`${styles.elegant_shape__gradient} ${styles[gradient]}`}
        />
      </motion.div>
    </motion.div>
  );
}

function ElegantBackground({
  badge = "Design Collective",
  title1 = "Elevate Your Digital Vision",
  title2 = "Crafting Exceptional Websites",
  description = "",
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className={styles.background}>
      <div className={styles.background__gradient} />

      <div className={styles.background__shapes}>
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="indigo"
          className={styles.shape_1}
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="rose"
          className={styles.shape_2}
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="violet"
          className={styles.shape_3}
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="amber"
          className={styles.shape_4}
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="cyan"
          className={styles.shape_5}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.content__inner}>
          {badge && (
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className={styles.badge}
            >
              <Circle className={styles.badge__circle} />
              <span className={styles.badge__text}>{badge}</span>
            </motion.div>
          )}

          {(title1 || title2) && (
            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className={styles.title}>
                {title1 && (
                  <span className={styles.title__white}>{title1}</span>
                )}
                {title2 && (
                  <>
                    <br />
                    <span className={styles.title__gradient}>{title2}</span>
                  </>
                )}
              </h1>
            </motion.div>
          )}

          {description && (
            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className={styles.description}>{description}</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className={styles.overlay} />
    </div>
  );
}

export { ElegantBackground };
