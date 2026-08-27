// app/components/websiteComp/homeComp/InteractiveTree.jsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveTree({ className = "" }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // =========================================================
        // SCENE
        // =========================================================

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
        camera.position.set(0, 1.7, 10);
        camera.lookAt(0, 1.55, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        mount.appendChild(renderer.domElement);

        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.style.cursor = "grab";
        renderer.domElement.style.touchAction = "none";

        // =========================================================
        // LIGHTING
        // =========================================================

        const hemi = new THREE.HemisphereLight(0xffffff, 0xd8d8d8, 1.5);
        scene.add(hemi);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
        keyLight.position.set(4, 7, 6);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
        fillLight.position.set(-4, 3, 2);
        scene.add(fillLight);

        // =========================================================
        // TREE GROUP
        // =========================================================

        const treeGroup = new THREE.Group();
        treeGroup.scale.setScalar(1.45);
        treeGroup.position.y = -0.95;
        scene.add(treeGroup);

        // =========================================================
        // MATERIALS
        // =========================================================

        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8a5a2b,
            roughness: 0.78,
            metalness: 0,
            flatShading: false,
        });

        const branchMaterial = new THREE.MeshStandardMaterial({
            color: 0x8a5a2b,
            roughness: 0.8,
            metalness: 0,
            flatShading: false,
        });

        const branchGroup = new THREE.Group();
        treeGroup.add(branchGroup);

        // =========================================================
        // CURVED BRANCH CREATOR
        // =========================================================

        function createCurvedBranch({
            points,
            radiusStart = 0.07,
            radiusEnd = 0.03,
            material = branchMaterial,
            radialSegments = 8,
        }) {
            const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
            const tubularSegments = Math.max(points.length * 10, 24);

            const geometry = new THREE.TubeGeometry(
                curve,
                tubularSegments,
                1,
                radialSegments,
                false
            );

            // Taper the tube from radiusStart -> radiusEnd along its length.
            const position = geometry.attributes.position;
            const vertex = new THREE.Vector3();
            const centerOnCurve = new THREE.Vector3();

            for (let i = 0; i <= tubularSegments; i++) {
                const t = i / tubularSegments;
                const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t);
                centerOnCurve.copy(curve.getPointAt(t));

                for (let j = 0; j <= radialSegments; j++) {
                    const idx = i * (radialSegments + 1) + j;
                    if (idx >= position.count) continue;

                    vertex.fromBufferAttribute(position, idx);
                    vertex.sub(centerOnCurve).normalize().multiplyScalar(radius).add(centerOnCurve);
                    position.setXYZ(idx, vertex.x, vertex.y, vertex.z);
                }
            }

            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh(geometry, material);
            branchGroup.add(mesh);
            return mesh;
        }

        // =========================================================
        // MAIN TRUNK
        // =========================================================

        const trunkPoints = [
            new THREE.Vector3(0, -1.55, 0),
            new THREE.Vector3(-0.03, -1.25, 0),
            new THREE.Vector3(0.04, -0.85, 0),
            new THREE.Vector3(0.02, -0.42, 0),
            new THREE.Vector3(-0.02, 0.0, 0),
            new THREE.Vector3(0.03, 0.3, 0),
        ];

        createCurvedBranch({
            points: trunkPoints,
            radiusStart: 0.15,
            radiusEnd: 0.1,
            material: trunkMaterial,
            radialSegments: 12,
        });

        // TRUNK BASE FLARE
        const baseGeometry = new THREE.CylinderGeometry(0.19, 0.27, 0.32, 12);
        const baseMesh = new THREE.Mesh(baseGeometry, trunkMaterial);
        baseMesh.position.set(0, -1.45, 0);
        baseMesh.scale.x = 1.15;
        baseMesh.scale.z = 0.75;
        treeGroup.add(baseMesh);

        // =========================================================
        // MAIN BRANCHES — exactly 3, thick, forking from the trunk.
        // Thin stalks (dandi) sprout from these afterwards, and each
        // stalk carries a single leaf at its tip.
        // =========================================================

        // 1. LEFT main branch
        const leftBranchCurve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(0.02, 0.05, 0),
                new THREE.Vector3(-0.3, 0.3, 0),
                new THREE.Vector3(-0.64, 0.52, 0.01),
                new THREE.Vector3(-0.92, 0.72, 0.02),
                new THREE.Vector3(-1.1, 0.88, 0.02),
            ],
            false,
            "catmullrom",
            0.5
        );

        createCurvedBranch({
            points: leftBranchCurve.points,
            radiusStart: 0.09,
            radiusEnd: 0.032,
            radialSegments: 10,
        });

        // 2. CENTER main branch (splits toward the top leaves)
        const centerBranchCurve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(0.0, 0.15, 0),
                new THREE.Vector3(0.02, 0.5, 0),
                new THREE.Vector3(-0.02, 0.9, 0),
                new THREE.Vector3(0.04, 1.28, 0),
                new THREE.Vector3(0.1, 1.55, 0),
            ],
            false,
            "catmullrom",
            0.5
        );

        createCurvedBranch({
            points: centerBranchCurve.points,
            radiusStart: 0.08,
            radiusEnd: 0.028,
            radialSegments: 10,
        });

        // 3. RIGHT main branch
        const rightBranchCurve = new THREE.CatmullRomCurve3(
            [
                new THREE.Vector3(0.02, 0.1, 0),
                new THREE.Vector3(0.34, 0.32, 0.01),
                new THREE.Vector3(0.7, 0.55, 0.02),
                new THREE.Vector3(1.0, 0.8, 0.03),
                new THREE.Vector3(1.18, 1.0, 0.03),
            ],
            false,
            "catmullrom",
            0.5
        );

        createCurvedBranch({
            points: rightBranchCurve.points,
            radiusStart: 0.09,
            radiusEnd: 0.032,
            radialSegments: 10,
        });

        // =========================================================
        // THIN STALKS (DANDI) — very thin twigs that sprout from the
        // 3 main branches. Each stalk ends in a single leaf, matching
        // the reference image exactly.
        // =========================================================

        function addStalkLeaf(branchCurve, tAlong, tipOffset, leafScale, leafRot, flip) {
            const start = branchCurve.getPointAt(tAlong);
            const end = start.clone().add(tipOffset);

            // A gentle curve from branch to leaf tip.
            const mid = start.clone().lerp(end, 0.55);
            mid.x += (Math.random() - 0.5) * 0.03;
            mid.y += 0.02;

            createCurvedBranch({
                points: [start, mid, end],
                radiusStart: 0.02,
                radiusEnd: 0.009,
                radialSegments: 5,
            });

            addLeaf(end, leafScale, leafRot, flip);
        }

        // =========================================================
        // LEAF SHAPE — fuller, rounder teardrop like the reference
        // =========================================================

        function createLeafGeometry() {
            const shape = new THREE.Shape();

            shape.moveTo(0, 0);

            shape.bezierCurveTo(0.2, 0.03, 0.33, 0.18, 0.31, 0.36);
            shape.bezierCurveTo(0.29, 0.55, 0.13, 0.73, 0, 0.9);
            shape.bezierCurveTo(-0.02, 0.72, -0.19, 0.56, -0.26, 0.38);
            shape.bezierCurveTo(-0.33, 0.18, -0.19, 0.04, 0, 0);

            const geometry = new THREE.ShapeGeometry(shape, 24);

            // Bake a light/dark split (relative to the central vein) into
            // vertex colors. Multiplying by the material's own green color
            // lets each leaf instance get its own hue while keeping the
            // two-tone, glossy-illustration look from the reference image.
            const position = geometry.attributes.position;
            const colors = new Float32Array(position.count * 3);

            for (let i = 0; i < position.count; i++) {
                const x = position.getX(i);
                const y = position.getY(i);

                // Light on the upper-left face, darker lower-right —
                // matches the diagonal shading seen on each leaf.
                const t = THREE.MathUtils.clamp((x - y * 0.35) / 0.4 + 0.5, 0, 1);
                const shade = THREE.MathUtils.lerp(0.62, 1.05, t);

                colors[i * 3] = shade;
                colors[i * 3 + 1] = shade;
                colors[i * 3 + 2] = shade;
            }

            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
            return geometry;
        }

        const leafGeometry = createLeafGeometry();

        const leafHues = [0x8fcf3f, 0x79bd2f, 0x6bab27];

        function makeLeafMaterial() {
            const hue = leafHues[Math.floor(Math.random() * leafHues.length)];
            return new THREE.MeshStandardMaterial({
                color: hue,
                vertexColors: true,
                roughness: 0.55,
                metalness: 0,
                side: THREE.DoubleSide,
            });
        }

        // =========================================================
        // LEAF CREATOR
        // =========================================================

        const leafStates = [];
        const leafMaterialsInUse = [];

        function addLeaf(position, scale = 1, rotationZ = 0, flip = false) {
            const group = new THREE.Group();

            const material = makeLeafMaterial();
            leafMaterialsInUse.push(material);

            const leaf = new THREE.Mesh(leafGeometry, material);
            leaf.scale.set(scale, scale, scale);
            leaf.rotation.z = rotationZ + (flip ? Math.PI : 0);
            leaf.position.z = 0.02;

            group.add(leaf);
            group.position.copy(position);
            treeGroup.add(group);

            leafStates.push({
                group,
                basePosition: position.clone(),
                baseRotation: group.rotation.clone(),
                baseScale: scale,
                state: "onTree",
                velocity: new THREE.Vector3(),
                rotationVelocity: new THREE.Vector3(),
                delay: 0,
            });

            return group;
        }

        // =========================================================
        // LEAF PLACEMENT — one thin stalk (dandi) per leaf, sprouting
        // from the 3 main branches, exactly like the reference image.
        // =========================================================

        // ---- LEFT branch: thin stalks fanning up-left ----
        addStalkLeaf(leftBranchCurve, 0.3, new THREE.Vector3(0.12, 0.32, 0.01), 0.55, -0.15, true);
        addStalkLeaf(leftBranchCurve, 0.55, new THREE.Vector3(-0.28, 0.34, 0.02), 0.62, -0.9, false);
        addStalkLeaf(leftBranchCurve, 0.78, new THREE.Vector3(-0.06, 0.38, 0.02), 0.58, -0.4, true);
        addStalkLeaf(leftBranchCurve, 1.0, new THREE.Vector3(-0.15, 0.28, 0.02), 0.66, -1.1, false);

        // ---- CENTER branch: thin stalks fanning up over the top ----
        addStalkLeaf(centerBranchCurve, 0.45, new THREE.Vector3(-0.42, 0.3, 0.01), 0.52, -0.5, true);
        addStalkLeaf(centerBranchCurve, 0.7, new THREE.Vector3(-0.42, 0.22, 0.02), 0.72, -0.35, false);
        addStalkLeaf(centerBranchCurve, 0.9, new THREE.Vector3(0.1, 0.28, 0.02), 0.78, -0.1, false);
        addStalkLeaf(centerBranchCurve, 1.0, new THREE.Vector3(0.5, 0.24, 0.02), 0.66, 0.35, false);

        // ---- RIGHT branch: thin stalks fanning up-right ----
        addStalkLeaf(rightBranchCurve, 0.18, new THREE.Vector3(-0.1, 0.28, 0.01), 0.42, 0.2, false);
        addStalkLeaf(rightBranchCurve, 0.45, new THREE.Vector3(0.1, 0.34, 0.02), 0.55, 0.35, false);
        addStalkLeaf(rightBranchCurve, 0.72, new THREE.Vector3(0.1, 0.26, 0.02), 0.6, 0.55, true);
        addStalkLeaf(rightBranchCurve, 1.0, new THREE.Vector3(0.22, 0.2, 0.02), 0.6, 0.85, false);
        addStalkLeaf(rightBranchCurve, 1.0, new THREE.Vector3(0.4, 0.12, 0.03), 0.5, 0.95, true);

        // =========================================================
        // INTERACTION
        // =========================================================

        let treeState = "full";

        const clickTargetGeometry = new THREE.SphereGeometry(2.15, 16, 16);
        const clickTargetMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
        });

        const clickTarget = new THREE.Mesh(clickTargetGeometry, clickTargetMaterial);
        clickTarget.position.set(0, 0.45, 0);
        treeGroup.add(clickTarget);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        function shedLeaves() {
            for (const leaf of leafStates) {
                if (leaf.state !== "onTree") continue;

                leaf.state = "falling";
                leaf.velocity.set(
                    (Math.random() - 0.5) * 1.0,
                    0.25 + Math.random() * 0.4,
                    (Math.random() - 0.5) * 0.35
                );
                leaf.rotationVelocity.set(
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 4
                );
                leaf.delay = Math.random() * 0.35;
            }
            treeState = "bare";
        }

        function regrowLeaves() {
            for (const leaf of leafStates) {
                if (leaf.state !== "falling" && leaf.state !== "landed") continue;

                leaf.state = "returning";
                leaf.delay = Math.random() * 0.25;
                leaf.velocity.set(0, 0, 0);
            }
            treeState = "full";
        }

        function handleTap(clientX, clientY) {
            const rect = renderer.domElement.getBoundingClientRect();

            pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObject(clickTarget, false);

            if (!hit.length) return;

            if (treeState === "full") {
                shedLeaves();
            } else {
                regrowLeaves();
            }
        }

        // =========================================================
        // DRAG ROTATION
        // =========================================================

        let yaw = 0;
        let pitch = 0.04;
        let yawVelocity = 0.07;
        let pitchVelocity = 0;

        let isDragging = false;
        let dragMoved = false;
        let lastX = 0;
        let lastY = 0;
        let idleTimer = 0;

        const DRAG_SENSITIVITY = 0.007;
        const PITCH_LIMIT = 0.65;

        function onPointerDown(evt) {
            isDragging = true;
            dragMoved = false;
            idleTimer = 0;
            lastX = evt.clientX;
            lastY = evt.clientY;
            renderer.domElement.setPointerCapture(evt.pointerId);
            renderer.domElement.style.cursor = "grabbing";
        }

        function onPointerMove(evt) {
            if (!isDragging) return;

            const dx = evt.clientX - lastX;
            const dy = evt.clientY - lastY;

            if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;

            yaw += dx * DRAG_SENSITIVITY;
            pitch = THREE.MathUtils.clamp(
                pitch + dy * DRAG_SENSITIVITY,
                -PITCH_LIMIT,
                PITCH_LIMIT
            );

            yawVelocity = dx * DRAG_SENSITIVITY;
            pitchVelocity = dy * DRAG_SENSITIVITY;

            lastX = evt.clientX;
            lastY = evt.clientY;
        }

        function onPointerUp(evt) {
            if (isDragging && !dragMoved) {
                handleTap(evt.clientX, evt.clientY);
            }

            isDragging = false;
            idleTimer = 0;
            renderer.domElement.style.cursor = "grab";

            try {
                renderer.domElement.releasePointerCapture(evt.pointerId);
            } catch (e) { }
        }

        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("pointercancel", onPointerUp);

        // =========================================================
        // RESIZE
        // =========================================================

        function resize() {
            const width = mount.clientWidth || 1;
            const height = mount.clientHeight || 1;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }

        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        // =========================================================
        // ANIMATION
        // =========================================================

        const clock = new THREE.Clock();
        const GRAVITY = 2.3;
        let rafId;

        function animate() {
            rafId = requestAnimationFrame(animate);

            const dt = Math.min(clock.getDelta(), 0.05);
            const time = clock.elapsedTime;

            if (!isDragging) {
                idleTimer += dt;

                yaw += yawVelocity * dt;
                pitch += pitchVelocity * dt;
                pitch = THREE.MathUtils.clamp(pitch, -PITCH_LIMIT, PITCH_LIMIT);

                yawVelocity *= 0.94;
                pitchVelocity *= 0.9;

                if (idleTimer > 2.5) {
                    yawVelocity += (0.07 - yawVelocity) * Math.min(1, dt * 0.8);
                    pitchVelocity += (0 - pitchVelocity) * Math.min(1, dt * 0.8);
                }
            }

            treeGroup.rotation.set(pitch, yaw, 0);
            branchGroup.rotation.z = Math.sin(time * 0.7) * 0.008;

            for (let i = 0; i < leafStates.length; i++) {
                const leaf = leafStates[i];

                if (leaf.state === "onTree") {
                    const sway = Math.sin(time * 1.5 + i) * 0.018;
                    leaf.group.rotation.z = leaf.baseRotation.z + sway;
                    continue;
                }

                if (leaf.state === "falling") {
                    if (leaf.delay > 0) {
                        leaf.delay -= dt;
                        continue;
                    }

                    leaf.velocity.y -= GRAVITY * dt;
                    leaf.group.position.addScaledVector(leaf.velocity, dt);

                    leaf.group.rotation.x += leaf.rotationVelocity.x * dt;
                    leaf.group.rotation.y += leaf.rotationVelocity.y * dt;
                    leaf.group.rotation.z += leaf.rotationVelocity.z * dt;

                    if (leaf.group.position.y < -1.75) {
                        leaf.group.position.y = -1.75;
                        leaf.state = "landed";
                    }
                    continue;
                }

                if (leaf.state === "returning") {
                    if (leaf.delay > 0) {
                        leaf.delay -= dt;
                        continue;
                    }

                    leaf.group.position.lerp(leaf.basePosition, Math.min(1, dt * 4));

                    leaf.group.rotation.x +=
                        (leaf.baseRotation.x - leaf.group.rotation.x) * Math.min(1, dt * 4);
                    leaf.group.rotation.y +=
                        (leaf.baseRotation.y - leaf.group.rotation.y) * Math.min(1, dt * 4);
                    leaf.group.rotation.z +=
                        (leaf.baseRotation.z - leaf.group.rotation.z) * Math.min(1, dt * 4);

                    if (leaf.group.position.distanceTo(leaf.basePosition) < 0.025) {
                        leaf.group.position.copy(leaf.basePosition);
                        leaf.group.rotation.copy(leaf.baseRotation);
                        leaf.state = "onTree";
                    }
                }
            }

            renderer.render(scene, camera);
        }

        animate();

        // =========================================================
        // CLEANUP
        // =========================================================

        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();

            renderer.domElement.removeEventListener("pointerdown", onPointerDown);
            renderer.domElement.removeEventListener("pointermove", onPointerMove);
            renderer.domElement.removeEventListener("pointerup", onPointerUp);
            renderer.domElement.removeEventListener("pointercancel", onPointerUp);

            branchGroup.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
            });

            leafGeometry.dispose();
            trunkMaterial.dispose();
            branchMaterial.dispose();

            leafMaterialsInUse.forEach((material) => material.dispose());

            baseGeometry.dispose();
            clickTargetGeometry.dispose();
            clickTargetMaterial.dispose();

            renderer.dispose();

            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className={`h-full w-full ${className}`} />;
}