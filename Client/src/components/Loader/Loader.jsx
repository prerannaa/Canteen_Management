import React from "react";
import { useEffect } from "react";
import { useRef } from "react";


const Loader = () => {
  const boxRef = useRef(null);

  useEffect(() => {
    const boxElement = boxRef.current;

    if (!boxElement) {
      return;
    }

    const updateAnimation = () => {
      const angle =
        (parseFloat(boxElement.style.getPropertyValue("--angle")) + 0.45) % 360;
      boxElement.style.setProperty("--angle", `${angle}deg`);
      requestAnimationFrame(updateAnimation);
    };

    requestAnimationFrame(updateAnimation);
  }, []);

  return (
    <div className='flex justify-center items-center h-screen' >
      <div
        ref={boxRef}
        style={{
          "--angle": "0deg",
          "--border-color": "linear-gradient(var(--angle), #ffffff, #6fcf63)",
          "--bg-color": "linear-gradient(#234F1E, #234F1E)",
        }}
        className="flex h-[200px] w-[200px] border-4 border-[#0000] p-0 [background:padding-box_var(--bg-color),border-box_var(--border-color)]"
      >
        <img src="logo.png" alt="loading logo"  />
      </div>
    </div>
  );
};

export default Loader;
