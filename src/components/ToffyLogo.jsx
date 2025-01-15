

import './ToffyLogo.css';
import CursorTrackingEyes from './CursorTrackingEyes';
const ToffyLogo = () => {
  return (
    <div className="relative w-40 h-40 bg-blue-400 rounded-2xl border-4 border-black flex items-center justify-center">
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-full h-4 bg-black"></div>
      <div className="absolute h-full w-4 bg-black"></div>
    </div>
    
    <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center">
      <CursorTrackingEyes />
    </div>
    </div>
  );
};

export default ToffyLogo;


