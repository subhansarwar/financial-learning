// app/components/websiteComp/homeComp/InteractiveTree.jsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * InteractiveTree
 * -----------------
 * Procedurally generated low-poly tree rendered with Three.js.
 * Click / tap the tree and its leaves fall off with a gravity-driven
 * animation, just like a real tree shedding leaves. Click again once
 * the tree is bare and the leaves fly back up to regrow it.
 * Drag anywhere on the canvas to freely rotate the tree — release and
 * it keeps a little spin from your last motion, then eases back into
 * a slow idle rotation after a few seconds of no input.
 *
 * v4 changes (leaf realism pass):
 * - Leaves now have real physical thickness (ExtrudeGeometry + a tiny
 *   bevel) instead of a flat paper-thin card, so edges pick up rim
 *   light and read as an actual blade rather than a cut-out sticker.
 * - A third shape variant with an intentional small edge nick (the
 *   kind of tiny imperfection real leaves have from wind/insects), on
 *   top of the existing two silhouettes, for 3-way shape variety.
 * - A raised midrib ridge and a faint per-vertex micro-noise layered
 *   on top of the existing "cup" fold, so the surface reads as subtly
 *   imperfect/organic instead of one mathematically clean curve —
 *   perfectly smooth procedural curvature is one of the biggest
 *   giveaways of synthetic foliage.
 * - Leaf palette is now a continuously-interpolated gradient (12
 *   smooth stops) built from the original anchor colors, instead of
 *   8 flat buckets — removes the visible color-banding "posterized"
 *   look of the previous canopy.
 * - Roughness/emissive now vary by tonal tier: outer sunlit leaves
 *   get a touch glossier/waxier, inner shaded leaves stay matte —
 *   real canopies aren't uniformly glossy everywhere.
 * - Per-tip cluster size and fibonacci phase are now randomized, so
 *   clusters don't read as the same stamped pattern rotated around
 *   the tree.
 *
 * v3 changes:
 * - Free rotation: manual drag-to-orbit (Pointer Events, unifies
 *   mouse + touch) since three.js r128 has no OrbitControls and this
 *   project has no CDN access to pull one in. Drag rotates the tree
 *   on both yaw and pitch, with release-momentum and idle drift back
 *   to a gentle auto-spin. Tap/click (no meaningful drag distance)
 *   still triggers the leaf shed/regrow toggle exactly as before.
 *
 * v2 changes:
 * - Deeper, fuller branch recursion with a gentle bend per segment
 *   (each branch is drawn as 2 curved sub-cylinders instead of 1
 *   straight one) so the silhouette reads as organic, not stick-figure.
 * - Bark color gradient: thick trunk is dark, twigs lighten as they
 *   thin out toward the tips — mimics real growth-ring coloring.
 * - Canopy is built from fibonacci-sphere-sampled leaf clusters per
 *   tip (instead of pure random scatter), so each cluster reads as a
 *   full, rounded clump rather than a thin flat fan, and clusters
 *   themselves are staggered at two depths for extra volume.
 * - Leaf color is biased by how "outward/upward" a leaf sits in the
 *   canopy, so the crown reads as sunlit on top/outside and shaded
 *   toward the core — a cheap but effective stand-in for AO/GI.
 *
 * NOTE ON LEAF COLOR: this project runs three.js r128, which does NOT
 * support per-instance InstancedMesh colors (that landed in r131+).
 * So instead of one InstancedMesh + setColorAt (which renders solid
 * black on r128 because the unbound color attribute defaults to
 * (0,0,0,1)), leaves are split into one InstancedMesh PER COLOR *and*
 * PER SHAPE VARIANT, each with a normal `material.color`. Fully
 * r128-safe.
 *
 * Drop-in replacement for the static `rightsideImage` <Image> in
 * HeroSection.jsx — it fills its parent container (use the same
 * aspect-square wrapper you already have).
 */

// ---- small deterministic PRNG so the tree shape is stable across reloads ----
function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Anchor colors spanning deep core-shadow tones up to a bright sunlit
// rim highlight. These are NOT used directly as the palette — they're
// interpolated into a much finer continuous gradient below, so the
// canopy shades smoothly instead of showing a handful of visibly
// distinct flat-color chunks (one of the biggest tells of synthetic,
// "posterized" foliage).
const LEAF_COLOR_ANCHORS = [
    0x33481d, // Deep core shadow
    0x415c26, // Dark olive
    0x51702f, // Base earthy green
    0x62883a, // Mid green
    0x749f45, // Fresh green
    0x87b552, // Sunlit green
    0x9dc662, // Highlighted sage
    0xb6dc54, // Brand highlight (rim-lit tips only)
];

