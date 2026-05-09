import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--color-bg)',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 40,
          height: 40,
          border: '3px solid var(--color-bg-elevated)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
