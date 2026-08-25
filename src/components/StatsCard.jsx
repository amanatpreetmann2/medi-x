import { motion } from "framer-motion";

function StatsCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -5 }}
      transition={{ duration: 0.2 }}
      className="stats-card"
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