function buildLeafGradient(anchors, steps) {
    const colors = [];
    const segCount = anchors.length - 1;
    for (let i = 0; i < steps; i++) {
        const t = (i / (steps - 1)) * segCount;
        const segIndex = Math.min(Math.floor(t), segCount - 1);
        const localT = t - segIndex;
        const a = new THREE.Color(anchors[segIndex]);
        const b = new THREE.Color(anchors[segIndex + 1]);
        colors.push(a.clone().lerp(b, localT));
    }
    return colors;
}

// 12 smoothly-interpolated stops instead of the 8 raw anchors.
const LEAF_COLORS = buildLeafGradient(LEAF_COLOR_ANCHORS, 12);

const TRUNK_COLOR = 0x5a3d22; // Deep, rich base-trunk brown
const TWIG_COLOR = 0x8a6339; // Lighter, warmer color for thin outer twigs

const UP = new THREE.Vector3(0, 1, 0);

export default function InteractiveTree({ className = "" }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const rand = mulberry32(1337); // fixed seed -> consistent tree every load

        // ============================================================
        // Scene / camera / renderer
        // ============================================================
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
        camera.position.set(0, 1.75, 10.8);
        camera.lookAt(0, 1.85, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.style.cursor = "grab";
        // prevent the browser from hijacking touch drags as page-scroll
        renderer.domElement.style.touchAction = "none";

        // ============================================================
        // Lights — warmed up slightly for more "golden hour" pop
        // ============================================================
        const hemi = new THREE.HemisphereLight(0xfff6e0, 0xb98a54, 1.25);
        scene.add(hemi);
        const dir = new THREE.DirectionalLight(0xfff2d8, 1.0);
        dir.position.set(3, 6, 4);
        scene.add(dir);
        const fill = new THREE.DirectionalLight(0xffe9c7, 0.32);
        fill.position.set(-4, 2, -3);
        scene.add(fill);
        // subtle warm rim light behind/above the canopy so leaf edges glow
        const rim = new THREE.DirectionalLight(0xffd9a0, 0.6);
        rim.position.set(-2, 4, -5);
        scene.add(rim);
        // soft top-down key so the crown reads as rounded rather than flat
        const crown = new THREE.DirectionalLight(0xffffff, 0.22);
        crown.position.set(0, 8, 1);
        scene.add(crown);

        // ============================================================
        // Ground shadow (soft layered blob for a gradient falloff)
        // ============================================================
        const shadowGroup = new THREE.Group();
        [
            { r: 1.9, o: 0.05 },
            { r: 1.4, o: 0.07 },
            { r: 0.95, o: 0.09 },
            { r: 0.55, o: 0.11 },
        ].forEach(({ r, o }) => {
            const geo = new THREE.CircleGeometry(r, 32);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x8b5a2b,
                transparent: true,
                opacity: o,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.y = -1.62;
            shadowGroup.add(mesh);
        });
        scene.add(shadowGroup);

        // ============================================================
        // Tree group (everything rotates together — driven by drag)
        // ============================================================
        const TREE_SCALE = 1.4; // bump this up/down to resize the whole tree
        const treeGroup = new THREE.Group();
        treeGroup.scale.setScalar(TREE_SCALE);
        // scaling happens around the origin, but the trunk base sits at
        // local y = -1.6 — re-center so that base still lands on the
        // ground-shadow plane at world y = -1.6 instead of sinking lower
        treeGroup.position.y = -1.6 + 1.6 * TREE_SCALE;
        scene.add(treeGroup);

        const MAX_DEPTH = 5; // was 4 — one extra generation = a much fuller crown

        function barkColorAt(depth) {
            // depth counts DOWN from MAX_DEPTH to 0 as branches get thinner,
            // so t=0 at the trunk, t=1 at the finest twigs
            const t = 1 - depth / MAX_DEPTH;
            const trunk = new THREE.Color(TRUNK_COLOR);
            const twig = new THREE.Color(TWIG_COLOR);
            return trunk.clone().lerp(twig, t);
        }
        // pre-build one material per depth level so bark visibly lightens
        // from thick trunk to fine twigs, instead of one flat brown
        const barkMaterials = [];
        for (let d = 0; d <= MAX_DEPTH; d++) {
            barkMaterials.push(
                new THREE.MeshStandardMaterial({
                    color: barkColorAt(d),
                    roughness: 0.88,
                    metalness: 0,
                })
            );
        }

        const branchGroup = new THREE.Group();
        treeGroup.add(branchGroup);

        const leafTips = []; // { pos: Vector3, dir: Vector3 }

        // Draws a branch as two gently bent sub-cylinders instead of one
        // straight one, so limbs read as organic rather than ruler-straight.
        function addBranchSegment(start, end, radiusStart, radiusEnd, material) {
            const dirVec = end.clone().sub(start);
            const length = dirVec.length();
            if (length < 1e-5) return;
            const segments = 6;
            const geo = new THREE.CylinderGeometry(
                Math.max(radiusEnd, 0.011),
                Math.max(radiusStart, 0.013),
                length,
                segments
            );
            const mesh = new THREE.Mesh(geo, material);
            mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
            mesh.quaternion.setFromUnitVectors(UP, dirVec.clone().normalize());
            branchGroup.add(mesh);
        }

        function addBranch(start, direction, length, radius, depth) {
            const material = barkMaterials[Math.min(depth, MAX_DEPTH)];

            // gentle bend: bow the branch sideways/upward at its midpoint so
            // it curves like a real limb instead of a straight rod
            const bendAxis = new THREE.Vector3(rand() - 0.5, 0, rand() - 0.5).normalize();
            const bendAmount = length * (0.06 + rand() * 0.08);
            const mid = start
                .clone()
                .add(direction.clone().multiplyScalar(length * 0.5))
                .add(bendAxis.multiplyScalar(bendAmount));
            const end = start.clone().add(direction.clone().multiplyScalar(length));

            addBranchSegment(start, mid, radius, radius * 0.82, material);
            addBranchSegment(mid, end, radius * 0.82, Math.max(radius * 0.6, 0.011), material);

            if (depth <= 0) {
                leafTips.push({ pos: end.clone(), dir: direction.clone().normalize() });
                return;
            }

            // always at least 2 branches, and lean toward 3 more often, so the
            // canopy fills out symmetrically instead of trailing off to one side
            const branchCount = rand() > 0.3 ? 3 : 2;
            for (let i = 0; i < branchCount; i++) {
                // tighter, more even spread keeps the crown compact and balanced;
                // spread narrows slightly at deeper levels so the crown rounds
                // off toward the top instead of splaying out forever
                const spread = 0.3 + rand() * 0.26 - (MAX_DEPTH - depth) * 0.015;
                const axis = new THREE.Vector3(
                    rand() - 0.5,
                    rand() * 0.3,
                    rand() - 0.5
                ).normalize();
                const newDir = direction
                    .clone()
                    .applyAxisAngle(axis, spread * (rand() > 0.5 ? 1 : -1))
                    .normalize();
                // keep branches generally growing upward/outward
                newDir.y = Math.max(newDir.y, 0.38);
                newDir.normalize();

                addBranch(
                    end,
                    newDir,
                    length * (0.7 + rand() * 0.1),
                    radius * 0.66,
                    depth - 1
                );
            }
        }

        addBranch(
            new THREE.Vector3(0, -1.6, 0),
            new THREE.Vector3(0, 1, 0),
            1.0,
            0.155,
            MAX_DEPTH
        );

        // ============================================================
        // Visible roots — a few flared buttress roots radiating out from
        // the trunk base, colored to match the base of the trunk
        // ============================================================
        const rootMaterial = barkMaterials[0];
        const rootCount = 7;
        for (let i = 0; i < rootCount; i++) {
            const angle = (i / rootCount) * Math.PI * 2 + (rand() - 0.5) * 0.35;
            const length = 0.48 + rand() * 0.32;
            const rootGeo = new THREE.ConeGeometry(0.085 + rand() * 0.03, length, 6);
            rootGeo.translate(0, length / 2, 0);
            rootGeo.scale(1, 1, 0.4); // flatten into a ridge, not a round cone
            rootGeo.computeVertexNormals();
            const root = new THREE.Mesh(rootGeo, rootMaterial);
            const outward = new THREE.Vector3(Math.cos(angle), -0.4, Math.sin(angle)).normalize();
            root.position.set(Math.cos(angle) * 0.1, -1.58, Math.sin(angle) * 0.1);
            root.quaternion.setFromUnitVectors(UP, outward);
            branchGroup.add(root);
        }
        // root flare collar where the trunk meets the ground
        const flareGeo = new THREE.SphereGeometry(0.21, 12, 8);
        flareGeo.scale(1, 0.42, 1);
        const flare = new THREE.Mesh(flareGeo, rootMaterial);
        flare.position.set(0, -1.6, 0);
        branchGroup.add(flare);

        // ============================================================
        // Leaves — one InstancedMesh PER COLOR PER SHAPE VARIANT
        // (r128-safe), built from fibonacci-sphere-sampled clusters per
        // branch tip for a full, rounded canopy instead of a thin
        // scattered fan
        // ============================================================

        // Three slightly different silhouettes mixed at random, so the
        // canopy doesn't read as one leaf photocopied thousands of times.
        // Variant A: a touch narrower/pointier. Variant B: a touch broader
        // and slightly asymmetric left/right, like a real leaf blade.
        // Variant C: adds a small natural nick near the tip, the kind of
        // tiny imperfection real leaves pick up from wind/insects/wear —
        // a detail synthetic foliage almost never has.
        function createLeafShapeA() {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.bezierCurveTo(0.06, 0.015, 0.075, 0.09, 0.05, 0.17);
            shape.bezierCurveTo(0.032, 0.225, 0.012, 0.255, 0, 0.27);
            shape.bezierCurveTo(-0.012, 0.255, -0.032, 0.225, -0.05, 0.17);
            shape.bezierCurveTo(-0.075, 0.09, -0.06, 0.015, 0, 0);
            return shape;
        }
        function createLeafShapeB() {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            // right lobe — slightly fuller
            shape.bezierCurveTo(0.085, 0.02, 0.1, 0.1, 0.065, 0.155);
            shape.bezierCurveTo(0.045, 0.19, 0.02, 0.215, 0, 0.225);
            // left lobe — slightly narrower, so it's not a mirror image
            shape.bezierCurveTo(-0.018, 0.215, -0.038, 0.185, -0.055, 0.145);
            shape.bezierCurveTo(-0.08, 0.08, -0.065, 0.015, 0, 0);
            return shape;
        }
        function createLeafShapeC() {
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.bezierCurveTo(0.052, 0.02, 0.07, 0.11, 0.046, 0.19);
            shape.bezierCurveTo(0.03, 0.24, 0.014, 0.27, 0.005, 0.284);
            // small notch near the tip
            shape.lineTo(-0.004, 0.276);
            shape.bezierCurveTo(-0.017, 0.263, -0.033, 0.233, -0.048, 0.183);
            shape.bezierCurveTo(-0.071, 0.1, -0.053, 0.02, 0, 0);
            return shape;
        }

        // Bakes a gentle non-planar "cup" into the leaf geometry — real
        // leaf blades aren't perfectly flat, they curve slightly across
        // the midrib — plus a faint raised midrib ridge and a tiny
        // per-vertex noise so the surface reads as subtly imperfect
        // rather than a single mathematically clean curve.
        function applyLeafFold(geometry, foldDepth = 0.018) {
            const pos = geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const z = pos.getZ(i);
                // fold increases toward the outer edges (|x|) and eases in
                // near the base (small y), like a real blade does
                const edge = Math.min(Math.abs(x) / 0.09, 1);
                const alongBlade = Math.min(Math.max(y, 0) / 0.2, 1);
                const cup = Math.pow(edge, 1.6) * (0.35 + 0.65 * alongBlade) * foldDepth;

                // a faint raised midrib running the length of the blade
                const midrib = (1 - Math.min(Math.abs(x) / 0.018, 1)) * 0.005 * alongBlade;

                // tiny deterministic per-vertex noise (seeded from position,
                // so it's stable across rebuilds) to break up any perfectly
                // smooth procedural curvature
                const noiseSeed = Math.sin(x * 191.3 + y * 271.7) * 43758.5453;
                const microNoise = (noiseSeed - Math.floor(noiseSeed) - 0.5) * 0.003;

                pos.setZ(i, z + cup + midrib + microNoise);
            }
            pos.needsUpdate = true;
            geometry.computeVertexNormals();
            return geometry;
        }

        // Gives leaves real, if tiny, physical thickness via a shallow
        // extrude with a small bevel — this alone is one of the biggest
        // fixes for the "flat paper cutout" look, since edges now catch
        // rim/fill light and read as an actual blade instead of a decal.
        function createLeafGeometry(shapeFn) {
            const depth = 0.006;
            const bevelThickness = 0.0022;
            const geo = new THREE.ExtrudeGeometry(shapeFn(), {
                depth,
                bevelEnabled: true,
                bevelThickness,
                bevelSize: 0.0022,
                bevelSegments: 2,
                curveSegments: 6,
                steps: 1,
            });
            const totalDepth = depth + bevelThickness * 2;
            geo.translate(0, 0, -totalDepth / 2); // center the thin slab on z=0
            return applyLeafFold(geo);
        }

        const NUM_VARIANTS = 3;
        const leafGeometries = [
            createLeafGeometry(createLeafShapeA),
            createLeafGeometry(createLeafShapeB),
            createLeafGeometry(createLeafShapeC),
        ];

        const BASE_LEAVES_PER_TIP = 24; // was 14 — much fuller canopy per cluster
        const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // fibonacci-sphere step

        // Per-tip leaf counts vary a little (±5) so clusters don't all
        // read as the same stamped pattern rotated around the tree.
        const tipLeafCounts = leafTips.map(
            () => BASE_LEAVES_PER_TIP + Math.floor((rand() - 0.5) * 10)
        );
        const totalLeaves = tipLeafCounts.reduce((sum, n) => sum + n, 0);

        // canopy bounds (computed from tip positions) so leaf color can be
        // biased by how far outward/upward each leaf sits — gives the
        // sunlit-top / shaded-core look cheaply, without real AO
        const canopyCenter = new THREE.Vector3();
        leafTips.forEach((t) => canopyCenter.add(t.pos));
        if (leafTips.length) canopyCenter.divideScalar(leafTips.length);
        let canopyRadius = 0.001;
        leafTips.forEach((t) => {
            canopyRadius = Math.max(canopyRadius, t.pos.distanceTo(canopyCenter));
        });

        // Decide every leaf's color + shape variant up front, biased by
        // outward position, so we know how big to make each bucket.
        const leafColorIndices = new Array(totalLeaves).fill(0);
        const leafExposures = new Array(totalLeaves).fill(0); // 0 = core/shaded, 1 = outer/sunlit
        const NUM_BUCKETS = LEAF_COLORS.length * NUM_VARIANTS;
        const bucketCounts = new Array(NUM_BUCKETS).fill(0);
        const bucketIndexOf = (colorIndex, variant) => colorIndex * NUM_VARIANTS + variant;

        const dummy = new THREE.Object3D();

        // per-instance state used by the animation loop, and per-leaf
        // computed world position (needed before we can bias color)
        const leafState = new Array(totalLeaves);

        let idx = 0;
        leafTips.forEach((tip, tipIndex) => {
            const leavesThisTip = tipLeafCounts[tipIndex];
            // per-cluster phase offset so the fibonacci sampling pattern
            // doesn't repeat identically (just rotated) at every tip
            const anglePhase = rand() * Math.PI * 2;

            for (let i = 0; i < leavesThisTip; i++) {
                // fibonacci-sphere sample within a hemisphere-ish cone around
                // the tip's growth direction — evenly fills a rounded clump
                // instead of leaving random gaps/clusters
                const y = 1 - (i / Math.max(leavesThisTip - 1, 1)) * 1.5; // bias toward +Y hemisphere
                const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
                const theta = GOLDEN_ANGLE * i + anglePhase;
                const localDir = new THREE.Vector3(
                    Math.cos(theta) * radiusAtY,
                    y,
                    Math.sin(theta) * radiusAtY
                ).normalize();

                // rotate the sample so its pole points along the tip's own
                // growth direction, then jitter slightly for organic noise
                const alignToTip = new THREE.Quaternion().setFromUnitVectors(UP, tip.dir);
                const leafDir = localDir.clone().applyQuaternion(alignToTip);
                leafDir.x += (rand() - 0.5) * 0.12;
                leafDir.y += (rand() - 0.5) * 0.1 + 0.05;
                leafDir.z += (rand() - 0.5) * 0.12;
                leafDir.normalize();

                // two staggered depths per cluster (inner + outer shell) adds
                // real volume instead of a flat single-radius shell
                const shellOuter = i % 3 !== 0;
                const dist = shellOuter ? 0.14 + rand() * 0.16 : 0.04 + rand() * 0.09;
                const basePos = tip.pos.clone().add(leafDir.clone().multiplyScalar(dist));

                const alignQuat = new THREE.Quaternion().setFromUnitVectors(UP, leafDir);
                const localRoll = new THREE.Quaternion().setFromAxisAngle(UP, rand() * Math.PI * 2);
                alignQuat.multiply(localRoll);
                const baseRot = new THREE.Euler().setFromQuaternion(alignQuat);

                const scale = (shellOuter ? 1.0 : 0.85) + rand() * 0.55;
                // non-uniform width/length so leaves don't read as identical
                // clones stamped from the same die
                const scaleX = 0.82 + rand() * 0.36;
                const scaleY = 0.85 + rand() * 0.34;

                // exposure: blend of how far outward from canopy core, and
                // how high up the leaf sits, both normalized 0..1
                const outward = canopyRadius > 0
                    ? THREE.MathUtils.clamp(basePos.distanceTo(canopyCenter) / canopyRadius, 0, 1)
                    : 0.5;
                const heightFrac = THREE.MathUtils.clamp(
                    (basePos.y - (canopyCenter.y - canopyRadius)) / (canopyRadius * 2),
                    0,
                    1
                );
                const exposure = THREE.MathUtils.clamp(outward * 0.6 + heightFrac * 0.5, 0, 1);

                leafExposures[idx] = exposure;

                leafState[idx] = {
                    basePos,
                    baseRot,
                    scale,
                    scaleX,
                    scaleY,
                    variant: Math.floor(rand() * NUM_VARIANTS),
                    state: "onTree", // onTree | falling | landed | returning
                    pos: basePos.clone(),
                    rot: baseRot.clone(),
                    vel: new THREE.Vector3(),
                    angVel: new THREE.Vector3(),
                    delay: rand() * 0.5,
                    landY: -1.55 - rand() * 0.08,
                    swayPhase: rand() * Math.PI * 2, // idle-flutter offset
                    swaySpeed: 1.4 + rand() * 1.2,
                };
                idx++;
            }
        });

        // now assign colors from the exposure bias: low exposure -> deep
        // core tones, high exposure -> bright/highlight tones, with a
        // little randomness mixed in so it never looks banded
        for (let i = 0; i < totalLeaves; i++) {
            const exposure = leafExposures[i];
            const jitter = (rand() - 0.5) * 0.38;
            const t = THREE.MathUtils.clamp(exposure + jitter, 0, 1);
            const colorIndex = Math.min(
                LEAF_COLORS.length - 1,
                Math.floor(t * LEAF_COLORS.length)
            );
            leafColorIndices[i] = colorIndex;
            bucketCounts[bucketIndexOf(colorIndex, leafState[i].variant)]++;
        }

        // build one InstancedMesh per (color, shape-variant) combo. Outer,
        // sunlit-tier leaves get a touch glossier/waxier roughness and a
        // slightly stronger emissive lift; inner, shaded-tier leaves stay
        // matte — real canopies aren't uniformly glossy top to bottom.
        const leafMeshes = [];
        for (let ci = 0; ci < LEAF_COLORS.length; ci++) {
            const tierT = ci / (LEAF_COLORS.length - 1);
            for (let v = 0; v < NUM_VARIANTS; v++) {
                const baseColor = LEAF_COLORS[ci];
                const roughness = THREE.MathUtils.clamp(
                    0.72 - tierT * 0.24 + (v % 2 === 0 ? 0.03 : -0.02),
                    0.35,
                    0.85
                );
                const mat = new THREE.MeshStandardMaterial({
                    color: baseColor.clone(),
                    roughness,
                    metalness: 0.0,
                    side: THREE.DoubleSide,
                    flatShading: false, // smooth shading across the fold reads far less "plastic"
                    emissive: baseColor.clone(),
                    emissiveIntensity: 0.03 + tierT * 0.06, // faint self-glow, stands in for backlit translucency
                });
                const bi = bucketIndexOf(ci, v);
                const count = Math.max(bucketCounts[bi], 1);
                const mesh = new THREE.InstancedMesh(leafGeometries[v], mat, count);
                mesh.count = bucketCounts[bi];
                mesh.frustumCulled = false;
                treeGroup.add(mesh);
                leafMeshes.push({ mesh, mat });
            }
        }

        const bucketCursor = new Array(NUM_BUCKETS).fill(0);
        for (let i = 0; i < totalLeaves; i++) {
            const s = leafState[i];
            const colorIndex = leafColorIndices[i];
            const bi = bucketIndexOf(colorIndex, s.variant);
            const localIndex = bucketCursor[bi]++;
            s.meshIndex = bi;
            s.localIndex = localIndex;

            dummy.position.copy(s.basePos);
            dummy.rotation.copy(s.baseRot);
            dummy.scale.set(s.scale * s.scaleX, s.scale * s.scaleY, s.scale);
            dummy.updateMatrix();
            leafMeshes[bi].mesh.setMatrixAt(localIndex, dummy.matrix);
        }
        leafMeshes.forEach(({ mesh }) => (mesh.instanceMatrix.needsUpdate = true));

        // ============================================================
        // Invisible click target covering the canopy + trunk
        // ============================================================
        const clickTargetGeo = new THREE.SphereGeometry(2.05, 12, 12);
        const clickTargetMat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
        });
        const clickTarget = new THREE.Mesh(clickTargetGeo, clickTargetMat);
        clickTarget.position.set(0, 0.95, 0);
        treeGroup.add(clickTarget);

        // ============================================================
        // Interaction: tap to shed / regrow leaves, drag to rotate freely
        // ============================================================
        let treeState = "full"; // full | bare
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        function shedLeaves() {
            for (const s of leafState) {
                if (s.state !== "onTree") continue;
                s.state = "falling";
                s.vel.set(
                    (rand() - 0.5) * 1.1,
                    0.4 + rand() * 0.5,
                    (rand() - 0.5) * 1.1
                );
                s.angVel.set(
                    (rand() - 0.5) * 4,
                    (rand() - 0.5) * 4,
                    (rand() - 0.5) * 4
                );
                s.delay = rand() * 0.6;
            }
            treeState = "bare";
        }

        function regrowLeaves() {
            for (const s of leafState) {
                if (s.state !== "landed" && s.state !== "falling") continue;
                s.state = "returning";
                s.delay = rand() * 0.4;
                s.vel.set(0, 0, 0);
            }
            treeState = "full";
        }

        function handleTap(clientX, clientY) {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObject(clickTarget, false);
            if (hit.length === 0) return;

            if (treeState === "full") shedLeaves();
            else regrowLeaves();
        }

        // ---- free drag rotation (Pointer Events unify mouse + touch) ----
        const BASE_IDLE_SPEED = 0.12; // rad/sec, matches the old auto-spin speed
        const DRAG_SENSITIVITY = 0.0085;
        const PITCH_LIMIT = 1.2; // radians — keeps the tree from flipping fully upside down
        const IDLE_RESUME_DELAY = 3.2; // seconds of no interaction before auto-rotate resumes

        let yaw = 0;
        let pitch = 0.08;
        let yawVel = BASE_IDLE_SPEED;
        let pitchVel = 0;
        let isDragging = false;
        let dragMoved = false;
        let lastX = 0;
        let lastY = 0;
        let idleTimer = 0;

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
            pitch = THREE.MathUtils.clamp(pitch + dy * DRAG_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);

            // remember recent motion so release can carry a bit of momentum
            yawVel = (dx * DRAG_SENSITIVITY) / Math.max(evt.timeStamp - (onPointerMove._t || evt.timeStamp), 1) * 16;
            pitchVel = (dy * DRAG_SENSITIVITY) / Math.max(evt.timeStamp - (onPointerMove._t || evt.timeStamp), 1) * 16;
            onPointerMove._t = evt.timeStamp;

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
            } catch (e) {
                /* noop — capture may already be released */
            }
        }

        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("pointercancel", onPointerUp);

        // ============================================================
        // Resize handling
        // ============================================================
        function resize() {
            const w = mount.clientWidth || 1;
            const h = mount.clientHeight || 1;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        }
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        // ============================================================
        // Animation loop
        // ============================================================
        const clock = new THREE.Clock();
        const GRAVITY = 2.4;
        let rafId;
        const meshDirty = new Array(leafMeshes.length).fill(false);

        function animate() {
            rafId = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.05);
            const t = clock.elapsedTime;

            // ---- rotation: user drag takes priority; otherwise momentum
            // decays, and after a short idle period it eases back into a
            // gentle constant auto-spin (never fully stops) ----
            if (!isDragging) {
                idleTimer += dt;
                yaw += yawVel * dt;
                pitch = THREE.MathUtils.clamp(pitch + pitchVel * dt, -PITCH_LIMIT, PITCH_LIMIT);
                yawVel *= 0.94;
                pitchVel *= 0.9;
                if (idleTimer > IDLE_RESUME_DELAY) {
                    yawVel += (BASE_IDLE_SPEED - yawVel) * Math.min(1, dt * 0.6);
                    pitchVel += (0 - pitchVel) * Math.min(1, dt * 0.6);
                }
            }
            treeGroup.rotation.set(pitch, yaw, 0);
            branchGroup.rotation.z = Math.sin(t * 0.6) * 0.015;

            meshDirty.fill(false);

            for (let i = 0; i < leafState.length; i++) {
                const s = leafState[i];
                const mesh = leafMeshes[s.meshIndex].mesh;

                if (s.state === "onTree") {
                    // tiny idle flutter so the canopy feels alive even before
                    // it's touched
                    const flutter = Math.sin(t * s.swaySpeed + s.swayPhase) * 0.05;
                    dummy.position.copy(s.basePos);
                    dummy.rotation.set(
                        s.baseRot.x + flutter,
                        s.baseRot.y,
                        s.baseRot.z + flutter * 0.6
                    );
                    dummy.scale.set(s.scale * s.scaleX, s.scale * s.scaleY, s.scale);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(s.localIndex, dummy.matrix);
                    meshDirty[s.meshIndex] = true;
                    continue;
                }

                if (s.state === "falling") {
                    if (s.delay > 0) {
                        s.delay -= dt;
                    } else {
                        s.vel.y -= GRAVITY * dt;
                        s.pos.addScaledVector(s.vel, dt);
                        s.rot.x += s.angVel.x * dt;
                        s.rot.y += s.angVel.y * dt;
                        s.rot.z += s.angVel.z * dt;

                        if (s.pos.y <= s.landY) {
                            s.pos.y = s.landY;
                            s.state = "landed";
                        }
                    }
                } else if (s.state === "returning") {
                    if (s.delay > 0) {
                        s.delay -= dt;
                    } else {
                        s.pos.lerp(s.basePos, Math.min(1, dt * 4));
                        s.rot.x += (s.baseRot.x - s.rot.x) * Math.min(1, dt * 4);
                        s.rot.y += (s.baseRot.y - s.rot.y) * Math.min(1, dt * 4);
                        s.rot.z += (s.baseRot.z - s.rot.z) * Math.min(1, dt * 4);

                        if (s.pos.distanceTo(s.basePos) < 0.02) {
                            s.pos.copy(s.basePos);
                            s.rot.copy(s.baseRot);
                            s.state = "onTree";
                        }
                    }
                } else {
                    // "landed" — sits still, no per-frame update needed
                    continue;
                }

                dummy.position.copy(s.pos);
                dummy.rotation.set(s.rot.x, s.rot.y, s.rot.z);
                dummy.scale.set(s.scale * s.scaleX, s.scale * s.scaleY, s.scale);
                dummy.updateMatrix();
                mesh.setMatrixAt(s.localIndex, dummy.matrix);
                meshDirty[s.meshIndex] = true;
            }

            leafMeshes.forEach(({ mesh }, i) => {
                if (meshDirty[i]) mesh.instanceMatrix.needsUpdate = true;
            });

            renderer.render(scene, camera);
        }
        animate();

        // ============================================================
        // Cleanup
        // ============================================================
        return () => {
            cancelAnimationFrame(rafId);
            resizeObserver.disconnect();
            renderer.domElement.removeEventListener("pointerdown", onPointerDown);
            renderer.domElement.removeEventListener("pointermove", onPointerMove);
            renderer.domElement.removeEventListener("pointerup", onPointerUp);
            renderer.domElement.removeEventListener("pointercancel", onPointerUp);

            branchGroup.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
            });
            barkMaterials.forEach((m) => m.dispose());
            leafGeometries.forEach((g) => g.dispose());
            leafMeshes.forEach(({ mat }) => mat.dispose());
            shadowGroup.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
            clickTargetGeo.dispose();
            clickTargetMat.dispose();
            renderer.dispose();

            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className={`h-full w-full ${className}`} />;
}