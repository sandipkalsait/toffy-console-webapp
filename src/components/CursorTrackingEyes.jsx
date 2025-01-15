import { useEffect, useRef } from "react";
import "./CursorTrackingEyes.css";

const CursorTrackingEyes = () => {
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX: mouseX, clientY: mouseY } = event;

      if (leftPupilRef.current && rightPupilRef.current) {
        const leftEye = leftPupilRef.current.parentElement.getBoundingClientRect();
        const rightEye = rightPupilRef.current.parentElement.getBoundingClientRect();

        // Move pupils based on mouse position relative to each eye
        movePupil(leftPupilRef.current, mouseX, mouseY, leftEye);
        movePupil(rightPupilRef.current, mouseX, mouseY, rightEye);
      }
    };

    const movePupil = (pupil, mouseX, mouseY, eyeRect) => {
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      // Calculate offsets from eye center
      const offsetX = mouseX - eyeCenterX;
      const offsetY = mouseY - eyeCenterY;

      // Maximum movement distance for the pupil
      let maxOffsetX = (eyeRect.width / 2) - 10; // 8px margin considering pupil size
      let maxOffsetY = (eyeRect.height / 2) - 10; // 8px margin considering pupil size

      // Increase offset for right and bottom movement
      if (offsetX > 0) {
        maxOffsetX *= 4; // Increase right-side movement offset by 4 times
      }
      if (offsetY > 0) {
        maxOffsetY *= 4; // Increase bottom-side movement offset by 4 times
      }

      // Calculate angle and distance
      const angle = Math.atan2(offsetY, offsetX);
      const distance = Math.min(Math.sqrt(offsetX * offsetX + offsetY * offsetY), Math.min(maxOffsetX, maxOffsetY));

      // Calculate pupil movement in X and Y
      const movementX = Math.cos(angle) * distance;
      const movementY = Math.sin(angle) * distance;

      // Log the pupil's position (movementX and movementY) for debugging
      console.log("Pupil Position - X:", movementX, "Y:", movementY);

      // Apply movement to the pupil
      pupil.style.transform = `translate(${movementX}px, ${movementY}px)`;
    };

    // Listen for mouse movement
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="face">
      <div className="eye">
        <div className="pupil" ref={leftPupilRef}></div>
      </div>
      <div className="eye">
        <div className="pupil" ref={rightPupilRef}></div>
      </div>
    </div>
  );
};

export default CursorTrackingEyes;
