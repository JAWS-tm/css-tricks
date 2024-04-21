// Represents the lerped mouse position (to make a smoother cursor movement)
let mouse = {
  x: 0,
  y: 0,
};
// Represents the actual cursor position (by default, it's set to the bottom right corner of the screen)
let cursor = {
  x: window.innerWidth,
  y: window.innerHeight,
};

window.addEventListener("mousemove", function (e) {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

// Calculate the horizontal distance between two points
const calcDistance = (a, b) => {
  const dx = b.x - a.x;
  return Math.abs(dx);
};

const setupVariableText = (className) => {
  let chars = [];
  let text = "";
  let element;

  const init = () => {
    element = document.querySelector(className);
    text = element.innerText;

    // Clear the element's content and create a span for each character
    element.innerHTML = "";
    text.split("").forEach((char) => {
      let span = document.createElement("span");
      span.className = "char";
      span.textContent = char;
      element.appendChild(span);

      chars.push(span);
    });

    // Set the font size based on the window width
    const setFontSize = () => {
      var fontSize = window.innerWidth / (text.length / 2);
      element.style.fontSize = fontSize + "px";
    };
    setFontSize();
    window.addEventListener("resize", setFontSize);

    update();
  };

  // Lerp the mouse position for a smoother cursor movement
  const lerpMouse = () => {
    const delta = 0.05;
    mouse.x += (cursor.x - mouse.x) * delta;
    mouse.y += (cursor.y - mouse.y) * delta;
  };

  const update = () => {
    lerpMouse();
    const maxDist = element.getBoundingClientRect().width / 2;

    chars.forEach((char) => {
      const charPos = char.getBoundingClientRect();
      const distance = calcDistance(mouse, {
        x: charPos.left + charPos.width / 2,
        y: charPos.top,
      });

      // Linear interpolation function
      const getValue = (dist, min, max) => {
        const increment = (max - min) / maxDist;
        const value = min + increment * (maxDist - dist);
        return Math.max(min, value);
      };

      const greyScale = getValue(distance, 100, 255);
      char.style = `
        font-variation-settings: 
          'wght' ${getValue(distance, 100, 900)}, 
          'wdth' ${getValue(distance, 5, 200)}, 
          'ital' ${getValue(distance, 0, 1)};
        color: rgb(${greyScale}, ${greyScale}, ${greyScale});
      `;
    });

    requestAnimationFrame(update);
  };

  init();
};

setupVariableText(".bubble-text");
