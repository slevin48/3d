import { useState, useRef, useCallback, useEffect } from 'react';
import './MobileControls.css';

export default function MobileControls({ onJoystickMove, onCameraRotate }) {
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef(null);
  const joystickBaseRef = useRef(null);
  const cameraZoneRef = useRef(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateJoystick = useCallback((touchX, touchY, centerX, centerY) => {
    const maxRadius = 40;
    let deltaX = touchX - centerX;
    let deltaY = touchY - centerY;

    // Limit to circle
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius;
      deltaY = (deltaY / distance) * maxRadius;
    }

    setJoystickPos({ x: deltaX, y: deltaY });

    // Normalize to -1 to 1
    const normalizedX = deltaX / maxRadius;
    const normalizedY = -deltaY / maxRadius; // Invert Y for game coords
    onJoystickMove?.({ x: normalizedX, y: normalizedY });
  }, [onJoystickMove]);

  // Joystick handlers
  const handleJoystickStart = useCallback((e) => {
    e.preventDefault();
    setJoystickActive(true);
    const touch = e.touches ? e.touches[0] : e;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    updateJoystick(touch.clientX, touch.clientY, centerX, centerY);
  }, [updateJoystick]);

  const handleJoystickMove = useCallback(
    (e) => {
      if (!joystickActive) return;
      e.preventDefault();
      const touch = e.touches ? e.touches[0] : e;
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      updateJoystick(touch.clientX, touch.clientY, centerX, centerY);
    },
    [joystickActive, updateJoystick]
  );

  const handleJoystickEnd = useCallback(() => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    onJoystickMove?.({ x: 0, y: 0 });
  }, [onJoystickMove]);

  // Camera rotation handlers
  const handleCameraStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleCameraMove = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches ? e.touches[0] : e;
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      onCameraRotate?.({ x: deltaX, y: deltaY });
    },
    [onCameraRotate]
  );

  const handleCameraEnd = useCallback(() => {
    onCameraRotate?.({ x: 0, y: 0 });
  }, [onCameraRotate]);

  if (!isMobile) return null;

  return (
    <div className="mobile-controls">
      {/* Left side - Joystick */}
      <div
        className="joystick-zone"
        ref={joystickBaseRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onMouseDown={handleJoystickStart}
        onMouseMove={handleJoystickMove}
        onMouseUp={handleJoystickEnd}
        onMouseLeave={handleJoystickEnd}
      >
        <div className="joystick-base">
          <div
            className={`joystick-stick ${joystickActive ? 'active' : ''}`}
            ref={joystickRef}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
            }}
          />
        </div>
        <span className="joystick-label">MOVE</span>
      </div>

      {/* Right side - Camera rotation zone */}
      <div
        className="camera-zone"
        ref={cameraZoneRef}
        onTouchStart={handleCameraStart}
        onTouchMove={handleCameraMove}
        onTouchEnd={handleCameraEnd}
      >
        <span className="camera-label">LOOK</span>
      </div>

      {/* Controls hint */}
      <div className="mobile-hint">
        <span>Left: Move</span>
        <span>Right: Look around</span>
      </div>
    </div>
  );
}
