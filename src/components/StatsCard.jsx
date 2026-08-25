import { motion } from "framer-motion";

function StatsCard({ title, value, icon, onClick }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -5,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{ duration: 0.2 }}
      className="stats-card"
      onClick={onClick}
    >
      <div className="stats-icon">
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </motion.div>
  );
}

export default StatsCard;