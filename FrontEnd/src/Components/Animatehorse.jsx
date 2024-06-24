import { motion } from "framer-motion";
import { GiSeahorse } from "react-icons/gi";

const AnimatedSeahorse = ({ delay }) => {
    return (
        <motion.div
          whileHover={{
            scale: 1.2,
            rotate: 360,
            color: "#FFB600", // Change color to orange on hover
            transition: { duration: 0.5 }
          }}
          whileTap={{ scale: 0.8 }} // Optional: Add animation on tap
        >
          <GiSeahorse className="text-7xl" />
        </motion.div>
      );
};

export default AnimatedSeahorse;