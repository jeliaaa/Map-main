import { useRef, useState, useCallback, useEffect } from "react";
import { useMotionValue, animate, motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import MapImage from '../assets/map.png'
import MapFull from '../assets/mapFull.png'
import PinImage from '../assets/pin2.png'
import { info } from '../data.json'
import useProjectModal from "../hooks/useProjectModal";

function Map() {
  const MAP_WIDTH = 3000;
  const MAP_HEIGHT = 2000;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 15;
  const { onOpen: openInfoModal } = useProjectModal()
  const containerRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(MIN_SCALE);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayValues, setDisplayValues] = useState({ x: 0, y: 0, scale: MIN_SCALE });


  useEffect(() => {
    const unsubscribeX = x.on("change", (latest) => {
      setDisplayValues(prev => ({ ...prev, x: latest }));
    });
    const unsubscribeY = y.on("change", (latest) => {
      setDisplayValues(prev => ({ ...prev, y: latest }));
    });
    const unsubscribeScale = scale.on("change", (latest) => {
      setDisplayValues(prev => ({ ...prev, scale: latest }));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeScale();
    };
  }, [x, y, scale]);

  const getContainerSize = useCallback(() => {
    if (!containerRef.current) return { width: window.innerWidth, height: window.innerHeight };
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);


  const constrainPosition = useCallback((newX, newY, newScale) => {
    const { width, height } = getContainerSize();
    const scaledWidth = MAP_WIDTH * newScale;
    const scaledHeight = MAP_HEIGHT * newScale;

    let constrainedX = newX;
    let constrainedY = newY;

    if (scaledWidth <= width) {
      constrainedX = (width - scaledWidth) / 2;
    } else {
      constrainedX = Math.min(0, Math.max(width - scaledWidth, newX));
    }

    if (scaledHeight <= height) {
      constrainedY = (height - scaledHeight) / 2;
    } else {
      constrainedY = Math.min(0, Math.max(height - scaledHeight, newY));
    }

    const constrainedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

    return { x: constrainedX, y: constrainedY, scale: constrainedScale };
  }, [getContainerSize]);

  const animateTo = useCallback((newX, newY, newScale, duration = 0.3) => {
    const constrained = constrainPosition(newX, newY, newScale);

    animate(x, constrained.x, { duration, ease: "easeOut" });
    animate(y, constrained.y, { duration, ease: "easeOut" });
    animate(scale, constrained.scale, { duration, ease: "easeOut" });
  }, [x, y, scale, constrainPosition]);

  const setPosition = useCallback((newX, newY, newScale) => {
    const constrained = constrainPosition(newX, newY, newScale);
    x.set(constrained.x);
    y.set(constrained.y);
    scale.set(constrained.scale);
  }, [x, y, scale, constrainPosition]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - x.get(), y: e.clientY - y.get() });
  }, [x, y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition(newX, newY, scale.get());
  }, [isDragging, dragStart, scale, setPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const currentX = x.get();
    const currentY = y.get();
    const currentScale = scale.get();

    const zoomFactor = e.deltaY > 0 ? 0.85 : 1.18;
    const newScale = currentScale * zoomFactor;

    if (newScale > MAX_SCALE) return;

    const newX = mouseX - (mouseX - currentX) * zoomFactor;
    const newY = mouseY - (mouseY - currentY) * zoomFactor;

    animateTo(newX, newY, newScale, 0.15);
  }, [x, y, scale, animateTo]);

  const lastTouchRef = useRef({ distance: 0, center: { x: 0, y: 0 }, touches: 0 });

  const getTouchInfo = useCallback((touches) => {
    if (touches.length === 1) {
      return {
        center: { x: touches[0].clientX, y: touches[0].clientY },
        distance: 0,
        touches: 1
      };
    }

    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const center = {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };

    return { center, distance, touches: touches.length };
  }, []);

  const handleTouchStart = useCallback((e) => {
    const touchInfo = getTouchInfo(e.touches);

    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: touchInfo.center.x - x.get(), y: touchInfo.center.y - y.get() });
    } else if (e.touches.length === 2) {
      setIsDragging(false);

      if (e.cancelable) {
        e.preventDefault();
      }
    }

    lastTouchRef.current = touchInfo;
  }, [x, y, getTouchInfo]);

  const handleTouchMove = useCallback((e) => {
    const touchInfo = getTouchInfo(e.touches);

    if (e.touches.length === 1 && isDragging) {

      if (e.cancelable) {
        e.preventDefault();
      }
      const newX = touchInfo.center.x - dragStart.x;
      const newY = touchInfo.center.y - dragStart.y;
      setPosition(newX, newY, scale.get());
    } else if (e.touches.length === 2 && lastTouchRef.current.distance > 0) {
      if (e.cancelable) e.preventDefault();
      const scaleFactor = touchInfo.distance / lastTouchRef.current.distance;
      const newScale = scale.get() * scaleFactor;

      if (newScale > MAX_SCALE) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = touchInfo.center.x - rect.left;
        const centerY = touchInfo.center.y - rect.top;

        const currentX = x.get();
        const currentY = y.get();

        const newX = centerX - (centerX - currentX) * scaleFactor;
        const newY = centerY - (centerY - currentY) * scaleFactor;

        setPosition(newX, newY, newScale);
      }
    }

    lastTouchRef.current = touchInfo;
  }, [isDragging, dragStart, scale, x, y, setPosition, getTouchInfo]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      const touchInfo = getTouchInfo(e.touches);
      setIsDragging(true);
      setDragStart({ x: touchInfo.center.x - x.get(), y: touchInfo.center.y - y.get() });
      lastTouchRef.current = touchInfo;
    }
  }, [x, y, getTouchInfo]);

  const zoomIn = useCallback(() => {
    const { width, height } = getContainerSize();
    const centerX = width / 2;
    const centerY = height / 2;
    const zoomFactor = 1.4;

    const currentX = x.get();
    const currentY = y.get();
    const currentScale = scale.get();

    const newScale = currentScale * zoomFactor;

    if (newScale > MAX_SCALE) return;

    const newX = centerX - (centerX - currentX) * zoomFactor;
    const newY = centerY - (centerY - currentY) * zoomFactor;

    animateTo(newX, newY, newScale, 0.4);
  }, [x, y, scale, animateTo, getContainerSize]);

  const zoomOut = useCallback(() => {
    const { width, height } = getContainerSize();
    const centerX = width / 2;
    const centerY = height / 2;
    const zoomFactor = 0.7;

    const currentX = x.get();
    const currentY = y.get();
    const currentScale = scale.get();

    const newScale = currentScale * zoomFactor;
    const newX = centerX - (centerX - currentX) * zoomFactor;
    const newY = centerY - (centerY - currentY) * zoomFactor;

    animateTo(newX, newY, newScale, 0.4);
  }, [x, y, scale, animateTo, getContainerSize]);

  const resetView = useCallback(() => {
    animateTo(0, 0, 1, 0.6);
  }, [animateTo]);

  const fitToScreen = useCallback(() => {
    const { width, height } = getContainerSize();
    const scaleX = width / MAP_WIDTH;
    const scaleY = height / MAP_HEIGHT;
    const newScale = Math.min(scaleX, scaleY, MAX_SCALE);

    const newX = (width - MAP_WIDTH * newScale) / 2;
    const newY = (height - MAP_HEIGHT * newScale) / 2;

    animateTo(newX, newY, newScale, 0.8);
  }, [animateTo, getContainerSize]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;


    const wheelHandler = (e) => handleWheel(e);
    container.addEventListener('wheel', wheelHandler, { passive: false });


    const touchStartHandler = (e) => handleTouchStart(e);
    const touchMoveHandler = (e) => handleTouchMove(e);
    const touchEndHandler = (e) => handleTouchEnd(e);

    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetView();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          fitToScreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetView, fitToScreen]);

  useEffect(() => {
    const handleResize = () => {
      const currentX = x.get();
      const currentY = y.get();
      const currentScale = scale.get();
      animateTo(currentX, currentY, currentScale, 0.2);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x, y, scale, animateTo]);

  const handleDoubleClick = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const currentX = x.get();
    const currentY = y.get();
    const currentScale = scale.get();

    const zoomFactor = 2;
    const newScale = currentScale * zoomFactor;

    if (newScale > MAX_SCALE) return;

    const newX = mouseX - (mouseX - currentX) * zoomFactor;
    const newY = mouseY - (mouseY - currentY) * zoomFactor;



    animateTo(newX, newY, newScale, 0.3);
  }, [x, y, scale, animateTo]);

  useEffect(() => {
    const isSmallDevice = window.innerWidth <= 768;

    if (isSmallDevice) {
      // For smaller devices (e.g. mobile/tablet)
      setPosition(-340, -550, 0.7);
    } else {
      // For larger devices (e.g. desktops)
      setPosition(70, -920, 1);
    }
  }, [setPosition]);

  // Track all used x and y values
  const usedX = new Set();
  const usedY = new Set();

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden relative bg-gray-900 select-none"
      style={{
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onMouseLeave={handleMouseUp}

    >
      <motion.div
        className="absolute origin-top-left"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          backgroundImage: `url(${MapFull})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          x,
          y,
          scale,
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        drag={false}
      />



      {info.map(info =>
        info?.location?.map((pin, index) => {

          // ❗ If x OR y is already used, skip element
          if (usedX.has(pin.x) && usedY.has(pin.y)) {
            return null;
          }

          // Otherwise mark them as used
          usedX.add(pin.x);
          usedY.add(pin.y);

          const pinX = displayValues.x + pin.x * displayValues.scale;
          const pinY = displayValues.y + pin.y * displayValues.scale;

          return (
            <motion.div
              key={index}
              className="absolute z-10 pointer-events-auto transform -translate-x-1/2 -translate-y-full"
              style={{ left: pinX, top: pinY }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="group flex gap-1 items-center hover:bg-opacity-50 px-2 py-1 rounded text-white text-xs font-medium cursor-pointer"
                onClick={() => openInfoModal(info)}
                title={pin.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img className="w-9" src={PinImage} alt="📍" />
              </motion.div>
            </motion.div>
          );
        })
      )}

      {/* {pins.map((pin, index) => {

      })} */}

      <motion.div
        className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-2 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={zoomIn}
          className="p-3 text-white hover:bg-white/20 rounded transition-colors touch-manipulation"
          title="Zoom In (+)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <ZoomIn size={20} />
        </motion.button>
        <motion.button
          onClick={zoomOut}
          className="p-3 text-white hover:bg-white/20 rounded transition-colors touch-manipulation"
          title="Zoom Out (-)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <ZoomOut size={20} />
        </motion.button>
        <motion.button
          onClick={resetView}
          className="p-3 text-white hover:bg-white/20 rounded transition-colors touch-manipulation"
          title="Reset (0)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <RotateCcw size={20} />
        </motion.button>
        <motion.button
          onClick={fitToScreen}
          className="p-3 text-white hover:bg-white/20 rounded transition-colors touch-manipulation"
          title="Fit to Screen (F)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <Maximize2 size={20} />
        </motion.button>
      </motion.div>

      <motion.div
        className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-mono z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Zoom: {Math.round(displayValues.scale * 100)}% |
        X: {Math.round(displayValues.x)} |
        Y: {Math.round(displayValues.y)}
      </motion.div>

      <motion.div
        className="fixed top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="font-semibold mb-1">Controls:</div>
        <div>Drag to pan • Pinch/scroll to zoom</div>
        <div>+/- zoom • 0 reset • F fit screen</div>
      </motion.div>
    </div>
  );
}

export default Map;