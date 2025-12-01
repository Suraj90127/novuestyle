import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ProductCustomizer() {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const [tColor, setTColor] = useState("#ffffff");
  const [logoFile, setLogoFile] = useState(null);
  const [logoImg, setLogoImg] = useState(null);
  const [logoColor, setLogoColor] = useState("#ffffff");
  const [pos, setPos] = useState({ x: 0.5, y: 0.4 });
  const [scale, setScale] = useState(0.4);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 900 });
  const [showWarning, setShowWarning] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeTab, setActiveTab] = useState("logo");
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(24);
  const [textFont, setTextFont] = useState("Arial");
  const [shapes, setShapes] = useState([]);
  const [activeTool, setActiveTool] = useState("select");
  const [selectedElement, setSelectedElement] = useState(null);
  const [designHistory, setDesignHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const dragRef = useRef({ startX: 0, startY: 0, startPos: null });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const productName = searchParams.get("productName") || "Custom T-Shirt";
  const baseImageUrl =
    searchParams.get("baseImageUrl") ||
    "https://i.ibb.co/fY5L4XkV/Midnight-Plum-f042b4b5-196b-4e18-a451-3bf61ed700d7-removebg-preview.png";

  const [baseImg, setBaseImg] = useState(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setBaseImg(img);
    img.src = baseImageUrl;
  }, [baseImageUrl]);

  // Load logo with transparency check
  useEffect(() => {
    if (!logoFile) {
      setLogoImg(null);
      return;
    }

    // Check if file is PNG
    if (!logoFile.name.toLowerCase().endsWith(".png")) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Additional transparency check
      checkTransparency(img).then((isTransparent) => {
        if (!isTransparent) {
          setShowWarning(true);
        }
        setLogoImg(img);
      });
    };
    img.src = URL.createObjectURL(logoFile);

    return () => URL.revokeObjectURL(img.src);
  }, [logoFile]);

  // Check image transparency
  const checkTransparency = (img) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
          resolve(true); // Has transparency
        }
      }
      resolve(false); // No transparency
    });
  };

  // Save to history
  const saveToHistory = () => {
    const newHistory = designHistory.slice(0, historyIndex + 1);
    newHistory.push({
      tColor,
      logoImg: logoImg?.src,
      logoColor,
      pos: { ...pos },
      scale,
      rotation,
      opacity,
      texts: JSON.parse(JSON.stringify(texts)),
      shapes: JSON.parse(JSON.stringify(shapes)),
    });
    setDesignHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Redraw canvas
  useEffect(() => {
    drawCanvas();
  }, [
    tColor,
    logoImg,
    logoColor,
    baseImg,
    pos,
    scale,
    rotation,
    opacity,
    canvasSize,
    showGrid,
    texts,
    shapes,
    selectedElement,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const maxW = Math.min(900, window.innerWidth - 48);
      const w = Math.max(480, maxW);
      const h = Math.round((w / 800) * 900);
      setCanvasSize({ w, h });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { w, h } = canvasSize;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, w, h);

    // Draw base T-shirt image
    if (baseImg) {
      ctx.drawImage(baseImg, 0, 0, w, h);

      // Apply T-shirt color only to the shirt area using composite operations
      if (tColor && tColor !== "#ffffff") {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = tColor;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }

    // Draw shapes
    shapes.forEach((shape, index) => {
      ctx.save();
      ctx.globalAlpha = shape.opacity || 1;
      ctx.fillStyle = shape.color;

      if (shape.type === "rectangle") {
        ctx.fillRect(
          shape.x * w,
          shape.y * h,
          shape.width * w,
          shape.height * h
        );
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x * w, shape.y * h, shape.radius * w, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Selection highlight
      if (
        selectedElement?.type === "shape" &&
        selectedElement.index === index
      ) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        if (shape.type === "rectangle") {
          ctx.strokeRect(
            shape.x * w,
            shape.y * h,
            shape.width * w,
            shape.height * h
          );
        } else if (shape.type === "circle") {
          ctx.beginPath();
          ctx.arc(shape.x * w, shape.y * h, shape.radius * w, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
      ctx.restore();
    });

    // Draw texts
    texts.forEach((text, index) => {
      ctx.save();
      ctx.font = `${text.size}px ${text.font}`;
      ctx.fillStyle = text.color;
      ctx.globalAlpha = text.opacity || 1;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.content, text.x * w, text.y * h);

      // Selection highlight
      if (selectedElement?.type === "text" && selectedElement.index === index) {
        const metrics = ctx.measureText(text.content);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          text.x * w - metrics.width / 2 - 5,
          text.y * h - parseInt(text.size) / 2 - 5,
          metrics.width + 10,
          parseInt(text.size) + 10
        );
      }
      ctx.restore();
    });

    // Draw logo
    if (logoImg) {
      const logoW = w * scale;
      const logoH = logoImg.height * (logoW / logoImg.width);
      const cx = pos.x * w;
      const cy = pos.y * h;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.translate(-logoW / 2, -logoH / 2);

      const off = document.createElement("canvas");
      off.width = logoImg.width;
      off.height = logoImg.height;
      const offCtx = off.getContext("2d");
      offCtx.drawImage(logoImg, 0, 0);
      offCtx.globalCompositeOperation = "source-in";
      offCtx.fillStyle = logoColor;
      offCtx.fillRect(0, 0, off.width, off.height);

      ctx.drawImage(off, 0, 0, off.width, off.height, 0, 0, logoW, logoH);

      // Selection highlight
      if (selectedElement?.type === "logo") {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, logoW, logoH);
      }
      ctx.restore();
    }

    // Grid overlay
    if (showGrid) {
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
  };

  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasSize.w;
    const y = (e.clientY - rect.top) / canvasSize.h;

    if (activeTool === "select") {
      // Check if clicked on logo
      if (logoImg) {
        const logoW = scale;
        const logoH = logoImg.height * (scale / logoImg.width);
        const distance = Math.sqrt(
          Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
        );
        if (distance < Math.max(logoW, logoH) / 2) {
          setSelectedElement({ type: "logo" });
          setIsDragging(true);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPos: { ...pos },
          };
          return;
        }
      }

      // Check if clicked on text
      texts.forEach((text, index) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.font = `${text.size}px ${text.font}`;
        const metrics = ctx.measureText(text.content);
        const textWidth = metrics.width / canvasSize.w;
        const textHeight = parseInt(text.size) / canvasSize.h;

        if (
          Math.abs(x - text.x) < textWidth / 2 &&
          Math.abs(y - text.y) < textHeight / 2
        ) {
          setSelectedElement({ type: "text", index });
          setIsDragging(true);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPos: { x: text.x, y: text.y },
          };
          return;
        }
      });

      // Check if clicked on shape
      shapes.forEach((shape, index) => {
        let clicked = false;
        if (shape.type === "rectangle") {
          clicked =
            x >= shape.x &&
            x <= shape.x + shape.width &&
            y >= shape.y &&
            y <= shape.y + shape.height;
        } else if (shape.type === "circle") {
          const distance = Math.sqrt(
            Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2)
          );
          clicked = distance <= shape.radius;
        }

        if (clicked) {
          setSelectedElement({ type: "shape", index });
          setIsDragging(true);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPos: { x: shape.x, y: shape.y },
          };
          return;
        }
      });
    } else if (activeTool === "text" && currentText.trim()) {
      const newText = {
        content: currentText,
        x: x,
        y: y,
        color: textColor,
        size: textSize,
        font: textFont,
        opacity: 1,
      };
      setTexts([...texts, newText]);
      setCurrentText("");
      saveToHistory();
    } else if (activeTool === "rectangle") {
      const newShape = {
        type: "rectangle",
        x: x,
        y: y,
        width: 0.1,
        height: 0.1,
        color: "#ff0000",
        opacity: 0.7,
      };
      setShapes([...shapes, newShape]);
      setSelectedElement({ type: "shape", index: shapes.length });
      saveToHistory();
    } else if (activeTool === "circle") {
      const newShape = {
        type: "circle",
        x: x,
        y: y,
        radius: 0.05,
        color: "#ff0000",
        opacity: 0.7,
      };
      setShapes([...shapes, newShape]);
      setSelectedElement({ type: "shape", index: shapes.length });
      saveToHistory();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !selectedElement) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startX) / canvasSize.w;
    const dy = (e.clientY - dragRef.current.startY) / canvasSize.h;

    if (selectedElement.type === "logo") {
      setPos({
        x: Math.min(1, Math.max(0, dragRef.current.startPos.x + dx)),
        y: Math.min(1, Math.max(0, dragRef.current.startPos.y + dy)),
      });
    } else if (selectedElement.type === "text") {
      const newTexts = [...texts];
      newTexts[selectedElement.index] = {
        ...newTexts[selectedElement.index],
        x: Math.min(1, Math.max(0, dragRef.current.startPos.x + dx)),
        y: Math.min(1, Math.max(0, dragRef.current.startPos.y + dy)),
      };
      setTexts(newTexts);
    } else if (selectedElement.type === "shape") {
      const newShapes = [...shapes];
      newShapes[selectedElement.index] = {
        ...newShapes[selectedElement.index],
        x: Math.min(1, Math.max(0, dragRef.current.startPos.x + dx)),
        y: Math.min(1, Math.max(0, dragRef.current.startPos.y + dy)),
      };
      setShapes(newShapes);
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      saveToHistory();
    }
    setIsDragging(false);
  };

  const handleReset = () => {
    setTColor("#ffffff");
    setLogoFile(null);
    setLogoImg(null);
    setLogoColor("#ffffff");
    setScale(0.4);
    setRotation(0);
    setOpacity(1);
    setPos({ x: 0.5, y: 0.4 });
    setTexts([]);
    setShapes([]);
    setSelectedElement(null);
    setShowWarning(false);
    saveToHistory();
  };

  const addText = () => {
    if (currentText.trim()) {
      const newText = {
        content: currentText,
        x: 0.5,
        y: 0.5,
        color: textColor,
        size: textSize,
        font: textFont,
        opacity: 1,
      };
      setTexts([...texts, newText]);
      setCurrentText("");
      setSelectedElement({ type: "text", index: texts.length });
      saveToHistory();
    }
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;

    if (selectedElement.type === "text") {
      const newTexts = texts.filter(
        (_, index) => index !== selectedElement.index
      );
      setTexts(newTexts);
    } else if (selectedElement.type === "shape") {
      const newShapes = shapes.filter(
        (_, index) => index !== selectedElement.index
      );
      setShapes(newShapes);
    } else if (selectedElement.type === "logo") {
      setLogoFile(null);
      setLogoImg(null);
    }

    setSelectedElement(null);
    saveToHistory();
  };

  const exportDesign = async () => {
    const preview = previewRef.current;
    const { w, h } = canvasSize;
    preview.width = w;
    preview.height = h;
    const ctx = preview.getContext("2d");
    ctx.drawImage(canvasRef.current, 0, 0, w, h);
    return new Promise((resolve) => {
      preview.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const handleDownload = async () => {
    const blob = await exportDesign();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.replace(/\s+/g, "_")}_design.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {productName} Designer
        </h2>
        <p className="text-gray-600">
          Create your custom design with our easy-to-use tools
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Canvas Section */}
        <div className="lg:col-span-2">
          <div
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="relative border-2 border-gray-300 rounded-xl bg-white shadow-xl overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              style={{
                width: "100%",
                height: "auto",
                cursor: activeTool === "select" ? "grab" : "crosshair",
              }}
            />
            <canvas ref={previewRef} style={{ display: "none" }} />

            <div className="absolute top-4 left-4 flex gap-2">
              {logoImg && (
                <div className="text-sm text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                  🎯 Drag to move logo
                </div>
              )}
              {showGrid && (
                <div className="text-sm text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                  📐 Grid Enabled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Design Tools */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Design Tools</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => setActiveTool("select")}
                className={`p-2 rounded-lg border ${
                  activeTool === "select"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                title="Select and Move"
              >
                ✨
              </button>
              <button
                onClick={() => setActiveTool("text")}
                className={`p-2 rounded-lg border ${
                  activeTool === "text"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                title="Add Text"
              >
                Aa
              </button>
              <button
                onClick={() => setActiveTool("rectangle")}
                className={`p-2 rounded-lg border ${
                  activeTool === "rectangle"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                title="Add Rectangle"
              >
                ▭
              </button>
              <button
                onClick={() => setActiveTool("circle")}
                className={`p-2 rounded-lg border ${
                  activeTool === "circle"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                title="Add Circle"
              >
                ⭕
              </button>
            </div>

            {activeTool === "text" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Enter your text..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-8 rounded border"
                  />
                  <select
                    value={textFont}
                    onChange={(e) => setTextFont(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textSize}
                  onChange={(e) => setTextSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <button
                  onClick={addText}
                  disabled={!currentText.trim()}
                  className="w-full bg-green-500 text-white p-2 rounded-lg disabled:bg-gray-300"
                >
                  Add Text to Canvas
                </button>
              </div>
            )}
          </div>

          {/* Design Elements Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab("logo")}
                className={`flex-1 py-2 font-medium ${
                  activeTab === "logo"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Logo
              </button>
              <button
                onClick={() => setActiveTab("color")}
                className={`flex-1 py-2 font-medium ${
                  activeTab === "color"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Color
              </button>
              <button
                onClick={() => setActiveTab("elements")}
                className={`flex-1 py-2 font-medium ${
                  activeTab === "elements"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                Elements
              </button>
            </div>

            {activeTab === "logo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) =>
                        e.target.files && setLogoFile(e.target.files[0])
                      }
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="w-8 h-8 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">
                        Click to upload PNG logo
                      </span>
                    </label>
                  </div>
                  {showWarning && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-yellow-700 font-medium">
                          For best results, use transparent PNG files
                        </span>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">
                        Non-transparent images may not look good on colored
                        backgrounds
                      </p>
                    </div>
                  )}
                </div>

                {logoImg && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo Color
                      </label>
                      <input
                        type="color"
                        value={logoColor}
                        onChange={(e) => setLogoColor(e.target.value)}
                        className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size: {Math.round(scale * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rotation: {rotation}°
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rotation}
                        onChange={(e) =>
                          setRotation(parseFloat(e.target.value))
                        }
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opacity: {Math.round(opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "color" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    T-Shirt Color
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {[
                      "#ffffff",
                      "#000000",
                      "#ff0000",
                      "#00ff00",
                      "#0000ff",
                      "#ffff00",
                      "#ff00ff",
                      "#00ffff",
                      "#ffa500",
                      "#800080",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTColor(color)}
                        className={`w-8 h-8 rounded border-2 ${
                          tColor === color
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={tColor}
                    onChange={(e) => setTColor(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === "elements" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Text Elements
                  </h4>
                  {texts.map((text, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg mb-2 ${
                        selectedElement?.type === "text" &&
                        selectedElement.index === index
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="text-sm truncate">{text.content}</span>
                      <button
                        onClick={() =>
                          setSelectedElement({ type: "text", index })
                        }
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shapes</h4>
                  {shapes.map((shape, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg mb-2 ${
                        selectedElement?.type === "shape" &&
                        selectedElement.index === index
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="text-sm capitalize">{shape.type}</span>
                      <button
                        onClick={() =>
                          setSelectedElement({ type: "shape", index })
                        }
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  showGrid
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                <span>📐</span>
                <span className="text-sm">
                  {showGrid ? "Hide Grid" : "Show Grid"}
                </span>
              </button>

              {selectedElement && (
                <button
                  onClick={deleteSelectedElement}
                  className="flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg border border-red-500"
                >
                  <span>🗑️</span>
                  <span className="text-sm">Delete</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span>🔄</span>
                <span className="text-sm">Reset All</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>💾</span>
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use transparent PNG logos for best results</li>
              <li>• Click and drag to move elements around</li>
              <li>• Use the grid for precise alignment</li>
              <li>• Add multiple text elements and shapes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
