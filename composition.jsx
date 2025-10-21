import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo, useRef, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Audio, Img, spring, useVideoConfig, Sequence } from "remotion";
import { ThreeCanvas, useThree } from "@remotion/three";
import * as THREE from "three";
const Starfield = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const starPointsRef = useRef(null);
  const { starVertices, starVelocities, starSizes } = useMemo(() => {
    const starCount = 8e3;
    const starVertices2 = [];
    const starVelocities2 = [];
    const starSizes2 = [];
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 2e3;
      const y = (Math.random() - 0.5) * 2e3;
      const z = Math.random() * -2e3;
      starVertices2.push(x, y, z);
      starVelocities2.push(0, 0, 0.5 + Math.random() * 1);
      starSizes2.push(1 + Math.random() * 2);
    }
    return { starVertices: starVertices2, starVelocities: starVelocities2, starSizes: starSizes2 };
  }, []);
  useEffect(() => {
    if (starPointsRef.current) {
      const positions = starPointsRef.current.geometry.attributes.position.array;
      const travelDistance = 2e3 + camera.position.z;
      for (let i = 0; i < positions.length; i += 3) {
        const initialZ = starVertices[i + 2];
        const velocityZ = starVelocities[i + 2];
        const zOffset = velocityZ * frame;
        positions[i + 2] = (initialZ + zOffset + 2e3) % travelDistance - 2e3;
      }
      starPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return /* @__PURE__ */ jsxDEV("points", { ref: starPointsRef, children: [
    /* @__PURE__ */ jsxDEV("bufferGeometry", { children: [
      /* @__PURE__ */ jsxDEV(
        "float32BufferAttribute",
        {
          attach: "attributes-position",
          count: starVertices.length / 3,
          array: new Float32Array(starVertices),
          itemSize: 3
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 47,
          columnNumber: 17
        }
      ),
      /* @__PURE__ */ jsxDEV(
        "float32BufferAttribute",
        {
          attach: "attributes-size",
          count: starSizes.length,
          array: new Float32Array(starSizes),
          itemSize: 1
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 53,
          columnNumber: 17
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(
      "shaderMaterial",
      {
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexShader: `
                    attribute float size;
                    varying float vAlpha;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                        vAlpha = 1.0 - (abs(position.z) / 1000.0);
                    }
                `,
        fragmentShader: `
                    uniform vec3 color;
                    varying float vAlpha;
                    void main() {
                        float r = 0.0, delta = 0.0, alpha = 1.0;
                        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                        r = dot(cxy, cxy);
                        if (r > 1.0) {
                            discard;
                        }
                        gl_FragColor = vec4(color, vAlpha * (1.0 - r));
                    }
                `,
        uniforms: { color: { value: new THREE.Color(16777215) } }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 60,
        columnNumber: 13
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 45,
    columnNumber: 9
  });
};
const StarfieldBackground = () => {
  return /* @__PURE__ */ jsxDEV(
    ThreeCanvas,
    {
      linear: true,
      gl: {
        antialias: true
      },
      camera: {
        fov: 60,
        position: [0, 0, 1],
        near: 1,
        far: 1e3
      },
      style: { backgroundColor: "#1a1a2e" },
      children: /* @__PURE__ */ jsxDEV(Starfield, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 108,
        columnNumber: 13
      })
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 95,
      columnNumber: 9
    }
  );
};
const Visualizer = ({ pulseAmount, targetColor, radius, lineWidth }) => {
  if (!pulseAmount || pulseAmount <= 0.1) {
    return null;
  }
  const outerRadius = radius + lineWidth / 2;
  const innerRadius = radius - lineWidth / 2;
  const maxOuterPulse = lineWidth * 0.8;
  const pulseOuterRadius = outerRadius + pulseAmount * maxOuterPulse;
  const maxInnerPulse = innerRadius * 0.7;
  const pulseInnerRadius = innerRadius - pulseAmount * maxInnerPulse;
  const pulseColorRgba = targetColor.replace("hsl", "hsla").replace(")", `, ${pulseAmount * 0.3})`);
  const outerGradientId = `outerPulseGradient-${Math.random()}`;
  const innerGradientId = `innerPulseGradient-${Math.random()}`;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("defs", { children: [
      /* @__PURE__ */ jsxDEV("radialGradient", { id: outerGradientId, cx: "0", cy: "0", r: pulseOuterRadius, gradientUnits: "userSpaceOnUse", children: [
        /* @__PURE__ */ jsxDEV("stop", { offset: 0, stopColor: "rgba(0,0,0,0)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 136,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("stop", { offset: `${outerRadius / pulseOuterRadius * 0.8}`, stopColor: "rgba(0,0,0,0)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 137,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("stop", { offset: `${outerRadius / pulseOuterRadius * 0.95}`, stopColor: pulseColorRgba }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 138,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("stop", { offset: "1", stopColor: "rgba(0,0,0,0)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 139,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 135,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("radialGradient", { id: innerGradientId, cx: "0", cy: "0", r: innerRadius, gradientUnits: "userSpaceOnUse", children: [
        /* @__PURE__ */ jsxDEV("stop", { offset: 0, stopColor: "rgba(0,0,0,0)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 142,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("stop", { offset: `${pulseInnerRadius / innerRadius}`, stopColor: "rgba(0,0,0,0)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("stop", { offset: `${pulseInnerRadius / innerRadius * 1.25}`, stopColor: pulseColorRgba }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 144,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("stop", { offset: "1", stopColor: "rgba(0,0,0,0)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 145,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 141,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 134,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("rect", { x: "-55", y: "-55", width: "110", height: "110", fill: `url(#${outerGradientId})` }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 148,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("rect", { x: "-55", y: "-55", width: "110", height: "110", fill: `url(#${innerGradientId})` }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 149,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 133,
    columnNumber: 9
  });
};
const GameCanvas = ({ frameData, config }) => {
  const { angle, targetStartAngle, targetSize, success, fail, targetColor, pulseAmount } = frameData;
  const { difficulty, difficulties, colors } = config;
  const { trackWidthFactor } = difficulties[difficulty];
  const radius = 45;
  const lineWidth = radius * 2 * trackWidthFactor;
  return /* @__PURE__ */ jsxDEV("svg", { viewBox: "-55 -55 110 110", style: { width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsxDEV(Visualizer, { pulseAmount, targetColor, radius, lineWidth }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 164,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(
      "circle",
      {
        cx: "0",
        cy: "0",
        r: radius,
        fill: "none",
        stroke: colors.secondary,
        strokeWidth: lineWidth,
        strokeLinecap: "butt"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 166,
        columnNumber: 13
      }
    ),
    targetSize > 0 && /* @__PURE__ */ jsxDEV(
      "path",
      {
        d: `M ${radius * Math.cos(targetStartAngle)} ${radius * Math.sin(targetStartAngle)} A ${radius} ${radius} 0 0 1 ${radius * Math.cos(targetStartAngle + targetSize)} ${radius * Math.sin(targetStartAngle + targetSize)}`,
        fill: "none",
        stroke: targetColor || colors.success,
        strokeWidth: lineWidth * 0.95,
        strokeLinecap: "round"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 175,
        columnNumber: 17
      }
    ),
    /* @__PURE__ */ jsxDEV("g", { transform: `rotate(${angle * 180 / Math.PI + 90})`, children: /* @__PURE__ */ jsxDEV(
      "line",
      {
        x1: "0",
        y1: -(radius - lineWidth / 2),
        x2: "0",
        y2: -(radius + lineWidth / 2),
        stroke: colors.fail,
        strokeWidth: lineWidth / 2.5,
        strokeLinecap: "butt"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 185,
        columnNumber: 17
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 184,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 163,
    columnNumber: 9
  });
};
const LevelDisplay = ({ level, isVisible }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = isVisible ? spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 150
    }
  }) : 0;
  const opacity = isVisible ? interpolate(frame, [0, 15], [0, 0.5]) : 0;
  return /* @__PURE__ */ jsxDEV("div", { style: {
    position: "absolute",
    fontSize: "8rem",
    fontWeight: "bold",
    color: "rgba(220, 220, 220, 0.5)",
    textShadow: "0 0 10px rgba(0,0,0,0.5)",
    opacity,
    transform: `scale(${scale})`,
    zIndex: 1
  }, children: level }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 213,
    columnNumber: 9
  });
};
const Avatar = ({ user, prefetchedAvatarUrl }) => {
  if (!prefetchedAvatarUrl) {
    return /* @__PURE__ */ jsxDEV("div", { style: { width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#4a4a6a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold" }, children: user ? user.username.charAt(0).toUpperCase() : "?" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 231,
      columnNumber: 13
    });
  }
  return /* @__PURE__ */ jsxDEV(
    Img,
    {
      src: prefetchedAvatarUrl,
      style: { width: "50px", height: "50px", borderRadius: "50%" }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 238,
      columnNumber: 9
    }
  );
};
const EndScreenOverlay = ({ score, level, user, isGameOver, prefetchedAvatarUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleIn = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 150
    }
  });
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  const finalScoreText = `Final Score: ${score}`;
  const finalLevelText = `Level: ${level}`;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { padding: "20px", fontFamily: "Arial, sans-serif", color: "white", opacity }, children: [
    user && /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", top: "20px", left: "20px", display: "flex", alignItems: "center", gap: "10px", transform: `scale(${scaleIn})` }, children: [
      /* @__PURE__ */ jsxDEV(Avatar, { user, prefetchedAvatarUrl }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 268,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "24px", fontWeight: "bold", textShadow: "2px 2px 4px #000" }, children: user.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 269,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 267,
      columnNumber: 18
    }),
    /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", top: "30px", right: "20px", fontSize: "24px", fontWeight: "bold", textShadow: "2px 2px 4px #000", transform: `scale(${scaleIn})`, textAlign: "right" }, children: [
      /* @__PURE__ */ jsxDEV("div", { children: finalScoreText }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 276,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { children: finalLevelText }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 277,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 275,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 264,
    columnNumber: 9
  });
};
const ReplayComposition = ({ replayData, prefetchedAvatarUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (!replayData || !replayData.frames || replayData.frames.length < 2) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#1a1a2e", color: "white", justifyContent: "center", alignItems: "center" }, children: "Loading replay..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 288,
      columnNumber: 16
    });
  }
  const { frames, config } = replayData;
  const { currentUser } = config;
  const startTime = frames[0].timestamp;
  const gameEndTime = frames[frames.length - 1].timestamp;
  const gameEndFrame = Math.ceil((gameEndTime - startTime) / 1e3 * 30);
  const currentTimestamp = startTime + frame / 30 * 1e3;
  let frameIndex;
  if (frame < gameEndFrame) {
    frameIndex = frames.findIndex((f) => f.timestamp >= currentTimestamp);
    if (frameIndex === -1) frameIndex = frames.length - 1;
  } else {
    frameIndex = frames.length - 1;
  }
  const currentFrameData = frames[frameIndex];
  const score = currentFrameData.score;
  const level = currentFrameData.level || 1;
  const isGameOver = frameIndex === frames.length - 1 && !currentFrameData.success;
  const showEndScreen = frame >= gameEndFrame;
  const isDuringEndScreen = frame >= gameEndFrame && frame < gameEndFrame + 90;
  const successFrames = frames.filter((f) => f.success);
  const MAX_VOLUME = 0.3;
  const FADE_DURATION_FRAMES = 15 * fps;
  let musicVolume;
  if (durationInFrames <= 2 * FADE_DURATION_FRAMES) {
    const midPoint = durationInFrames / 2;
    musicVolume = interpolate(
      frame,
      [0, midPoint, durationInFrames],
      [0, MAX_VOLUME, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else {
    musicVolume = interpolate(
      frame,
      [0, FADE_DURATION_FRAMES, durationInFrames - FADE_DURATION_FRAMES, durationInFrames],
      [0, MAX_VOLUME, MAX_VOLUME, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: [
    /* @__PURE__ */ jsxDEV(StarfieldBackground, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 346,
      columnNumber: 13
    }),
    !showEndScreen && /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { top: "5vh", justifyContent: "flex-start", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "clamp(1.5rem, 5vw, 2.5rem)", fontWeight: "bold", color: config.colors.fail.trim(), fontFamily: "Arial, sans-serif" }, children: [
      "Score: ",
      score
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 350,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 349,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxDEV(LevelDisplay, { level, isVisible: !showEndScreen || isDuringEndScreen }, `level-${level}`, false, {
        fileName: "<stdin>",
        lineNumber: 358,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { style: { width: "90%", height: "auto", aspectRatio: "1 / 1" }, children: /* @__PURE__ */ jsxDEV(GameCanvas, { frameData: currentFrameData, config }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 360,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 359,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 357,
      columnNumber: 13
    }),
    showEndScreen && /* @__PURE__ */ jsxDEV(EndScreenOverlay, { score, level, user: currentUser, isGameOver, prefetchedAvatarUrl }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 365,
      columnNumber: 32
    }),
    /* @__PURE__ */ jsxDEV(Audio, { src: "/Infinite Orbit - Track 1 (Extended 2) - Sonauto.ogg", volume: musicVolume, loop: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 368,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Audio, { src: "/start_sound.mp3", volume: 0.5 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 369,
      columnNumber: 13
    }),
    successFrames.map((f, i) => {
      const frameForAudio = Math.round((f.timestamp - startTime) / 1e3 * 30);
      if (frameForAudio < gameEndFrame) {
        return /* @__PURE__ */ jsxDEV(Sequence, { from: frameForAudio, children: /* @__PURE__ */ jsxDEV(Audio, { src: "/success.mp3" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 377,
          columnNumber: 25
        }) }, `success-${i}`, false, {
          fileName: "<stdin>",
          lineNumber: 376,
          columnNumber: 22
        });
      }
      return null;
    }),
    isGameOver && /* @__PURE__ */ jsxDEV(Sequence, { from: gameEndFrame - 1, children: /* @__PURE__ */ jsxDEV(Audio, { src: "/fail.mp3" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 386,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 385,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 345,
    columnNumber: 9
  });
};
export {
  ReplayComposition
};
