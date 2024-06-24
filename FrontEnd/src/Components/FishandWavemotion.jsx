import { motion } from "framer-motion";
import { FaFish } from "react-icons/fa";

const AnimatedFishIcon = () => {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <motion.div
        style={{ position: "absolute", top: "50%", left: 0, translateX: "-50%" }}
        animate={{
          x: ["-100%", "100%"], // Define the x-axis motion as an array of values
          y: [-20, 20, -20], // Define the y-axis motion as an array of values
          transition: { duration: 5, repeat: Infinity } // Set the duration and repeat
        }}
      >
        <FaFish size={50} />
      </motion.div>
    </div>
  );
};

export default AnimatedFishIcon;
