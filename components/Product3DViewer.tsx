'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useTexture, PerspectiveCamera, shaderMaterial, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { CustomizationState } from '@/lib/ai-action';

// 1. Define the Shader Material declaratively
const ColorShiftMaterial = shaderMaterial(
    {
        uTexture: new THREE.Texture(),
        uBaseColor: new THREE.Color('#ffffff'),
        uTargetColor: new THREE.Color('#ffffff'),
        uThreshold: 0.25, // Stricter threshold to avoid background bleeding
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform sampler2D uTexture;
    uniform vec3 uBaseColor;
    uniform vec3 uTargetColor;
    uniform float uThreshold;
    varying vec2 vUv;

    // Helper: RGB to HSV
    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Convert current pixel and base color to HSV
      vec3 fragHSV = rgb2hsv(texColor.rgb);
      vec3 baseHSV = rgb2hsv(uBaseColor);
      
      // Difference in Hue (Handle wrap-around logic 0.9 vs 0.1 should be close)
      float hueDiff = abs(fragHSV.x - baseHSV.x);
      if (hueDiff > 0.5) hueDiff = 1.0 - hueDiff;
      
      // Difference in Saturation & Value
      float satDiff = abs(fragHSV.y - baseHSV.y);
      float valDiff = abs(fragHSV.z - baseHSV.z);
      
      // MASKING LOGIC (White Background Removal)
      // Since we have clean Mannequin images on White Backgrounds,
      // we don't need color difference checks. We just check if the pixel is NOT white.
      
      // Calculate brightness
      float brightness = (texColor.r + texColor.g + texColor.b) / 3.0;
      
      // If brightness is very high (> 0.95) and saturation is very low, it's the background.
      vec3 hsv = rgb2hsv(texColor.rgb);
      
      // Background Logic:
      // 1. Brightness > 0.9 (White wall)
      // 2. Saturation < 0.1 (No color)
      float isBackground = step(0.9, brightness) * step(hsv.y, 0.15);
      
      // Mask is inverse of background. 
      // 1.0 = Object (Paint it)
      // 0.0 = Background (Don't paint)
      float mask = 1.0 - isBackground;
      
      // Smooth edges slightly
      mask = smoothstep(0.0, 0.1, mask);
      
      // ARTIFACT CLEANUP (Spatial Masking)
      // We want to make these areas TRANSPARENT, not just unmasked.
      float uvBorder = 
          step(0.05, vUv.x) * step(vUv.x, 0.95) *  // Side borders
          step(0.12, vUv.y) * step(vUv.y, 0.98);   // Bottom trim (0.12) & Top trim
          
      // COLORING LOGIC (Hybrid: Multiply vs Luminance Match)
      
      float texLum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      float baseLum = dot(uBaseColor, vec3(0.299, 0.587, 0.114));
      
      vec3 finalTarget;
      
      // Check if the original item is White/Light (e.g. White Dress, White Shirt)
      if (baseLum > 0.9) {
          // MODE A: MULTIPLY (Dyeing White Fabric)
          // Standard multiply is too dark (Blue * Gray = Dark Navy).
          // We apply Gamma Correction to the texture luminance to brighten it first.
          
          float dyeLum = pow(texLum, 0.6); // < 1.0 makes shadows lighter
          
          finalTarget = uTargetColor * dyeLum;
          
          // Slight vibrancy boost (1.1x) to counter texture grayness
          finalTarget *= 1.1;
      } else {
          // MODE B: LUMINANCE MATCHING (Recoloring Dark/Color Fabric)
          // When coloring a dark/purple dress White, multiply doesn't work (White * Purple = Purple).
          // We need to match the luminance intensity ratio.
          
          float targetLum = dot(uTargetColor, vec3(0.299, 0.587, 0.114));
          float normLum = max(targetLum, 0.05); 
          float intensity = texLum / normLum;
          finalTarget = uTargetColor * intensity;
      }

      // Mix based on Mask (Object vs Background)
      vec3 finalColor = mix(texColor.rgb, finalTarget, mask);
      
      // 5. Apply Vignette to Alpha
      // If it's a border area, Alpha = 0.
      // Also apply original texture alpha.
      float finalAlpha = texColor.a * uvBorder;
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
);

// 2. Extend Fiber to include the new material
extend({ ColorShiftMaterial });

// Add type definition for the new material
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            colorShiftMaterial: any;
        }
    }
}

function ProductPlane({ image, customization, baseColor }: { image: string, customization: CustomizationState, baseColor: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = useTexture(image);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
        // Update uniforms
        if (materialRef.current) {
            const target = customization.color && customization.color !== '#ffffff'
                ? customization.color
                : baseColor;

            materialRef.current.uniforms.uBaseColor.value.set(baseColor);
            materialRef.current.uniforms.uTargetColor.value.set(target);
            materialRef.current.uniforms.uTexture.value = texture;
        }
    });

    const args: [number, number] = [3, 4];

    return (
        <mesh ref={meshRef} castShadow receiveShadow position={[0, 0.5, 0]}>
            <planeGeometry args={args} />
            {/* Declarative Shader Material */}
            {/* @ts-expect-error: Custom shader material not in types */}
            <colorShiftMaterial
                ref={materialRef}
                transparent
                uTexture={texture}
                uBaseColor={new THREE.Color(baseColor)}
                uTargetColor={new THREE.Color(baseColor)}
                uThreshold={0.25} // Explicitly set stricer threshold
            />
        </mesh>
    );
}

export default function Product3DViewer({ customization, image, baseColor = '#ffffff' }: { customization: CustomizationState, image?: string, baseColor?: string }) {
    return (
        <div className="w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-gray-200">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    minDistance={4}
                    maxDistance={8}
                    maxPolarAngle={Math.PI / 2 + 0.2}
                    minPolarAngle={Math.PI / 3}
                />

                <ambientLight intensity={1} />
                <Environment preset="studio" />

                {image ? (
                    <React.Suspense fallback={null}>
                        {/* Fallback is null to avoid ugly boxes. The image will pop in. */}
                        <ProductPlane image={image} customization={customization} baseColor={baseColor} />
                    </React.Suspense>
                ) : (
                    <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[3, 4]} />
                        <meshBasicMaterial color="#f0f0f0" wireframe />
                    </mesh>
                )}

                <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </Canvas>

            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs font-mono text-gray-800">
                <p>Base: {baseColor} | Threshold: 0.25</p>
                <p>Target: {customization.color}</p>
            </div>
            {/* Built-in accessible loader */}
            <Loader containerStyles={{ background: 'transparent' }} innerStyles={{ background: 'rgba(0,0,0,0.8)', width: 200 }} barStyles={{ background: 'white' }} dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`} />
        </div>
    );
}
