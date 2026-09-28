import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =========================================================
   BASIC SETUP
========================================================= */

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
    0x12091f,
    0.018
);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    0,
    5,
    24
);

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document
    .getElementById("scene-container")
    .appendChild(renderer.domElement);


/* =========================================================
   CONTROLS
========================================================= */

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping = true;
controls.dampingFactor = 0.04;

controls.enableZoom = false;
controls.enablePan = false;

controls.autoRotate = true;
controls.autoRotateSpeed = 0.18;


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight =
    new THREE.AmbientLight(
        0xb9a7ff,
        1.4
    );

scene.add(ambientLight);

const moonLight =
    new THREE.DirectionalLight(
        0xc8d8ff,
        2.2
    );

moonLight.position.set(
    -8,
    15,
    8
);

scene.add(moonLight);

const pinkLight =
    new THREE.PointLight(
        0xff75c8,
        3,
        35
    );

pinkLight.position.set(
    0,
    5,
    2
);

scene.add(pinkLight);

const purpleLight =
    new THREE.PointLight(
        0x9c6cff,
        2.5,
        30
    );

purpleLight.position.set(
    -10,
    3,
    -5
);

scene.add(purpleLight);


/* =========================================================
   SKY GRADIENT
========================================================= */

const skyCanvas =
    document.createElement("canvas");

skyCanvas.width = 1024;
skyCanvas.height = 512;

const skyCtx =
    skyCanvas.getContext("2d");

const skyGradient =
    skyCtx.createLinearGradient(
        0,
        0,
        0,
        skyCanvas.height
    );

skyGradient.addColorStop(
    0,
    "#08051a"
);

skyGradient.addColorStop(
    0.35,
    "#171044"
);

skyGradient.addColorStop(
    0.65,
    "#35145b"
);

skyGradient.addColorStop(
    1,
    "#100817"
);

skyCtx.fillStyle =
    skyGradient;

skyCtx.fillRect(
    0,
    0,
    skyCanvas.width,
    skyCanvas.height
);

const skyTexture =
    new THREE.CanvasTexture(
        skyCanvas
    );

scene.background =
    skyTexture;


/* =========================================================
   STARS
========================================================= */

const starGeometry =
    new THREE.BufferGeometry();

const starPositions = [];

for (let i = 0; i < 1800; i++) {

    const radius =
        55 +
        Math.random() * 45;

    const theta =
        Math.random() *
        Math.PI * 2;

    const phi =
        Math.random() *
        Math.PI;

    starPositions.push(
        radius *
            Math.sin(phi) *
            Math.cos(theta),

        radius *
            Math.cos(phi),

        radius *
            Math.sin(phi) *
            Math.sin(theta)
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        starPositions,
        3
    )
);

const starMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.09,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
    });

const stars =
    new THREE.Points(
        starGeometry,
        starMaterial
    );

scene.add(stars);


/* =========================================================
   GLOW TEXTURE
========================================================= */

function createGlowTexture() {

    const canvas =
        document.createElement("canvas");

    canvas.width = 128;
    canvas.height = 128;

    const ctx =
        canvas.getContext("2d");

    const gradient =
        ctx.createRadialGradient(
            64,
            64,
            0,
            64,
            64,
            64
        );

    gradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );

    gradient.addColorStop(
        0.15,
        "rgba(255,210,250,0.9)"
    );

    gradient.addColorStop(
        0.4,
        "rgba(255,120,220,0.35)"
    );

    gradient.addColorStop(
        1,
        "rgba(255,120,220,0)"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        128,
        128
    );

    return new THREE.CanvasTexture(
        canvas
    );
}

const glowTexture =
    createGlowTexture();


/* =========================================================
   MOON
========================================================= */

const moonGroup =
    new THREE.Group();

const moonGeometry =
    new THREE.SphereGeometry(
        3.2,
        64,
        64
    );

const moonMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xfff3fa
    });

const moon =
    new THREE.Mesh(
        moonGeometry,
        moonMaterial
    );

moon.position.set(
    -11,
    12,
    -18
);

moonGroup.add(moon);


const moonGlowMaterial =
    new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xbba8ff,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending:
            THREE.AdditiveBlending
    });

const moonGlow =
    new THREE.Sprite(
        moonGlowMaterial
    );

moonGlow.scale.set(
    10,
    10,
    1
);

moonGlow.position.copy(
    moon.position
);

moonGroup.add(moonGlow);

scene.add(moonGroup);


/* =========================================================
   GROUND
========================================================= */

const groundGeometry =
    new THREE.CircleGeometry(
        40,
        96
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x171126,
        roughness: 0.95,
        metalness: 0.05
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.position.y =
    -2.5;

scene.add(ground);


/* =========================================================
   GLOWING PATH
========================================================= */

const pathGeometry =
    new THREE.PlaneGeometry(
        7,
        28,
        1,
        20
    );

const pathMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x39234e,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

const path =
    new THREE.Mesh(
        pathGeometry,
        pathMaterial
    );

path.rotation.x =
    -Math.PI / 2;

path.position.set(
    0,
    -2.43,
    3
);

scene.add(path);


/* =========================================================
   FLOWERS
========================================================= */

const flowers = [];

function createFlower(
    x,
    y,
    z,
    scale = 1,
    color = 0xff82c8
) {

    const flowerGroup =
        new THREE.Group();

    const stemGeometry =
        new THREE.CylinderGeometry(
            0.035 * scale,
            0.055 * scale,
            1.4 * scale,
            8
        );

    const stemMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x315d42
        });

    const stem =
        new THREE.Mesh(
            stemGeometry,
            stemMaterial
        );

    stem.position.y =
        0.7 * scale;

    flowerGroup.add(stem);

    for (let i = 0; i < 6; i++) {

        const angle =
            (i / 6) *
            Math.PI *
            2;

        const petalGeometry =
            new THREE.SphereGeometry(
                0.25 * scale,
                16,
                12
            );

        const petalMaterial =
            new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.18,
                roughness: 0.6
            });

        const petal =
            new THREE.Mesh(
                petalGeometry,
                petalMaterial
            );

        petal.scale.set(
            1,
            0.55,
            1
        );

        petal.position.set(
            Math.cos(angle) *
                0.28 *
                scale,

            1.42 *
                scale,

            Math.sin(angle) *
                0.28 *
                scale
        );

        flowerGroup.add(petal);
    }

    const centerGeometry =
        new THREE.SphereGeometry(
            0.16 * scale,
            16,
            16
        );

    const centerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffe99a,
            emissive: 0xffc85c,
            emissiveIntensity: 0.5
        });

    const center =
        new THREE.Mesh(
            centerGeometry,
            centerMaterial
        );

    center.position.y =
        1.42 * scale;

    flowerGroup.add(center);

    flowerGroup.position.set(
        x,
        y,
        z
    );

    flowerGroup.userData = {
        offset:
            Math.random() * 10
    };

    flowerGroup.scale.setScalar(
        scale
    );

    scene.add(
        flowerGroup
    );

    flowers.push(
        flowerGroup
    );
}


const flowerColors = [
    0xff83c8,
    0xffa4dd,
    0xc9a0ff,
    0xffd2ec,
    0xbca4ff
];

for (let i = 0; i < 55; i++) {

    const side =
        Math.random() > 0.5
            ? 1
            : -1;

    const x =
        side *
        (5 + Math.random() * 13);

    const z =
        -13 +
        Math.random() * 28;

    const color =
        flowerColors[
            Math.floor(
                Math.random() *
                flowerColors.length
            )
        ];

    createFlower(
        x,
        -2.4,
        z,
        0.45 +
            Math.random() * 0.5,
        color
    );
}


/* =========================================================
   TREES
========================================================= */

const trees = [];

function createTree(
    x,
    z,
    scale = 1
) {

    const tree =
        new THREE.Group();

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.35 * scale,
            0.55 * scale,
            4 * scale,
            12
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2d1b27,
            roughness: 1
        });

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.position.y =
        -0.5;

    tree.add(trunk);

    for (let i = 0; i < 9; i++) {

        const leafGeometry =
            new THREE.SphereGeometry(
                (
                    1.2 +
                    Math.random() *
                    0.7
                ) * scale,
                20,
                16
            );

        const leafMaterial =
            new THREE.MeshStandardMaterial({
                color:
                    i % 2 === 0
                        ? 0x241936
                        : 0x352047,
                roughness: 0.95
            });

        const leaf =
            new THREE.Mesh(
                leafGeometry,
                leafMaterial
            );

        leaf.position.set(
            (
                Math.random() -
                0.5
            ) *
            3 *
            scale,

            1.5 +
                Math.random() *
                3 *
                scale,

            (
                Math.random() -
                0.5
            ) *
            3 *
            scale
        );

        tree.add(leaf);
    }

    tree.position.set(
        x,
        0,
        z
    );

    tree.userData = {
        offset:
            Math.random() * 10
    };

    scene.add(tree);

    trees.push(tree);
}


createTree(
    -12,
    -7,
    1.3
);

createTree(
    12,
    -9,
    1.5
);

createTree(
    -15,
    3,
    1.6
);

createTree(
    14,
    5,
    1.4
);

createTree(
    -11,
    13,
    1.1
);

createTree(
    11,
    14,
    1.2
);


/* =========================================================
   FIREFLIES
========================================================= */

const fireflies = [];

for (let i = 0; i < 90; i++) {

    const material =
        new THREE.SpriteMaterial({
            map: glowTexture,

            color:
                Math.random() > 0.5
                    ? 0xffd96a
                    : 0xff9edc,

            transparent: true,

            opacity:
                0.45 +
                Math.random() * 0.45,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });

    const sprite =
        new THREE.Sprite(
            material
        );

    const x =
        (
            Math.random() -
            0.5
        ) * 28;

    const y =
        -1 +
        Math.random() * 8;

    const z =
        -12 +
        Math.random() * 27;

    sprite.position.set(
        x,
        y,
        z
    );

    const size =
        0.12 +
        Math.random() * 0.18;

    sprite.scale.set(
        size,
        size,
        1
    );

    sprite.userData = {

        baseX: x,
        baseY: y,
        baseZ: z,

        offset:
            Math.random() * 20,

        speed:
            0.4 +
            Math.random() * 0.7
    };

    scene.add(sprite);

    fireflies.push(
        sprite
    );
}


/* =========================================================
   HEART TEXTURE
========================================================= */

function createHeartTexture() {

    const canvas =
        document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        256,
        256
    );

    ctx.beginPath();

    ctx.moveTo(
        128,
        210
    );

    ctx.bezierCurveTo(
        20,
        135,
        45,
        40,
        100,
        65
    );

    ctx.bezierCurveTo(
        125,
        75,
        128,
        95,
        128,
        95
    );

    ctx.bezierCurveTo(
        128,
        95,
        132,
        75,
        156,
        65
    );

    ctx.bezierCurveTo(
        212,
        40,
        236,
        135,
        128,
        210
    );

    ctx.closePath();

    const gradient =
        ctx.createLinearGradient(
            0,
            40,
            256,
            220
        );

    gradient.addColorStop(
        0,
        "#ffb6e5"
    );

    gradient.addColorStop(
        0.5,
        "#ff62b5"
    );

    gradient.addColorStop(
        1,
        "#a96cff"
    );

    ctx.fillStyle =
        gradient;

    ctx.shadowColor =
        "#ff72c8";

    ctx.shadowBlur = 25;

    ctx.fill();

    return new THREE.CanvasTexture(
        canvas
    );
}

const heartTexture =
    createHeartTexture();


/* =========================================================
   FLOATING HEARTS — SCENE 2
========================================================= */

const hearts = [];

for (let i = 0; i < 25; i++) {

    const material =
        new THREE.SpriteMaterial({
            map: heartTexture,

            transparent: true,

            opacity:
                0.25 +
                Math.random() * 0.4,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });

    const heart =
        new THREE.Sprite(
            material
        );

    const x =
        (
            Math.random() -
            0.5
        ) * 30;

    const y =
        -1 +
        Math.random() * 10;

    const z =
        -8 +
        Math.random() * 20;

    heart.position.set(
        x,
        y,
        z
    );

    const size =
        0.3 +
        Math.random() * 0.5;

    heart.scale.set(
        size,
        size,
        1
    );

    heart.userData = {

        baseX: x,
        baseY: y,
        baseZ: z,

        offset:
            Math.random() * 20,

        speed:
            0.3 +
            Math.random() * 0.6,

        rotation:
            (
                Math.random() -
                0.5
            ) * 0.003
    };

    scene.add(heart);

    hearts.push(
        heart
    );
}


/* =========================================================
   ROMANTIC GLOW ORBS — SCENE 2
========================================================= */

const orbs = [];

for (let i = 0; i < 18; i++) {

    const material =
        new THREE.SpriteMaterial({
            map: glowTexture,

            color:
                i % 2 === 0
                    ? 0xff7ac8
                    : 0x9d7aff,

            transparent: true,

            opacity: 0.15,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });

    const orb =
        new THREE.Sprite(
            material
        );

    orb.position.set(
        (
            Math.random() -
            0.5
        ) * 35,

        Math.random() * 10,

        -10 +
            Math.random() * 25
    );

    const size =
        1 +
        Math.random() * 3;

    orb.scale.set(
        size,
        size,
        1
    );

    orb.userData = {
        offset:
            Math.random() * 20
    };

    scene.add(orb);

    orbs.push(
        orb
    );
}


/* =========================================================
   BENCH
========================================================= */

const benchGroup =
    new THREE.Group();

const benchSeatGeometry =
    new THREE.BoxGeometry(
        5.2,
        0.38,
        1.25
    );

const benchWoodMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4a2940,
        roughness: 0.75,
        metalness: 0.05
    });

const benchSeat =
    new THREE.Mesh(
        benchSeatGeometry,
        benchWoodMaterial
    );

benchSeat.position.y = 0;

benchGroup.add(
    benchSeat
);


const backGeometry =
    new THREE.BoxGeometry(
        5.2,
        1.35,
        0.28
    );

const backrest =
    new THREE.Mesh(
        backGeometry,
        benchWoodMaterial
    );

backrest.position.set(
    0,
    0.85,
    0.48
);

benchGroup.add(
    backrest
);


for (const x of [-1.8, 1.8]) {

    const leg =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                1.8,
                0.55
            ),
            benchWoodMaterial
        );

    leg.position.set(
        x,
        -0.9,
        0
    );

    benchGroup.add(
        leg
    );
}


for (const x of [-2.35, 2.35]) {

    const arm =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                1.15,
                1.35
            ),
            benchWoodMaterial
        );

    arm.position.set(
        x,
        0.55,
        0
    );

    benchGroup.add(
        arm
    );
}


const benchGlow =
    new THREE.PointLight(
        0xff72c8,
        1.8,
        8
    );

benchGlow.position.set(
    0,
    1,
    0
);

benchGroup.add(
    benchGlow
);

benchGroup.position.set(
    0,
    -1.65,
    4
);

scene.add(
    benchGroup
);


/* =========================================================
   COUPLE
========================================================= */

function createPerson(
    x,
    scale = 1
) {

    const person =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.38 * scale,
                0.9 * scale,
                8,
                16
            ),

            new THREE.MeshStandardMaterial({
                color: 0x171323,
                roughness: 1
            })
        );

    body.position.y =
        0.75 * scale;

    person.add(
        body
    );

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.38 * scale,
                24,
                24
            ),

            new THREE.MeshStandardMaterial({
                color: 0x151120,
                roughness: 1
            })
        );

    head.position.y =
        1.75 * scale;

    person.add(
        head
    );

    const hair =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42 * scale,
                24,
                24
            ),

            new THREE.MeshStandardMaterial({
                color: 0x0d0a15,
                roughness: 1
            })
        );

    hair.scale.set(
        1.05,
        0.65,
        1.05
    );

    hair.position.y =
        1.95 * scale;

    person.add(
        hair
    );

    person.position.set(
        x,
        -1.55,
        4
    );

    return person;
}


const person1 =
    createPerson(
        -0.72,
        0.92
    );

const person2 =
    createPerson(
        0.72,
        0.98
    );

person1.rotation.y =
    -0.12;

person2.rotation.y =
    0.12;

scene.add(
    person1
);

scene.add(
    person2
);


/* =========================================================
   COUPLE HEART
========================================================= */

const coupleHeartMaterial =
    new THREE.SpriteMaterial({
        map: heartTexture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending:
            THREE.AdditiveBlending
    });

const coupleHeart =
    new THREE.Sprite(
        coupleHeartMaterial
    );

coupleHeart.scale.set(
    0.85,
    0.85,
    1
);

coupleHeart.position.set(
    0,
    3.8,
    4
);

scene.add(
    coupleHeart
);


/* =========================================================
   LANTERNS
========================================================= */

function createLantern(
    x,
    z
) {

    const lantern =
        new THREE.Group();

    const pole =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.07,
                0.1,
                2.5,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x211728,
                roughness: 0.8
            })
        );

    pole.position.y =
        -1.15;

    lantern.add(
        pole
    );

    const lamp =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.25,
                20,
                20
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffdca8,
                emissive: 0xffa84d,
                emissiveIntensity: 2
            })
        );

    lamp.position.y =
        0.15;

    lantern.add(
        lamp
    );

    const light =
        new THREE.PointLight(
            0xffa85c,
            1.5,
            5
        );

    light.position.y =
        0.15;

    lantern.add(
        light
    );

    lantern.position.set(
        x,
        0,
        z
    );

    scene.add(
        lantern
    );

    return light;
}


const lanternLights = [
    createLantern(
        -4.5,
        3.5
    ),

    createLantern(
        4.5,
        3.5
    )
];


/* =========================================================
   GROUND GLOW
========================================================= */

const groundGlowMaterial =
    new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xff75c8,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending:
            THREE.AdditiveBlending
    });

const groundGlow =
    new THREE.Sprite(
        groundGlowMaterial
    );

groundGlow.scale.set(
    12,
    4,
    1
);

groundGlow.position.set(
    0,
    -2.2,
    4
);

scene.add(
    groundGlow
);


/* =========================================================
   SCENE 2 MESSAGE
========================================================= */

const scene2Message =
    document.createElement(
        "div"
    );

scene2Message.style.position =
    "fixed";

scene2Message.style.left =
    "50%";

scene2Message.style.top =
    "72%";

scene2Message.style.transform =
    "translate(-50%, -50%)";

scene2Message.style.textAlign =
    "center";

scene2Message.style.color =
    "white";

scene2Message.style.fontFamily =
    "Georgia, serif";

scene2Message.style.fontSize =
    "clamp(20px, 3vw, 34px)";

scene2Message.style.letterSpacing =
    "1px";

scene2Message.style.lineHeight =
    "1.5";

scene2Message.style.maxWidth =
    "700px";

scene2Message.style.padding =
    "20px";

scene2Message.style.opacity =
    "0";

scene2Message.style.pointerEvents =
    "none";

scene2Message.style.zIndex =
    "20";

scene2Message.style.textShadow =
    "0 0 20px rgba(255,120,210,.7)";

scene2Message.innerHTML =
    "If the world feels a little heavy today...<br>" +
    "<span style='color:#ff9edc;'>come sit here with me for a while. ♥</span>";

document.body.appendChild(
    scene2Message
);


/* =========================================================
   SCENE 2 STATE
========================================================= */

let scene2Started = false;

let romanticMomentStarted =
    false;

let mouseX = 0;
let mouseY = 0;


/* =========================================================
   COME SIT WITH ME BUTTON
========================================================= */

const sitButton =
    document.createElement(
        "button"
    );

sitButton.innerHTML = `
    <span>Come sit with me</span>
    <strong>♥</strong>
`;

sitButton.style.position =
    "fixed";

sitButton.style.left =
    "50%";

sitButton.style.bottom =
    "9%";

sitButton.style.transform =
    "translateX(-50%)";

sitButton.style.zIndex =
    "30";

sitButton.style.padding =
    "15px 28px";

sitButton.style.borderRadius =
    "40px";

sitButton.style.border =
    "1px solid rgba(255,190,230,.45)";

sitButton.style.background =
    "rgba(35,15,45,.55)";

sitButton.style.backdropFilter =
    "blur(15px)";

sitButton.style.webkitBackdropFilter =
    "blur(15px)";

sitButton.style.color =
    "#fff";

sitButton.style.fontFamily =
    "Georgia, serif";

sitButton.style.fontSize =
    "18px";

sitButton.style.letterSpacing =
    "1px";

sitButton.style.boxShadow =
    "0 0 30px rgba(255,100,200,.25)";

sitButton.style.cursor =
    "pointer";

sitButton.style.opacity =
    "0";

sitButton.style.pointerEvents =
    "none";

sitButton.style.transition =
    "opacity 1.5s ease, transform .3s ease, box-shadow .3s ease";

document.body.appendChild(
    sitButton
);


/* =========================================================
   BUTTON HOVER
========================================================= */

sitButton.addEventListener(
    "mouseenter",
    () => {

        sitButton.style.transform =
            "translateX(-50%) scale(1.06)";

        sitButton.style.boxShadow =
            "0 0 40px rgba(255,100,200,.45)";
    }
);

sitButton.addEventListener(
    "mouseleave",
    () => {

        sitButton.style.transform =
            "translateX(-50%) scale(1)";

        sitButton.style.boxShadow =
            "0 0 30px rgba(255,100,200,.25)";
    }
);


/* =========================================================
   SCENE 2 START BUTTON
========================================================= */

const startButton =
    document.getElementById(
        "startButton"
    );

if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            if (scene2Started)
                return;

            scene2Started = true;

            document.body.classList.add(
                "scene-changing"
            );

            setTimeout(
                () => {

                    const scene1 =
                        document.getElementById(
                            "scene1"
                        );

                    const scene2 =
                        document.getElementById(
                            "scene2"
                        );

                    if (scene1)
                        scene1.style.display =
                            "none";

                    if (scene2)
                        scene2.style.display =
                            "none";

                },
                1200
            );

            const startPosition =
                camera.position.clone();

            const targetPosition =
                new THREE.Vector3(
                    0,
                    3.2,
                    15
                );

            const startTime =
                performance.now();

            const duration =
                2600;

            function moveCamera(
                time
            ) {

                const progress =
                    Math.min(
                        (
                            time -
                            startTime
                        ) /
                        duration,
                        1
                    );

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );

                camera.position.lerpVectors(
                    startPosition,
                    targetPosition,
                    eased
                );

                if (progress < 1) {

                    requestAnimationFrame(
                        moveCamera
                    );

                } else {

                    showScene2Message();
                }
            }

            requestAnimationFrame(
                moveCamera
            );
        }
    );
}


/* =========================================================
   SHOW SCENE 2 MESSAGE
========================================================= */

function showScene2Message() {

    scene2Message.style.transition =
        "opacity 1.5s ease, transform 1.5s ease";

    scene2Message.style.opacity =
        "1";

    scene2Message.style.transform =
        "translate(-50%, -50%)";

    setTimeout(
        () => {

            scene2Message.style.opacity =
                "0";

            setTimeout(
                () => {

                    if (
                        !romanticMomentStarted
                    ) {

                        sitButton.style.opacity =
                            "1";

                        sitButton.style.pointerEvents =
                            "auto";
                    }

                },
                1200
            );

        },
        4000
    );
}


/* =========================================================
   COME SIT BUTTON CLICK
========================================================= */

sitButton.addEventListener(
    "click",
    () => {

        if (romanticMomentStarted)
            return;

        romanticMomentStarted = true;

        sitButton.style.opacity =
            "0";

        sitButton.style.pointerEvents =
            "none";

        controls.autoRotate =
            false;

        controls.target.set(
            0,
            0.5,
            4
        );

        const startCamera =
            camera.position.clone();

        const endCamera =
            new THREE.Vector3(
                0,
                2.7,
                10.5
            );

        const startTarget =
            controls.target.clone();

        const endTarget =
            new THREE.Vector3(
                0,
                0.8,
                4
            );

        const startTime =
            performance.now();

        const duration =
            2200;

        function cinematicCamera(
            time
        ) {

            const progress =
                Math.min(
                    (
                        time -
                        startTime
                    ) /
                    duration,
                    1
                );

            const eased =
                progress < 0.5
                    ? 2 *
                      progress *
                      progress

                    : 1 -
                      Math.pow(
                          -2 *
                          progress +
                          2,
                          2
                      ) /
                      2;

            camera.position.lerpVectors(
                startCamera,
                endCamera,
                eased
            );

            controls.target.lerpVectors(
                startTarget,
                endTarget,
                eased
            );

            controls.update();

            if (progress < 1) {

                requestAnimationFrame(
                    cinematicCamera
                );

            } else {

                showRomanticMoment();
            }
        }

        requestAnimationFrame(
            cinematicCamera
        );
    }
);


/* =========================================================
   ROMANTIC MOMENT MESSAGE
========================================================= */

const romanticMoment =
    document.createElement(
        "div"
    );

romanticMoment.style.position =
    "fixed";

romanticMoment.style.left =
    "50%";

romanticMoment.style.top =
    "19%";

romanticMoment.style.transform =
    "translate(-50%, 20px)";

romanticMoment.style.width =
    "90%";

romanticMoment.style.maxWidth =
    "720px";

romanticMoment.style.textAlign =
    "center";

romanticMoment.style.zIndex =
    "25";

romanticMoment.style.color =
    "#fff";

romanticMoment.style.fontFamily =
    "Georgia, serif";

romanticMoment.style.opacity =
    "0";

romanticMoment.style.pointerEvents =
    "none";

romanticMoment.style.transition =
    "opacity 2s ease, transform 2s ease";

romanticMoment.style.textShadow =
    "0 0 25px rgba(255,110,210,.7)";

romanticMoment.innerHTML = `
    <div style="
        font-size:clamp(15px,2vw,20px);
        letter-spacing:3px;
        opacity:.75;
        margin-bottom:14px;
    ">
        JUST FOR A MOMENT
    </div>

    <div style="
        font-size:clamp(25px,4vw,42px);
        line-height:1.35;
    ">
        Forget everything else...
        <br>
        <span style="color:#ff9edc;">
            just stay here with me. ♥
        </span>
    </div>
`;

document.body.appendChild(
    romanticMoment
);


/* =========================================================
   SHOW ROMANTIC MOMENT
========================================================= */

function showRomanticMoment() {

    romanticMoment.style.opacity =
        "1";

    romanticMoment.style.transform =
        "translate(-50%, 0)";

    coupleHeart.material.opacity =
        1;

    coupleHeart.scale.set(
        1.05,
        1.05,
        1
    );

    pinkLight.intensity =
        3.8;

    purpleLight.intensity =
        2.8;

    fireflies.forEach(
        (fly) => {

            fly.material.opacity =
                0.7;
        }
    );

    setTimeout(
        () => {

            romanticMoment.style.opacity =
                "0";

            romanticMoment.style.transform =
                "translate(-50%, -20px)";

            setTimeout(
                () => {

                    startScene2FinalMoment();

                },
                1800
            );

        },
        5000
    );
}


/* =========================================================
   SCENE 2 FINAL CAMERA MOMENT
========================================================= */

function startScene2FinalMoment() {

    const startPosition =
        camera.position.clone();

    const finalPosition =
        new THREE.Vector3(
            0,
            4.2,
            13
        );

    const startTime =
        performance.now();

    const duration =
        3000;

    function cinematicMove(
        time
    ) {

        const progress =
            Math.min(
                (
                    time -
                    startTime
                ) /
                duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        camera.position.lerpVectors(
            startPosition,
            finalPosition,
            eased
        );

        const heartScale =
            1.05 +
            eased * 0.35;

        coupleHeart.scale.set(
            heartScale,
            heartScale,
            1
        );

        if (progress < 1) {

            requestAnimationFrame(
                cinematicMove
            );

        } else {

            showScene2Ending();
        }
    }

    requestAnimationFrame(
        cinematicMove
    );
}


/* =========================================================
   SCENE 2 ENDING
========================================================= */

function showScene2Ending() {

    const ending =
        document.createElement(
            "div"
        );

    ending.style.position =
        "fixed";

    ending.style.left =
        "50%";

    ending.style.top =
        "50%";

    ending.style.transform =
        "translate(-50%, -50%)";

    ending.style.width =
        "90%";

    ending.style.maxWidth =
        "700px";

    ending.style.textAlign =
        "center";

    ending.style.color =
        "white";

    ending.style.fontFamily =
        "Georgia, serif";

    ending.style.fontSize =
        "clamp(24px, 4vw, 42px)";

    ending.style.lineHeight =
        "1.5";

    ending.style.zIndex =
        "40";

    ending.style.opacity =
        "0";

    ending.style.transition =
        "opacity 2s ease";

    ending.style.textShadow =
        "0 0 30px rgba(255,120,210,.8)";

    ending.innerHTML = `
        <div style="
            font-size:16px;
            letter-spacing:4px;
            opacity:.7;
            margin-bottom:18px;
        ">
            ONE LITTLE THING...
        </div>

        <div>
            You don't have to be happy
            <br>
            <span style="color:#ff9edc;">
                all the time.
            </span>
        </div>

        <div style="
            margin-top:20px;
            font-size:20px;
            color:#ffd5ed;
        ">
            Just remember...
            you're never alone here. ♥
        </div>
    `;

    document.body.appendChild(
        ending
    );

    setTimeout(
        () => {

            ending.style.opacity =
                "1";

        },
        100
    );

    setTimeout(
        () => {

            ending.style.opacity =
                "0";

            setTimeout(
                () => {

                    ending.remove();

                    startScene3();

                },
                1800
            );

        },
        7000
    );
}


/* =========================================================
   SCENE 3 VARIABLES
========================================================= */

let scene3Started =
    false;

let scene3Group =
    new THREE.Group();

scene.add(
    scene3Group
);

const scene3Objects = [];
const scene3Hearts = [];
const scene3Orbs = [];


/* =========================================================
   NEW SCENE 3 INTERACTION STATE
========================================================= */

let scene3ClickedCount = 0;

let scene3Completed = false;

let scene3Merging = false;

let scene3PointerDown = false;

let scene3PointerStartX = 0;

let scene3PointerStartY = 0;

let scene3MessageTimeout = null;

const scene3Raycaster =
    new THREE.Raycaster();

const scene3Pointer =
    new THREE.Vector2();


/* =========================================================
   CREATE SCENE 3
========================================================= */

function createScene3() {

    scene.background =
        new THREE.Color(
            0x080316
        );

    scene.fog =
        new THREE.FogExp2(
            0x080316,
            0.012
        );


    /* -----------------------------------------------------
       GALAXY PARTICLES
    ----------------------------------------------------- */

    const galaxyGeometry =
        new THREE.BufferGeometry();

    const galaxyPositions = [];

    for (let i = 0; i < 1800; i++) {

        const radius =
            5 +
            Math.random() * 35;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const height =
            (
                Math.random() -
                0.5
            ) * 15;

        galaxyPositions.push(
            Math.cos(angle) *
                radius,

            height,

            Math.sin(angle) *
                radius
        );
    }

    galaxyGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            galaxyPositions,
            3
        )
    );

    const galaxyMaterial =
        new THREE.PointsMaterial({
            color: 0xffc7ee,
            size: 0.09,
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });

    const galaxy =
        new THREE.Points(
            galaxyGeometry,
            galaxyMaterial
        );

    scene3Group.add(
        galaxy
    );

    scene3Objects.push(
        galaxy
    );


    /* -----------------------------------------------------
       CENTRAL GLOW
    ----------------------------------------------------- */

    const centerGlowMaterial =
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xff65bd,
            transparent: true,
            opacity: 0.25,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    const centerGlow =
        new THREE.Sprite(
            centerGlowMaterial
        );

    centerGlow.scale.set(
        15,
        15,
        1
    );

    centerGlow.position.set(
        0,
        1,
        0
    );

    scene3Group.add(
        centerGlow
    );

    scene3Objects.push(
        centerGlow
    );


    /* -----------------------------------------------------
       CENTRAL HEART
    ----------------------------------------------------- */

    const universeHeartMaterial =
        new THREE.SpriteMaterial({
            map: heartTexture,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    const universeHeart =
        new THREE.Sprite(
            universeHeartMaterial
        );

    universeHeart.scale.set(
        2.2,
        2.2,
        1
    );

    universeHeart.position.set(
        0,
        1,
        0
    );

    universeHeart.userData.baseY =
        1;

    scene3Group.add(
        universeHeart
    );

    scene3Objects.push(
        universeHeart
    );


    /* -----------------------------------------------------
       THREE FLOATING MEMORY HEARTS
    ----------------------------------------------------- */

    createMemoryHeart(
        -5,
        1.5,
        0,
        "Your Smile",
        "Even on difficult days, your smile still feels like a little piece of sunshine."
    );

    createMemoryHeart(
        5,
        1.5,
        0,
        "Your Presence",
        "You don't have to do anything special. Just being you is enough."
    );

    createMemoryHeart(
        0,
        -3,
        1,
        "Our Story",
        "This isn't the end of our little story... it's just another beautiful chapter."
    );


    /* -----------------------------------------------------
       FLOATING ORBS
    ----------------------------------------------------- */

    for (let i = 0; i < 12; i++) {

        const orbMaterial =
            new THREE.SpriteMaterial({
                map: glowTexture,

                color:
                    i % 2 === 0
                        ? 0xff72c8
                        : 0x9f83ff,

                transparent: true,

                opacity:
                    0.15 +
                    Math.random() * 0.2,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });

        const orb =
            new THREE.Sprite(
                orbMaterial
            );

        const radius =
            7 +
            Math.random() * 10;

        const angle =
            Math.random() *
            Math.PI *
            2;

        orb.position.set(
            Math.cos(angle) *
                radius,

            (
                Math.random() -
                0.5
            ) * 10,

            Math.sin(angle) *
                radius
        );

        const size =
            0.5 +
            Math.random() *
            1.5;

        orb.scale.set(
            size,
            size,
            1
        );

        orb.userData = {

            angle: angle,

            radius: radius,

            speed:
                0.08 +
                Math.random() *
                0.12,

            height:
                orb.position.y
        };

        scene3Group.add(
            orb
        );

        scene3Orbs.push(
            orb
        );
    }
}


/* =========================================================
   MEMORY HEART CREATOR
========================================================= */

function createMemoryHeart(
    x,
    y,
    z,
    title,
    message
) {

    const material =
        new THREE.SpriteMaterial({
            map: heartTexture,

            transparent: true,

            opacity: 0.85,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });

    const heart =
        new THREE.Sprite(
            material
        );

    heart.position.set(
        x,
        y,
        z
    );

    heart.scale.set(
        1.35,
        1.35,
        1
    );

    heart.userData = {

        title: title,

        message: message,

        baseX: x,

        baseY: y,

        baseZ: z,

        offset:
            Math.random() * 10,

        hovered: false,

        clicked: false,

        originalScale: 1.35,

        targetScale: 1.35,

        mergeStart:
            null
    };

    scene3Group.add(
        heart
    );

    scene3Hearts.push(
        heart
    );
}


/* =========================================================
   SCENE 3 UI — MEMORY MESSAGE
========================================================= */

const scene3MemoryUI =
    document.createElement(
        "div"
    );

scene3MemoryUI.style.position =
    "fixed";

scene3MemoryUI.style.left =
    "50%";

scene3MemoryUI.style.top =
    "50%";

scene3MemoryUI.style.transform =
    "translate(-50%, -50%) scale(.92)";

scene3MemoryUI.style.width =
    "min(88%, 620px)";

scene3MemoryUI.style.padding =
    "28px 26px";

scene3MemoryUI.style.boxSizing =
    "border-box";

scene3MemoryUI.style.textAlign =
    "center";

scene3MemoryUI.style.color =
    "#fff";

scene3MemoryUI.style.fontFamily =
    "Georgia, serif";

scene3MemoryUI.style.background =
    "rgba(18, 7, 31, .72)";

scene3MemoryUI.style.border =
    "1px solid rgba(255,175,225,.28)";

scene3MemoryUI.style.borderRadius =
    "28px";

scene3MemoryUI.style.backdropFilter =
    "blur(18px)";

scene3MemoryUI.style.webkitBackdropFilter =
    "blur(18px)";

scene3MemoryUI.style.boxShadow =
    "0 0 60px rgba(255,80,190,.22)";

scene3MemoryUI.style.opacity =
    "0";

scene3MemoryUI.style.pointerEvents =
    "none";

scene3MemoryUI.style.zIndex =
    "100";

scene3MemoryUI.style.transition =
    "opacity .6s ease, transform .6s ease";

document.body.appendChild(
    scene3MemoryUI
);


/* =========================================================
   SCENE 3 PROGRESS UI
========================================================= */

const scene3Progress =
    document.createElement(
        "div"
    );

scene3Progress.style.position =
    "fixed";

scene3Progress.style.top =
    "28px";

scene3Progress.style.left =
    "50%";

scene3Progress.style.transform =
    "translateX(-50%)";

scene3Progress.style.zIndex =
    "80";

scene3Progress.style.color =
    "rgba(255,230,248,.75)";

scene3Progress.style.fontFamily =
    "Georgia, serif";

scene3Progress.style.fontSize =
    "13px";

scene3Progress.style.letterSpacing =
    "3px";

scene3Progress.style.opacity =
    "0";

scene3Progress.style.transition =
    "opacity 1s ease";

scene3Progress.style.pointerEvents =
    "none";

scene3Progress.innerHTML =
    "DISCOVER THE THREE LITTLE THINGS • 0 / 3";

document.body.appendChild(
    scene3Progress
);


/* =========================================================
   SCENE 3 HINT
========================================================= */

const scene3Hint =
    document.createElement(
        "div"
    );

scene3Hint.style.position =
    "fixed";

scene3Hint.style.left =
    "50%";

scene3Hint.style.bottom =
    "30px";

scene3Hint.style.transform =
    "translateX(-50%)";

scene3Hint.style.zIndex =
    "80";

scene3Hint.style.color =
    "rgba(255,220,245,.65)";

scene3Hint.style.fontFamily =
    "Georgia, serif";

scene3Hint.style.fontSize =
    "14px";

scene3Hint.style.letterSpacing =
    "1px";

scene3Hint.style.textAlign =
    "center";

scene3Hint.style.opacity =
    "0";

scene3Hint.style.transition =
    "opacity 1s ease";

scene3Hint.style.pointerEvents =
    "none";

scene3Hint.innerHTML =
    "Tap the glowing hearts to discover them ♥";

document.body.appendChild(
    scene3Hint
);


/* =========================================================
   SHOW MEMORY
========================================================= */

function showScene3Memory(
    heart
) {

    if (!scene3Started)
        return;

    if (!heart)
        return;


    if (
        scene3MessageTimeout
    ) {

        clearTimeout(
            scene3MessageTimeout
        );
    }


    scene3MemoryUI.innerHTML = `

        <div style="
            font-size:12px;
            letter-spacing:4px;
            opacity:.6;
            margin-bottom:14px;
        ">
            A LITTLE MEMORY
        </div>

        <div style="
            font-size:clamp(28px,5vw,44px);
            line-height:1.2;
            color:#ffb3e5;
            text-shadow:
                0 0 25px rgba(255,100,200,.7);
            margin-bottom:16px;
        ">
            ${heart.userData.title}
        </div>

        <div style="
            font-size:clamp(16px,2.5vw,21px);
            line-height:1.7;
            color:rgba(255,245,251,.9);
        ">
            ${heart.userData.message}
        </div>

    `;


    scene3MemoryUI.style.opacity =
        "1";

    scene3MemoryUI.style.transform =
        "translate(-50%, -50%) scale(1)";


    scene3MessageTimeout =
        setTimeout(
            () => {

                scene3MemoryUI.style.opacity =
                    "0";

                scene3MemoryUI.style.transform =
                    "translate(-50%, -50%) scale(.92)";

            },
            3000
        );
}


/* =========================================================
   CLICK MEMORY HEART
========================================================= */

function clickMemoryHeart(
    heart
) {

    if (!scene3Started)
        return;

    if (scene3Completed)
        return;

    if (scene3Merging)
        return;

    if (!heart)
        return;

    if (
        heart.userData.clicked
    ) {

        showScene3Memory(
            heart
        );

        return;
    }


    heart.userData.clicked =
        true;

    scene3ClickedCount++;


    /* Make clicked heart brighter */

    heart.material.opacity =
        1;

    heart.material.color.set(
        0xffb7e8
    );


    heart.userData.targetScale =
        1.7;


    /* Small bounce */

    setTimeout(
        () => {

            if (
                !scene3Merging
            ) {

                heart.userData.targetScale =
                    1.45;
            }

        },
        400
    );


    /* Show message */

    showScene3Memory(
        heart
    );


    /* Update progress */

    scene3Progress.innerHTML =
        `
        DISCOVER THE THREE LITTLE THINGS •
        ${scene3ClickedCount} / 3
        `;


    /* All 3 discovered */

    if (
        scene3ClickedCount === 3
    ) {

        setTimeout(
            () => {

                beginScene3HeartMerge();

            },
            2500
        );
    }
}


/* =========================================================
   RAYCASTER POINTER POSITION
========================================================= */

function updateScene3Pointer(
    clientX,
    clientY
) {

    const rect =
        renderer.domElement.getBoundingClientRect();

    scene3Pointer.x =
        (
            (
                clientX -
                rect.left
            ) /
            rect.width
        ) * 2 - 1;

    scene3Pointer.y =
        -(
            (
                clientY -
                rect.top
            ) /
            rect.height
        ) * 2 + 1;
}


/* =========================================================
   GET HEART UNDER POINTER
========================================================= */

function getScene3HeartAtPointer() {

    scene3Raycaster.setFromCamera(
        scene3Pointer,
        camera
    );

    const intersections =
        scene3Raycaster.intersectObjects(
            scene3Hearts,
            false
        );

    if (
        intersections.length === 0
    ) {

        return null;
    }

    return intersections[0].object;
}


/* =========================================================
   POINTER DOWN
========================================================= */

renderer.domElement.addEventListener(
    "pointerdown",
    (event) => {

        if (!scene3Started)
            return;

        scene3PointerDown =
            true;

        scene3PointerStartX =
            event.clientX;

        scene3PointerStartY =
            event.clientY;
    }
);


/* =========================================================
   POINTER UP — CLICK / TOUCH
========================================================= */

renderer.domElement.addEventListener(
    "pointerup",
    (event) => {

        if (!scene3Started)
            return;

        if (!scene3PointerDown)
            return;

        scene3PointerDown =
            false;


        const distance =
            Math.sqrt(
                Math.pow(
                    event.clientX -
                    scene3PointerStartX,
                    2
                ) +
                Math.pow(
                    event.clientY -
                    scene3PointerStartY,
                    2
                )
            );


        /*
           If user dragged the camera,
           don't count it as a click.
        */

        if (distance > 12)
            return;


        updateScene3Pointer(
            event.clientX,
            event.clientY
        );


        const heart =
            getScene3HeartAtPointer();


        if (heart) {

            clickMemoryHeart(
                heart
            );
        }
    }
);


/* =========================================================
   POINTER MOVE — HOVER
========================================================= */

renderer.domElement.addEventListener(
    "pointermove",
    (event) => {

        if (!scene3Started)
            return;

        updateScene3Pointer(
            event.clientX,
            event.clientY
        );


        const heart =
            getScene3HeartAtPointer();


        scene3Hearts.forEach(
            (item) => {

                item.userData.hovered =
                    item === heart;
            }
        );


        if (heart) {

            renderer.domElement.style.cursor =
                "pointer";

        } else {

            renderer.domElement.style.cursor =
                "default";
        }
    }
);


/* =========================================================
   SCENE 3 HEART MERGE
========================================================= */

function beginScene3HeartMerge() {

    if (scene3Merging)
        return;

    scene3Merging =
        true;


    if (scene3MessageTimeout) {

        clearTimeout(
            scene3MessageTimeout
        );
    }


    scene3MemoryUI.style.opacity =
        "0";

    scene3Hint.style.opacity =
        "0";

    scene3Progress.style.opacity =
        "0";


    /* Stop camera rotation */

    controls.autoRotate =
        false;


    /* Save merge start */

    scene3Hearts.forEach(
        (heart) => {

            heart.userData.mergeStart =
                heart.position.clone();

            heart.userData.mergeStartTime =
                performance.now() +
                Math.random() * 250;

        }
    );


    animateScene3Merge();
}


/* =========================================================
   ANIMATE HEART MERGE
========================================================= */

function animateScene3Merge() {

    const now =
        performance.now();

    let finished =
        true;


    scene3Hearts.forEach(
        (heart) => {

            const data =
                heart.userData;

            const delay =
                data.mergeStartTime -
                (
                    now -
                    1200
                );


            let progress =
                (
                    now -
                    data.mergeStartTime
                ) /
                1800;


            if (progress < 0) {

                finished =
                    false;

                return;
            }


            progress =
                Math.min(
                    progress,
                    1
                );


            const eased =
                progress < 0.5
                    ? 2 *
                      progress *
                      progress

                    : 1 -
                      Math.pow(
                          -2 *
                          progress +
                          2,
                          2
                      ) /
                      2;


            const start =
                data.mergeStart;


            heart.position.x =
                THREE.MathUtils.lerp(
                    start.x,
                    0,
                    eased
                );

            heart.position.y =
                THREE.MathUtils.lerp(
                    start.y,
                    1,
                    eased
                );

            heart.position.z =
                THREE.MathUtils.lerp(
                    start.z,
                    0,
                    eased
                );


            const scale =
                1.45 +
                eased * 0.9;


            heart.scale.set(
                scale,
                scale,
                1
            );


            heart.material.opacity =
                1;


            if (
                progress < 1
            ) {

                finished =
                    false;
            }
        }
    );


    if (!finished) {

        requestAnimationFrame(
            animateScene3Merge
        );

        return;
    }


    /* Hide the 3 small hearts */

    scene3Hearts.forEach(
        (heart) => {

            heart.material.opacity =
                0;
        }
    );


    createFinalScene3Heart();

}


/* =========================================================
   FINAL GIANT HEART
========================================================= */

function createFinalScene3Heart() {

    const finalMaterial =
        new THREE.SpriteMaterial({
            map: heartTexture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });


    const finalHeart =
        new THREE.Sprite(
            finalMaterial
        );


    finalHeart.position.set(
        0,
        1,
        0
    );


    finalHeart.scale.set(
        0.1,
        0.1,
        1
    );


    scene3Group.add(
        finalHeart
    );


    scene3Objects.push(
        finalHeart
    );


    const startTime =
        performance.now();


    function revealFinalHeart(
        time
    ) {

        const progress =
            Math.min(
                (
                    time -
                    startTime
                ) / 1800,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const scale =
            0.1 +
            eased * 3.4;


        finalHeart.scale.set(
            scale,
            scale,
            1
        );


        finalHeart.material.opacity =
            eased;


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                revealFinalHeart
            );

        } else {

            showScene3FinalMessage(
                finalHeart
            );
        }
    }


    requestAnimationFrame(
        revealFinalHeart
    );
}


/* =========================================================
   FINAL SCENE 3 MESSAGE
========================================================= */

function showScene3FinalMessage(
    finalHeart
) {

    scene3Completed =
        true;


    const finalUI =
        document.createElement(
            "div"
        );


    finalUI.style.position =
        "fixed";

    finalUI.style.left =
        "50%";

    finalUI.style.top =
        "72%";

    finalUI.style.transform =
        "translate(-50%, 30px)";

    finalUI.style.width =
        "90%";

    finalUI.style.maxWidth =
        "700px";

    finalUI.style.textAlign =
        "center";

    finalUI.style.color =
        "#fff";

    finalUI.style.fontFamily =
        "Georgia, serif";

    finalUI.style.zIndex =
        "110";

    finalUI.style.opacity =
        "0";

    finalUI.style.transition =
        "opacity 1.8s ease, transform 1.8s ease";

    finalUI.style.textShadow =
        "0 0 30px rgba(255,120,210,.8)";


    finalUI.innerHTML = `

        <div style="
            font-size:13px;
            letter-spacing:4px;
            opacity:.65;
            margin-bottom:14px;
        ">
            THREE LITTLE THINGS
        </div>

        <div style="
            font-size:clamp(24px,4vw,40px);
            line-height:1.35;
        ">
            And somehow...
            <br>

            <span style="
                color:#ff9edc;
            ">
                they all lead back to you. ♥
            </span>
        </div>

        <div style="
            margin-top:14px;
            font-size:clamp(15px,2vw,19px);
            opacity:.75;
            line-height:1.6;
        ">
            Your smile. Your presence.
            Our story.
        </div>

        <button
            id="scene3ContinueButton"
            style="
                margin-top:25px;
                padding:14px 27px;
                border-radius:40px;
                border:1px solid rgba(255,190,230,.45);
                background:rgba(255,120,210,.14);
                color:white;
                font-family:Georgia,serif;
                font-size:16px;
                letter-spacing:1px;
                cursor:pointer;
                box-shadow:0 0 30px rgba(255,100,210,.28);
                backdrop-filter:blur(12px);
                -webkit-backdrop-filter:blur(12px);
                transition:transform .3s ease,
                           box-shadow .3s ease,
                           background .3s ease;
            "
        >
            One More Surprise ♥
        </button>

    `;


    document.body.appendChild(
        finalUI
    );


    setTimeout(
        () => {

            finalUI.style.opacity =
                "1";

            finalUI.style.transform =
                "translate(-50%, 0)";

        },
        200
    );


    const continueButton =
        document.getElementById(
            "scene3ContinueButton"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "mouseenter",
            () => {

                continueButton.style.transform =
                    "scale(1.07)";

                continueButton.style.boxShadow =
                    "0 0 45px rgba(255,100,210,.5)";

                continueButton.style.background =
                    "rgba(255,120,210,.25)";
            }
        );


        continueButton.addEventListener(
            "mouseleave",
            () => {

                continueButton.style.transform =
                    "scale(1)";

                continueButton.style.boxShadow =
                    "0 0 30px rgba(255,100,210,.28)";

                continueButton.style.background =
                    "rgba(255,120,210,.14)";
            }
        );


continueButton.addEventListener(
    "click",
    () => {

        finalUI.style.opacity =
            "0";

        finalUI.style.transform =
            "translate(-50%, 30px)";

        finalHeart.material.opacity =
            "0.4";

        setTimeout(
            () => {

                startScene4();

            },
            1000
        );
    }
);


    }
}


/* =========================================================
   SCENE 4 PLACEHOLDER
========================================================= */


/* =========================================================
   SCENE 4 — MAGICAL 3D GIFT REVEAL
========================================================= */

let scene4Started = false;
let scene4Opened = false;
let scene4Opening = false;


const scene4Group = new THREE.Group();
scene.add(scene4Group);

let scene4Gift = null;
let scene4GiftLid = null;
let scene4GiftRibbon = null;
let scene4GiftGlow = null;

const scene4Sparkles = [];
const scene4Hearts = [];

let scene4FinalUI = null;

/* =========================================================
   SCENE 5 — A LETTER FOR YOU
========================================================= */

let scene5Started = false;
let scene5Opened = false;
let scene5Opening = false;

const scene5Group = new THREE.Group();
scene.add(scene5Group);

let scene5Envelope = null;
let scene5Letter = null;
let scene5LetterGlow = null;

const scene5Sparkles = [];
const scene5Hearts = [];

let scene5UI = null;
let scene5FinalHeart = null;


/* =========================================================
   CREATE SCENE 4
========================================================= */

function startScene4() {

    if (scene4Started)
        return;

    scene4Started = true;

    /* ---------------------------------------------
       Hide Scene 3
    --------------------------------------------- */

    const scene3 =
        document.getElementById("scene3");

    if (scene3) {
        scene3.style.opacity = "0";
        scene3.style.transition = "opacity 1.8s ease";
    }


    /* ---------------------------------------------
       Dark magical background
    --------------------------------------------- */

    scene.background =
        new THREE.Color(0x05020d);

    scene.fog =
        new THREE.FogExp2(
            0x05020d,
            0.014
        );


    /* ---------------------------------------------
       Scene 4 lighting
    --------------------------------------------- */

    pinkLight.intensity = 2.5;
    purpleLight.intensity = 2.8;


    /* ---------------------------------------------
       Camera
    --------------------------------------------- */

    camera.position.set(
        0,
        2.5,
        15
    );

    controls.target.set(
        0,
        0.8,
        0
    );

    controls.autoRotate = false;

    controls.update();


    /* ---------------------------------------------
       Create Gift
    --------------------------------------------- */

    createScene4Gift();

    createScene4Sparkles();

    createScene4Hearts();


    /* ---------------------------------------------
       Intro UI
    --------------------------------------------- */

    showScene4Intro();


    setTimeout(() => {

        if (scene3)
            scene3.style.display = "none";

    }, 1800);
}


/* =========================================================
   3D GIFT BOX
========================================================= */

function createScene4Gift() {

    const giftGroup =
        new THREE.Group();

    giftGroup.position.set(
        0,
        -1.1,
        0
    );

    scene4Group.add(
        giftGroup
    );

    scene4Gift =
        giftGroup;


    /* ---------------------------------------------
       BOX BODY
    --------------------------------------------- */

    const boxMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc43b83,
            roughness: 0.35,
            metalness: 0.15,
            emissive: 0x5c123d,
            emissiveIntensity: 0.35
        });

    const box =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.5,
                3.2,
                4.5
            ),
            boxMaterial
        );

    box.position.y =
        0;

    giftGroup.add(
        box
    );


    /* ---------------------------------------------
       BOX TOP / LID
    --------------------------------------------- */

    const lidGroup =
        new THREE.Group();

    lidGroup.position.set(
        0,
        1.7,
        0
    );

    giftGroup.add(
        lidGroup
    );

    scene4GiftLid =
        lidGroup;


    const lidMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xe95b9f,
            roughness: 0.3,
            metalness: 0.15,
            emissive: 0x711445,
            emissiveIntensity: 0.3
        });

    const lid =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.9,
                0.65,
                4.9
            ),
            lidMaterial
        );

    lid.position.y = 0;

    lidGroup.add(
        lid
    );


    /* ---------------------------------------------
       GOLDEN / PINK RIBBON
    --------------------------------------------- */

    const ribbonMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffd6ed,
            roughness: 0.25,
            metalness: 0.2,
            emissive: 0xff7fc9,
            emissiveIntensity: 0.4
        });


    /* Vertical ribbon */

    const verticalRibbon =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.65,
                3.35,
                4.56
            ),
            ribbonMaterial
        );

    verticalRibbon.position.y = 0;

    giftGroup.add(
        verticalRibbon
    );


    /* Horizontal ribbon */

    const horizontalRibbon =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.56,
                3.35,
                0.65
            ),
            ribbonMaterial
        );

    horizontalRibbon.position.y = 0;

    giftGroup.add(
        horizontalRibbon
    );


    scene4GiftRibbon =
        ribbonMaterial;


    /* ---------------------------------------------
       BOW
    --------------------------------------------- */

    const bowGroup =
        new THREE.Group();

    bowGroup.position.set(
        0,
        2.12,
        0
    );

    lidGroup.add(
        bowGroup
    );


    const bowMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffa8d7,
            roughness: 0.25,
            metalness: 0.1,
            emissive: 0xff55aa,
            emissiveIntensity: 0.4
        });


    const leftBow =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.85,
                24,
                18
            ),
            bowMaterial
        );

    leftBow.scale.set(
        1.35,
        0.65,
        0.45
    );

    leftBow.position.x =
        -0.75;

    leftBow.rotation.z =
        -0.25;

    bowGroup.add(
        leftBow
    );


    const rightBow =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.85,
                24,
                18
            ),
            bowMaterial
        );

    rightBow.scale.set(
        1.35,
        0.65,
        0.45
    );

    rightBow.position.x =
        0.75;

    rightBow.rotation.z =
        0.25;

    bowGroup.add(
        rightBow
    );


    const bowCenter =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.4,
                24,
                18
            ),
            bowMaterial
        );

    bowGroup.add(
        bowCenter
    );


    /* ---------------------------------------------
       GIFT GLOW
    --------------------------------------------- */

    const glowMaterial =
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xff65bd,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    const glow =
        new THREE.Sprite(
            glowMaterial
        );

    glow.scale.set(
        10,
        10,
        1
    );

    glow.position.y =
        0.2;

    giftGroup.add(
        glow
    );

    scene4GiftGlow =
        glow;


    /* ---------------------------------------------
       FLOOR GLOW
    --------------------------------------------- */

    const floorGlowMaterial =
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xff6ec4,
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    const floorGlow =
        new THREE.Sprite(
            floorGlowMaterial
        );

    floorGlow.scale.set(
        12,
        4,
        1
    );

    floorGlow.position.y =
        -1.7;

    giftGroup.add(
        floorGlow
    );
}


/* =========================================================
   SCENE 4 SPARKLES
========================================================= */

function createScene4Sparkles() {

    for (let i = 0; i < 80; i++) {

        const material =
            new THREE.SpriteMaterial({
                map: glowTexture,

                color:
                    i % 2 === 0
                        ? 0xffc8eb
                        : 0xc9b3ff,

                transparent: true,

                opacity:
                    0.3 +
                    Math.random() * 0.5,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });

        const sparkle =
            new THREE.Sprite(
                material
            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            5 +
            Math.random() * 8;

        sparkle.position.set(
            Math.cos(angle) *
                radius,

            -2 +
                Math.random() * 10,

            Math.sin(angle) *
                radius
        );

        const size =
            0.08 +
            Math.random() * 0.22;

        sparkle.scale.set(
            size,
            size,
            1
        );

        sparkle.userData = {
            baseY:
                sparkle.position.y,

            offset:
                Math.random() * 20,

            speed:
                0.5 +
                Math.random() * 1.2
        };

        scene4Group.add(
            sparkle
        );

        scene4Sparkles.push(
            sparkle
        );
    }
}


/* =========================================================
   SCENE 4 FLOATING HEARTS
========================================================= */

function createScene4Hearts() {

    for (let i = 0; i < 12; i++) {

        const material =
            new THREE.SpriteMaterial({
                map: heartTexture,

                transparent: true,

                opacity:
                    0.15 +
                    Math.random() * 0.3,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });

        const heart =
            new THREE.Sprite(
                material
            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            5 +
            Math.random() * 7;

        heart.position.set(
            Math.cos(angle) *
                radius,

            -1 +
                Math.random() * 8,

            Math.sin(angle) *
                radius
        );

        const size =
            0.25 +
            Math.random() * 0.45;

        heart.scale.set(
            size,
            size,
            1
        );

        heart.userData = {
            baseY:
                heart.position.y,

            offset:
                Math.random() * 20,

            speed:
                0.4 +
                Math.random() * 0.7
        };

        // ADD THE ACTUAL HEART
        scene4Group.add(heart);

        scene4Hearts.push(
            heart
        );
    }
}


/* =========================================================
   SCENE 4 INTRO UI
========================================================= */

function showScene4Intro() {

    const intro =
        document.createElement("div");

    intro.id =
        "scene4Intro";

    intro.style.position =
        "fixed";

    intro.style.inset =
        "0";

    intro.style.display =
        "flex";

    intro.style.flexDirection =
        "column";

    intro.style.alignItems =
        "center";

    intro.style.justifyContent =
        "center";

    intro.style.textAlign =
        "center";

    intro.style.color =
        "#fff";

    intro.style.fontFamily =
        "Georgia, serif";

    intro.style.zIndex =
        "200";

    intro.style.pointerEvents =
        "none";

    intro.style.opacity =
        "0";

    intro.style.transition =
        "opacity 2s ease";


    intro.innerHTML = `

        <div style="
            font-size:13px;
            letter-spacing:5px;
            opacity:.65;
            margin-bottom:20px;
        ">
            ONE MORE LITTLE SURPRISE
        </div>

        <div style="
            font-size:clamp(32px,6vw,62px);
            line-height:1.2;
            text-shadow:
                0 0 35px rgba(255,100,200,.8);
        ">
            I saved something
            <br>

            <span style="
                color:#ff9edc;
            ">
                just for you. ♥
            </span>
        </div>

    `;

    document.body.appendChild(
        intro
    );


    setTimeout(() => {

        intro.style.opacity =
            "1";

    }, 300);


    setTimeout(() => {

        intro.style.opacity =
            "0";

    }, 3500);


    setTimeout(() => {

        intro.remove();

        showScene4OpenButton();

    }, 5200);
}


/* =========================================================
   OPEN GIFT BUTTON
========================================================= */

function showScene4OpenButton() {

    const wrapper =
        document.createElement("div");

    wrapper.id =
        "scene4OpenWrapper";

    wrapper.style.position =
        "fixed";

    wrapper.style.left =
        "50%";

    wrapper.style.bottom =
        "8%";

    wrapper.style.transform =
        "translateX(-50%)";

    wrapper.style.zIndex =
        "210";

    wrapper.style.opacity =
        "0";

    wrapper.style.transition =
        "opacity 1.5s ease";

    wrapper.style.textAlign =
        "center";


    wrapper.innerHTML = `

        <div style="
            color:rgba(255,235,248,.7);
            font-family:Georgia,serif;
            font-size:14px;
            letter-spacing:2px;
            margin-bottom:13px;
        ">
            YOUR LITTLE SURPRISE IS WAITING
        </div>

        <button
            id="scene4OpenButton"
            style="
                padding:16px 30px;
                border-radius:45px;
                border:1px solid rgba(255,190,230,.5);
                background:rgba(255,100,190,.14);
                color:white;
                font-family:Georgia,serif;
                font-size:17px;
                letter-spacing:1px;
                cursor:pointer;
                backdrop-filter:blur(14px);
                -webkit-backdrop-filter:blur(14px);
                box-shadow:
                    0 0 30px rgba(255,80,190,.3);
                transition:
                    transform .3s ease,
                    box-shadow .3s ease,
                    background .3s ease;
            "
        >
            Open Your Little Surprise ♥
        </button>

    `;


    document.body.appendChild(
        wrapper
    );


    setTimeout(() => {

        wrapper.style.opacity =
            "1";

    }, 300);


    const button =
        document.getElementById(
            "scene4OpenButton"
        );


    if (!button)
        return;


    button.addEventListener(
        "mouseenter",
        () => {

            button.style.transform =
                "scale(1.07)";

            button.style.boxShadow =
                "0 0 50px rgba(255,80,190,.55)";

            button.style.background =
                "rgba(255,100,190,.25)";
        }
    );


    button.addEventListener(
        "mouseleave",
        () => {

            button.style.transform =
                "scale(1)";

            button.style.boxShadow =
                "0 0 30px rgba(255,80,190,.3)";

            button.style.background =
                "rgba(255,100,190,.14)";
        }
    );


    button.addEventListener(
        "click",
        () => {

            if (scene4Opening)
                return;

            scene4Opening = true;

            wrapper.style.opacity =
                "0";

            setTimeout(() => {

                wrapper.remove();

            }, 800);


            openScene4Gift();
        }
    );
}


/* =========================================================
   OPEN 3D GIFT
========================================================= */

function openScene4Gift() {

    const startTime =
        performance.now();

    const duration =
        2200;


    function animateGiftOpen(time) {

        const progress =
            Math.min(
                (time - startTime) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        /* -----------------------------------------
           Lid opens
        ----------------------------------------- */

        if (scene4GiftLid) {

            scene4GiftLid.rotation.x =
                -eased *
                Math.PI *
                0.42;

            scene4GiftLid.position.y =
                1.7 +
                eased * 1.5;
        }


        /* -----------------------------------------
           Gift rises slightly
        ----------------------------------------- */

        if (scene4Gift) {

            scene4Gift.position.y =
                -1.1 +
                Math.sin(
                    eased *
                    Math.PI
                ) * 0.5;
        }


        /* -----------------------------------------
           Glow increases
        ----------------------------------------- */

        if (scene4GiftGlow) {

            scene4GiftGlow.material.opacity =
                0.3 +
                eased * 0.7;

            const glowScale =
                10 +
                eased * 9;

            scene4GiftGlow.scale.set(
                glowScale,
                glowScale,
                1
            );
        }


        /* -----------------------------------------
           Sparkles become brighter
        ----------------------------------------- */

        scene4Sparkles.forEach(
            (sparkle) => {

                sparkle.material.opacity =
                    0.3 +
                    eased * 0.7;
            }
        );


        /* -----------------------------------------
           Light burst
        ----------------------------------------- */

        pinkLight.intensity =
            2.5 +
            eased * 5;

        purpleLight.intensity =
            2.8 +
            eased * 3;


        if (progress < 1) {

            requestAnimationFrame(
                animateGiftOpen
            );

        } else {

            scene4Opened =
                true;

            showScene4FinalReveal();
        }
    }


    requestAnimationFrame(
        animateGiftOpen
    );
}


/* =========================================================
   FINAL REVEAL
========================================================= */

function showScene4FinalReveal() {

    /* ---------------------------------------------
       Brightness settles
    --------------------------------------------- */

    pinkLight.intensity =
        4;

    purpleLight.intensity =
        3;


    const reveal =
        document.createElement("div");

    reveal.id =
        "scene4FinalReveal";

    reveal.style.position =
        "fixed";

    reveal.style.inset =
        "0";

    reveal.style.display =
        "flex";

    reveal.style.flexDirection =
        "column";

    reveal.style.alignItems =
        "center";

    reveal.style.justifyContent =
        "center";

    reveal.style.textAlign =
        "center";

    reveal.style.color =
        "#fff";

    reveal.style.fontFamily =
        "Georgia, serif";

    reveal.style.zIndex =
        "220";

    reveal.style.pointerEvents =
    "auto";

    reveal.style.opacity =
        "0";

    reveal.style.transform =
        "translateY(30px)";

    reveal.style.transition =
        "opacity 2s ease, transform 2s ease";

    reveal.style.textShadow =
        "0 0 35px rgba(255,100,200,.8)";


    reveal.innerHTML = `

    <div style="
        font-size:14px;
        letter-spacing:5px;
        opacity:.65;
        margin-bottom:22px;
    ">
        FOR THE DAYS WHEN YOU DON'T FEEL OKAY ♥
    </div>

    <div style="
        font-size:clamp(34px,7vw,72px);
        line-height:1.15;
    ">
        I know today
        <br>

        <span style="
            color:#ff9edc;
        ">
            you're feeling a little sad.
        </span>
    </div>

    <div style="
        margin-top:24px;
        max-width:680px;
        padding:0 20px;
        font-size:clamp(16px,2.5vw,22px);
        line-height:1.8;
        color:rgba(255,245,251,.88);
    ">
        You don't have to pretend that everything is okay.
        <br>
        It's completely okay to have difficult days.
        <br><br>

        But I want you to remember something...
        <br>
        <span style="color:#ffc3e7;">
            You deserve happiness, peace, and beautiful moments.
        </span>
    </div>

    <div style="
        margin-top:30px;
        max-width:650px;
        padding:0 20px;
        font-size:clamp(18px,3vw,27px);
        line-height:1.6;
        color:#ffd4ed;
    ">
        So if I could wish one thing for you today...
        <br>
        it would be to see that smile come back. ♥
    </div>

    <div style="
        margin-top:28px;
        font-size:clamp(20px,3vw,28px);
        color:#ffb5df;
    ">
        Better days are waiting for you. ✨
    </div>

`;


    document.body.appendChild(
        reveal
    );

    scene4FinalUI =
        reveal;


    setTimeout(() => {

        reveal.style.opacity =
            "1";

        reveal.style.transform =
            "translateY(0)";

    }, 400);


    /* ---------------------------------------------
       Add floating final heart
    --------------------------------------------- */

    //createScene4FinalHeart();

    /* ---------------------------------------------
       Scene 5 button
    --------------------------------------------- */

    const nextButton =
        document.createElement("button");

    nextButton.innerHTML =
        "One More Surprise ♥";

    nextButton.style.marginTop =
        "34px";

    nextButton.style.padding =
        "15px 28px";

    nextButton.style.borderRadius =
        "999px";

    nextButton.style.border =
        "1px solid rgba(255,170,225,.45)";

    nextButton.style.background =
        "rgba(255,130,210,.12)";

    nextButton.style.color =
        "#fff";

    nextButton.style.fontFamily =
        "Georgia, serif";

    nextButton.style.fontSize =
        "16px";

    nextButton.style.cursor =
        "pointer";

    nextButton.style.backdropFilter =
        "blur(10px)";

    nextButton.style.boxShadow =
        "0 0 30px rgba(255,100,210,.18)";

    nextButton.style.opacity =
        "0";

    nextButton.style.transform =
        "translateY(15px)";

    nextButton.style.transition =
        "all .5s ease";

    reveal.appendChild(
        nextButton
    );


    setTimeout(() => {

        nextButton.style.opacity =
            "1";

        nextButton.style.transform =
            "translateY(0)";

    }, 2200);


    nextButton.addEventListener(
        "mouseenter",
        () => {

            nextButton.style.transform =
                "translateY(-3px) scale(1.05)";

            nextButton.style.boxShadow =
                "0 0 40px rgba(255,100,210,.4)";
        }
    );


    nextButton.addEventListener(
        "mouseleave",
        () => {

            nextButton.style.transform =
                "translateY(0) scale(1)";

            nextButton.style.boxShadow =
                "0 0 30px rgba(255,100,210,.18)";
        }
    );


    nextButton.addEventListener("click", () => {

    reveal.style.opacity = "0";
    reveal.style.transform = "translateY(30px)";

    setTimeout(() => {
        startScene4ToScene5();
    }, 1000);

});

}

function startScene4ToScene5() {

    // Hide Scene 4
    if (scene4Group) {
        scene4Group.visible = false;
    }

    scene4Started = false;

    // Start Scene 5
    startScene5();
}

/* =========================================================
   SCENE 5 — A LETTER FOR YOU
========================================================= */

/* =========================================================
   START SCENE 5
========================================================= */

function startScene5() {

    if (scene5Started)
        return;

    scene5Started = true;
    scene5Opened = false;
    scene5Opening = false;

    /* -----------------------------------------------------
       Hide Scene 4 completely
    ----------------------------------------------------- */

    scene4Group.visible = false;

    scene4Sparkles.forEach(
        (item) => {
            item.visible = false;
        }
    );

    scene4Hearts.forEach(
        (item) => {
            item.visible = false;
        }
    );


    /* -----------------------------------------------------
       Scene 5 background
    ----------------------------------------------------- */

    scene.background =
        new THREE.Color(
            0x07020f
        );

    scene.fog =
        new THREE.FogExp2(
            0x07020f,
            0.012
        );


    /* -----------------------------------------------------
       Lighting
    ----------------------------------------------------- */

    pinkLight.intensity =
        2.8;

    purpleLight.intensity =
        3.2;


    /* -----------------------------------------------------
       Camera
    ----------------------------------------------------- */

    camera.position.set(
        0,
        2.5,
        16
    );

    controls.target.set(
        0,
        0.8,
        0
    );

    controls.autoRotate =
        false;

    controls.update();


    /* -----------------------------------------------------
       Reset Scene 5 group
    ----------------------------------------------------- */

    scene5Group.visible = true;


    /* -----------------------------------------------------
       Create Scene 5
    ----------------------------------------------------- */

    createScene5Envelope();

    createScene5Sparkles();

    createScene5Hearts();

    createScene5LetterGlow();


    /* -----------------------------------------------------
       Intro
    ----------------------------------------------------- */

    showScene5Intro();
}


/* =========================================================
   SCENE 5 INTRO
========================================================= */

function showScene5Intro() {

    const intro =
        document.createElement(
            "div"
        );

    intro.id =
        "scene5Intro";

    intro.style.position =
        "fixed";

    intro.style.inset =
        "0";

    intro.style.display =
        "flex";

    intro.style.flexDirection =
        "column";

    intro.style.alignItems =
        "center";

    intro.style.justifyContent =
        "center";

    intro.style.textAlign =
        "center";

    intro.style.color =
        "#fff";

    intro.style.fontFamily =
        "Georgia, serif";

    intro.style.zIndex =
        "300";

    intro.style.pointerEvents =
        "none";

    intro.style.opacity =
        "0";

    intro.style.transition =
        "opacity 2s ease";

    intro.style.textShadow =
        "0 0 30px rgba(255,100,210,.7)";


    intro.innerHTML = `

        <div style="
            font-size:13px;
            letter-spacing:5px;
            opacity:.6;
            margin-bottom:22px;
        ">
            CHAPTER FIVE
        </div>

        <div style="
            font-size:clamp(34px,7vw,70px);
            line-height:1.15;
        ">
            A little letter
            <br>

            <span style="
                color:#ff9edc;
            ">
                just for you. ♥
            </span>
        </div>

        <div style="
            margin-top:22px;
            font-size:clamp(15px,2vw,20px);
            color:rgba(255,240,250,.75);
            letter-spacing:1px;
        ">
            Some things are better written down.
        </div>

    `;

    document.body.appendChild(
        intro
    );


    setTimeout(
        () => {

            intro.style.opacity =
                "1";

        },
        300
    );


    setTimeout(
        () => {

            intro.style.opacity =
                "0";

        },
        3500
    );


    setTimeout(
        () => {

            intro.remove();

            showScene5OpenButton();

        },
        5200
    );
}


/* =========================================================
   CREATE 3D ENVELOPE
========================================================= */

function createScene5Envelope() {

    const envelopeGroup =
        new THREE.Group();

    envelopeGroup.position.set(
        0,
        -0.8,
        0
    );

    scene5Group.add(
        envelopeGroup
    );

    scene5Envelope =
        envelopeGroup;


    /* -----------------------------------------------------
       Envelope body
    ----------------------------------------------------- */

    const envelopeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf3b8d8,
            roughness: 0.42,
            metalness: 0.08,
            emissive: 0x5e2047,
            emissiveIntensity: 0.18,
            side: THREE.DoubleSide
        });


    const envelopeBody =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                6.2,
                3.9,
                0.35
            ),
            envelopeMaterial
        );

    envelopeBody.position.set(
        0,
        0,
        0
    );

    envelopeGroup.add(
        envelopeBody
    );


    /* -----------------------------------------------------
       Envelope inner panel
    ----------------------------------------------------- */

    const innerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffd8eb,
            roughness: 0.55,
            metalness: 0.02
        });


    const innerPanel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5.75,
                3.45,
                0.12
            ),
            innerMaterial
        );

    innerPanel.position.set(
        0,
        0,
        -0.23
    );

    envelopeGroup.add(
        innerPanel
    );


    /* -----------------------------------------------------
       Left diagonal flap
    ----------------------------------------------------- */

    const leftFlap =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                3.1,
                3.9
            ),
            envelopeMaterial
        );

    leftFlap.position.set(
        -1.55,
        0,
        0.25
    );

    leftFlap.rotation.y =
        Math.PI / 2;

    envelopeGroup.add(
        leftFlap
    );


    /* -----------------------------------------------------
       Right diagonal flap
    ----------------------------------------------------- */

    const rightFlap =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                3.1,
                3.9
            ),
            envelopeMaterial
        );

    rightFlap.position.set(
        1.55,
        0,
        0.25
    );

    rightFlap.rotation.y =
        -Math.PI / 2;

    envelopeGroup.add(
        rightFlap
    );


    /* -----------------------------------------------------
       Bottom flap
    ----------------------------------------------------- */

    const bottomFlap =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                6.0,
                2.1
            ),
            envelopeMaterial
        );

    bottomFlap.position.set(
        0,
        -0.95,
        0.32
    );

    bottomFlap.rotation.x =
        -Math.PI / 2;

    envelopeGroup.add(
        bottomFlap
    );


    /* -----------------------------------------------------
       TOP FLAP
    ----------------------------------------------------- */

    const topFlapGroup =
        new THREE.Group();

    topFlapGroup.position.set(
        0,
        1.9,
        0.25
    );

    envelopeGroup.add(
        topFlapGroup
    );


    const topFlap =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                6.1,
                3.9
            ),
            envelopeMaterial
        );

    topFlap.position.set(
        0,
        -1.85,
        0
    );

    topFlap.rotation.x =
        Math.PI;

    topFlapGroup.add(
        topFlap
    );


    scene5Envelope.userData =
        {
            topFlap:
                topFlapGroup,

            baseY:
                -0.8
        };


    /* -----------------------------------------------------
       Wax heart seal
    ----------------------------------------------------- */

    const sealMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff4f9f,
            roughness: 0.28,
            metalness: 0.1,
            emissive: 0x9c174f,
            emissiveIntensity: 0.45
        });


    const seal =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42,
                24,
                24
            ),
            sealMaterial
        );

    seal.position.set(
        0,
        0.15,
        0.5
    );

    seal.scale.set(
        1,
        0.8,
        0.35
    );

    envelopeGroup.add(
        seal
    );


    /* -----------------------------------------------------
       Ribbon line
    ----------------------------------------------------- */

    const ribbonMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff79bd,
            roughness: 0.3,
            metalness: 0.15,
            emissive: 0xff3d9e,
            emissiveIntensity: 0.3
        });


    const ribbon =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.25,
                3.9,
                0.08
            ),
            ribbonMaterial
        );

    ribbon.position.set(
        0,
        0,
        0.42
    );

    envelopeGroup.add(
        ribbon
    );


    /* -----------------------------------------------------
       Envelope glow
    ----------------------------------------------------- */

    const glowMaterial =
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xff70c4,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });


    const envelopeGlow =
        new THREE.Sprite(
            glowMaterial
        );

    envelopeGlow.scale.set(
        9,
        6,
        1
    );

    envelopeGlow.position.set(
        0,
        0,
        -0.5
    );

    envelopeGroup.add(
        envelopeGlow
    );

    scene5LetterGlow =
        envelopeGlow;
}


/* =========================================================
   LETTER
========================================================= */

function createScene5Letter() {

    if (scene5Letter)
        return;


    const letterGroup =
        new THREE.Group();

    letterGroup.position.set(
        0,
        -0.55,
        0.55
    );

    letterGroup.scale.set(
        0.01,
        0.01,
        0.01
    );


    scene5Group.add(
        letterGroup
    );

    scene5Letter =
        letterGroup;


    /* -----------------------------------------------------
       Paper
    ----------------------------------------------------- */

    const paperMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xfff4fa,
            roughness: 0.72,
            metalness: 0.02,
            side: THREE.DoubleSide
        });


    const paper =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5.1,
                6.2,
                0.12
            ),
            paperMaterial
        );

    paper.position.z =
        0;

    letterGroup.add(
        paper
    );


    /* -----------------------------------------------------
       Paper glow
    ----------------------------------------------------- */

    const paperGlowMaterial =
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xffa7dc,
            transparent: true,
            opacity: 0.12,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });


    const paperGlow =
        new THREE.Sprite(
            paperGlowMaterial
        );

    paperGlow.scale.set(
        6,
        7,
        1
    );

    paperGlow.position.z =
        -0.15;

    letterGroup.add(
        paperGlow
    );
}


/* =========================================================
   LETTER UI
========================================================= */

function createScene5LetterUI() {

    if (scene5UI)
        return;


    scene5UI =
        document.createElement(
            "div"
        );

    scene5UI.id =
        "scene5LetterUI";

    scene5UI.style.position =
        "fixed";

    scene5UI.style.left =
        "50%";

    scene5UI.style.top =
        "50%";

    scene5UI.style.transform =
        "translate(-50%, -50%) scale(.92)";

    scene5UI.style.width =
        "min(88%, 650px)";

    scene5UI.style.maxHeight =
        "78vh";

    scene5UI.style.overflowY =
        "auto";

    scene5UI.style.boxSizing =
        "border-box";

    scene5UI.style.padding =
        "38px 34px";

    scene5UI.style.background =
        "rgba(255,245,251,.94)";

    scene5UI.style.border =
        "1px solid rgba(255,170,220,.65)";

    scene5UI.style.borderRadius =
        "26px";

    scene5UI.style.color =
        "#4b1938";

    scene5UI.style.fontFamily =
        "Georgia, serif";

    scene5UI.style.textAlign =
        "left";

    scene5UI.style.zIndex =
        "350";

    scene5UI.style.opacity =
        "0";

    scene5UI.style.pointerEvents =
        "none";

    scene5UI.style.transition =
        "opacity 1.5s ease, transform 1.5s ease";

    scene5UI.style.boxShadow =
        "0 0 70px rgba(255,100,200,.35)";


    scene5UI.innerHTML = `

        <div style="
            text-align:center;
            font-size:12px;
            letter-spacing:4px;
            color:#a85b87;
            margin-bottom:20px;
        ">
            A LETTER FOR YOU
        </div>

        <div style="
            text-align:center;
            font-size:clamp(28px,5vw,44px);
            color:#d94c92;
            margin-bottom:25px;
        ">
For the days when you feel sad ♥        </div>

        <div style="
        font-size:clamp(16px,2.2vw,20px);
        line-height:1.9;
    ">

        I don't know exactly what is going on
        inside your mind right now.

        <br><br>

        Maybe you're tired.
        Maybe you're overthinking.
        Maybe today just isn't one of your
        happiest days.

        <br><br>

        And that's okay.

        <br><br>

        You don't always have to be strong.
        You don't always have to smile.
        And you don't have to pretend
        that everything is fine.

        <br><br>

        I just want you to know that
        when you're feeling a little low,
        I want to be one of the reasons
        you feel a little better.

        <br><br>

        I may not always know the perfect
        words to make everything okay,
        but I will always want to see
        that beautiful smile of yours again.

        <br><br>

        So take your time.
        Breathe.
        Let the difficult moments pass.

        <br><br>

        And please remember...

        <br><br>

        <span style="
            color:#d94c92;
            font-size:1.08em;
        ">
            You are allowed to have bad days,
            but those days don't define you. ♥
        </span>

        <br><br>

        I hope tomorrow feels a little lighter.
        I hope something makes you laugh.
        I hope your heart feels a little calmer.

        <br><br>

        And most importantly...

        <br>

        <span style="
            color:#d94c92;
            font-size:1.08em;
        ">
            I hope I get to see you smile again. ✨
        </span>

    </div>

    <div style="
        text-align:center;
        margin-top:30px;
        font-size:clamp(19px,3vw,27px);
        color:#d94c92;
    ">
        This little world is here
        <br>
        just to remind you to smile. ♥
    </div>

    <div style="
        text-align:center;
        margin-top:25px;
        font-size:15px;
        letter-spacing:2px;
        color:#9b5b7d;
    ">
        A LITTLE REMINDER THAT YOU MATTER ♥
    </div>

    <div style="
        text-align:center;
        margin-top:25px;
    ">

        <button
            id="scene5FinishButton"
            style="
                padding:14px 27px;
                border-radius:999px;
                border:1px solid rgba(210,70,145,.35);
                background:rgba(220,80,155,.1);
                color:#7d2857;
                font-family:Georgia,serif;
                font-size:16px;
                cursor:pointer;
                transition:
                    transform .3s ease,
                    box-shadow .3s ease,
                    background .3s ease;
            "
        >
            Keep This Moment ♥
        </button>

    </div>
`;


    document.body.appendChild(
        scene5UI
    );


    const finishButton =
        document.getElementById(
            "scene5FinishButton"
        );


    if (finishButton) {

        finishButton.addEventListener(
            "mouseenter",
            () => {

                finishButton.style.transform =
                    "scale(1.06)";

                finishButton.style.boxShadow =
                    "0 0 30px rgba(220,80,155,.3)";

                finishButton.style.background =
                    "rgba(220,80,155,.2)";
            }
        );


        finishButton.addEventListener(
            "mouseleave",
            () => {

                finishButton.style.transform =
                    "scale(1)";

                finishButton.style.boxShadow =
                    "none";

                finishButton.style.background =
                    "rgba(220,80,155,.1)";
            }
        );


        finishButton.addEventListener(
            "click",
            () => {

                finishButton.disabled =
                    true;

                showScene5FinalReveal();
            }
        );
    }
}


/* =========================================================
   OPEN LETTER BUTTON
========================================================= */

function showScene5OpenButton() {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.id =
        "scene5OpenWrapper";

    wrapper.style.position =
        "fixed";

    wrapper.style.left =
        "50%";

    wrapper.style.bottom =
        "8%";

    wrapper.style.transform =
        "translateX(-50%)";

    wrapper.style.zIndex =
        "320";

    wrapper.style.textAlign =
        "center";

    wrapper.style.opacity =
        "0";

    wrapper.style.transition =
        "opacity 1.5s ease";


    wrapper.innerHTML = `

        <div style="
            color:rgba(255,235,248,.72);
            font-family:Georgia,serif;
            font-size:14px;
            letter-spacing:2px;
            margin-bottom:14px;
        ">
            THERE'S SOMETHING INSIDE
        </div>

        <button
            id="scene5OpenButton"
            style="
                padding:16px 31px;
                border-radius:999px;
                border:1px solid rgba(255,190,230,.5);
                background:rgba(255,100,190,.14);
                color:white;
                font-family:Georgia,serif;
                font-size:17px;
                letter-spacing:1px;
                cursor:pointer;
                backdrop-filter:blur(14px);
                -webkit-backdrop-filter:blur(14px);
                box-shadow:
                    0 0 30px rgba(255,80,190,.3);
                transition:
                    transform .3s ease,
                    box-shadow .3s ease,
                    background .3s ease;
            "
        >
            Open My Letter ♥
        </button>
    `;


    document.body.appendChild(
        wrapper
    );


    setTimeout(
        () => {

            wrapper.style.opacity =
                "1";

        },
        300
    );


    const button =
        document.getElementById(
            "scene5OpenButton"
        );


    if (!button)
        return;


    button.addEventListener(
        "mouseenter",
        () => {

            button.style.transform =
                "scale(1.07)";

            button.style.boxShadow =
                "0 0 50px rgba(255,80,190,.55)";

            button.style.background =
                "rgba(255,100,190,.25)";
        }
    );


    button.addEventListener(
        "mouseleave",
        () => {

            button.style.transform =
                "scale(1)";

            button.style.boxShadow =
                "0 0 30px rgba(255,80,190,.3)";

            button.style.background =
                "rgba(255,100,190,.14)";
        }
    );


    button.addEventListener(
        "click",
        () => {

            if (scene5Opening)
                return;

            scene5Opening =
                true;

            wrapper.style.opacity =
                "0";

            setTimeout(
                () => {

                    wrapper.remove();

                },
                800
            );

            openScene5Letter();
        }
    );
}


/* =========================================================
   OPEN SCENE 5 LETTER
========================================================= */

function openScene5Letter() {

    createScene5Letter();

    createScene5LetterUI();


    const topFlap =
        scene5Envelope.userData.topFlap;


    const startTime =
        performance.now();

    const duration =
        2400;


    function animateLetterOpen(
        time
    ) {

        const progress =
            Math.min(
                (
                    time -
                    startTime
                ) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        /* -------------------------------------------------
           Envelope opens
        ------------------------------------------------- */

        if (topFlap) {

            topFlap.rotation.x =
                -eased *
                Math.PI *
                0.8;

            topFlap.position.y =
                1.9 +
                eased * 0.25;
        }


        /* -------------------------------------------------
           Letter rises
        ------------------------------------------------- */

        if (scene5Letter) {

            const letterProgress =
                Math.max(
                    0,
                    Math.min(
                        (
                            progress -
                            0.15
                        ) /
                        0.85,
                        1
                    )
                );

            const letterEased =
                1 -
                Math.pow(
                    1 - letterProgress,
                    3
                );


            scene5Letter.position.y =
                -0.55 +
                letterEased * 3.1;


            const scale =
                0.01 +
                letterEased * 0.99;

            scene5Letter.scale.set(
                scale,
                scale,
                scale
            );
        }


        /* -------------------------------------------------
           Glow
        ------------------------------------------------- */

        if (scene5LetterGlow) {

            scene5LetterGlow.material.opacity =
                0.28 +
                eased * 0.45;

            const glowScale =
                9 +
                eased * 6;

            scene5LetterGlow.scale.set(
                glowScale,
                glowScale,
                1
            );
        }


        /* -------------------------------------------------
           Lights
        ------------------------------------------------- */

        pinkLight.intensity =
            2.8 +
            eased * 3.5;

        purpleLight.intensity =
            3.2 +
            eased * 2;


        /* -------------------------------------------------
           Sparkles
        ------------------------------------------------- */

        scene5Sparkles.forEach(
            (sparkle) => {

                sparkle.material.opacity =
                    0.3 +
                    eased * 0.6;
            }
        );


        if (progress < 1) {

            requestAnimationFrame(
                animateLetterOpen
            );

        } else {

            scene5Opened =
                true;

            showScene5LetterUI();
        }
    }


    requestAnimationFrame(
        animateLetterOpen
    );
}


/* =========================================================
   SHOW LETTER UI
========================================================= */

function showScene5LetterUI() {

    if (!scene5UI)
        return;


    scene5UI.style.pointerEvents =
        "auto";

    scene5UI.style.opacity =
        "0";

    scene5UI.style.transform =
        "translate(-50%, -50%) scale(.92)";


    setTimeout(
        () => {

            scene5UI.style.opacity =
                "1";

            scene5UI.style.transform =
                "translate(-50%, -50%) scale(1)";

        },
        500
    );
}


/* =========================================================
   SCENE 5 SPARKLES
========================================================= */

function createScene5Sparkles() {

    for (let i = 0; i < 90; i++) {

        const material =
            new THREE.SpriteMaterial({
                map: glowTexture,

                color:
                    i % 2 === 0
                        ? 0xffc8eb
                        : 0xcbb8ff,

                transparent: true,

                opacity:
                    0.2 +
                    Math.random() * 0.5,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });


        const sparkle =
            new THREE.Sprite(
                material
            );


        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            4 +
            Math.random() * 10;


        sparkle.position.set(

            Math.cos(angle) *
                radius,

            -2 +
                Math.random() * 10,

            Math.sin(angle) *
                radius

        );


        const size =
            0.06 +
            Math.random() * 0.2;


        sparkle.scale.set(
            size,
            size,
            1
        );


        sparkle.userData = {

            baseX:
                sparkle.position.x,

            baseY:
                sparkle.position.y,

            baseZ:
                sparkle.position.z,

            offset:
                Math.random() * 20,

            speed:
                0.4 +
                Math.random() * 1.2
        };


        scene5Group.add(
            sparkle
        );


        scene5Sparkles.push(
            sparkle
        );
    }
}


/* =========================================================
   SCENE 5 FLOATING HEARTS
========================================================= */

function createScene5Hearts() {

    for (let i = 0; i < 18; i++) {

        const material =
            new THREE.SpriteMaterial({
                map: heartTexture,

                transparent: true,

                opacity:
                    0.15 +
                    Math.random() * 0.3,

                depthWrite: false,

                blending:
                    THREE.AdditiveBlending
            });


        const heart =
            new THREE.Sprite(
                material
            );


        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            5 +
            Math.random() * 8;


        heart.position.set(

            Math.cos(angle) *
                radius,

            -2 +
                Math.random() * 10,

            Math.sin(angle) *
                radius

        );


        const size =
            0.2 +
            Math.random() * 0.45;


        heart.scale.set(
            size,
            size,
            1
        );


        heart.userData = {

            baseX:
                heart.position.x,

            baseY:
                heart.position.y,

            baseZ:
                heart.position.z,

            offset:
                Math.random() * 20,

            speed:
                0.3 +
                Math.random() * 0.7
        };


        scene5Group.add(
            heart
        );


        scene5Hearts.push(
            heart
        );
    }
}


/* =========================================================
   LETTER GLOW
========================================================= */

function createScene5LetterGlow() {

    const material =
        new THREE.SpriteMaterial({
            map: glowTexture,

            color: 0xff72c8,

            transparent: true,

            opacity: 0.12,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const glow =
        new THREE.Sprite(
            material
        );


    glow.scale.set(
        14,
        7,
        1
    );


    glow.position.set(
        0,
        0,
        -1
    );


    scene5Group.add(
        glow
    );


    scene5LetterGlow =
        glow;
}


/* =========================================================
   FINAL SCENE 5 HEART
========================================================= */

function createScene5FinalHeart() {

    const material =
        new THREE.SpriteMaterial({
            map: heartTexture,

            transparent: true,

            opacity: 0,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const heart =
        new THREE.Sprite(
            material
        );


    heart.position.set(
        0,
        2.5,
        0
    );


    heart.scale.set(
        0.1,
        0.1,
        1
    );


    scene5Group.add(
        heart
    );


    scene5FinalHeart =
        heart;


    const startTime =
        performance.now();


    function animateFinalHeart(
        time
    ) {

        const progress =
            Math.min(
                (
                    time -
                    startTime
                ) /
                1800,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const scale =
            0.1 +
            eased * 4;


        heart.scale.set(
            scale,
            scale,
            1
        );


        heart.material.opacity =
            eased;


        if (progress < 1) {

            requestAnimationFrame(
                animateFinalHeart
            );

        }
    }


    requestAnimationFrame(
        animateFinalHeart
    );
}


/* =========================================================
   FINAL REVEAL
========================================================= */

function showScene5FinalReveal() {

    if (scene5UI) {

        scene5UI.style.opacity =
            "0";

        scene5UI.style.transform =
            "translate(-50%, -50%) scale(.9)";

        scene5UI.style.pointerEvents =
            "none";
    }


    setTimeout(
        () => {

            if (scene5UI) {

                scene5UI.remove();

                scene5UI =
                    null;
            }

        },
        1200
    );


    createScene5FinalHeart();


    const finalUI =
        document.createElement(
            "div"
        );


    finalUI.id =
        "scene5FinalUI";


    finalUI.style.position =
        "fixed";

    finalUI.style.inset =
        "0";

    finalUI.style.display =
        "flex";

    finalUI.style.flexDirection =
        "column";

    finalUI.style.alignItems =
        "center";

    finalUI.style.justifyContent =
        "center";

    finalUI.style.textAlign =
        "center";

    finalUI.style.color =
        "#fff";

    finalUI.style.fontFamily =
        "Georgia, serif";

    finalUI.style.zIndex =
        "400";

    finalUI.style.opacity =
        "0";

    finalUI.style.transform =
        "translateY(30px)";

    finalUI.style.transition =
        "opacity 2s ease, transform 2s ease";

    finalUI.style.pointerEvents =
        "none";

    finalUI.style.textShadow =
        "0 0 35px rgba(255,100,210,.8)";


    finalUI.innerHTML = `

        <div style="
            font-size:13px;
            letter-spacing:5px;
            opacity:.65;
            margin-bottom:22px;
        ">
            ONE LAST LITTLE THOUGHT
        </div>

        <div style="
            font-size:clamp(34px,7vw,70px);
            line-height:1.15;
        ">
            Stay Happy
            <br>

            <span style="
                color:#ff9edc;
            ">
                and keep shining. ♥
            </span>
        </div>

        <div style="
            margin-top:25px;
            max-width:680px;
            padding:0 22px;
            font-size:clamp(16px,2.5vw,22px);
            line-height:1.8;
            color:rgba(255,245,251,.88);
        ">
            May this year bring you
            beautiful memories,
            exciting dreams,
            peaceful moments,
            and many reasons to smile.
        </div>

        <div style="
            margin-top:30px;
            font-size:clamp(21px,3vw,30px);
            color:#ffc5e8;
        ">
            Your next chapter starts now. ✨
        </div>

    `;


    document.body.appendChild(
        finalUI
    );


    setTimeout(
        () => {

            finalUI.style.opacity =
                "1";

            finalUI.style.transform =
                "translateY(0)";

        },
        500
    );
}


/* =========================================================
   FINAL FLOATING HEART
========================================================= */

function createScene4FinalHeart() {

    const material =
        new THREE.SpriteMaterial({
            map: heartTexture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    scene4FinalHeart = new THREE.Mesh(
    geometry,
    material
);

    heart.position.set(
        0,
        4.5,
        0
    );

    heart.scale.set(
        1.5,
        1.5,
        1
    );

    heart.userData.scene4Final =
        true;

    scene4Group.add(
        heart
    );

    scene4Hearts.push(
        heart
    );
}



/* =========================================================
   START SCENE 3
========================================================= */

function startScene3() {

    if (scene3Started)
        return;

    scene3Started =
        true;

    createScene3();


    /* Hide old UI */

    const scene1 =
        document.getElementById(
            "scene1"
        );

    const scene2 =
        document.getElementById(
            "scene2"
        );

    if (scene1)
        scene1.style.display =
            "none";

    if (scene2)
        scene2.style.display =
            "none";


    /* Show Scene 3 */

    const scene3 =
        document.getElementById(
            "scene3"
        );

    if (scene3)
        scene3.style.display =
            "block";


    /* Reset Scene 3 interaction */

    scene3ClickedCount =
        0;

    scene3Completed =
        false;

    scene3Merging =
        false;


    scene3Progress.innerHTML =
        "DISCOVER THE THREE LITTLE THINGS • 0 / 3";


    /* Scene 3 intro text */

    const content =
        document.querySelector(
            ".scene3-content"
        );

    if (content) {

        content.innerHTML = `

            <div class="scene3-label">
                CHAPTER THREE
            </div>

            <h2>
                A little universe<br>
                <span>
                    for the two of us.
                </span>
            </h2>

            <p>
                Some things are too special<br>
                to fit into words.
            </p>

        `;


        content.style.opacity =
            "0";

        content.style.transform =
            "translateX(-50%) translateY(20px)";


        setTimeout(
            () => {

                content.style.opacity =
                    "1";

                content.style.transform =
                    "translateX(-50%) translateY(0)";

            },
            400
        );


        setTimeout(
            () => {

                content.style.opacity =
                    "0";

            },
            4500
        );
    }


    /* Progress */

    setTimeout(
        () => {

            scene3Progress.style.opacity =
                "1";

        },
        4800
    );


    /* Hint */

    setTimeout(
        () => {

            scene3Hint.style.opacity =
                "1";

        },
        5200
    );


    /* Camera */

    camera.position.set(
        0,
        3,
        17
    );

    controls.target.set(
        0,
        0,
        0
    );

    controls.autoRotate =
        true;

    controls.autoRotateSpeed =
        0.12;

    controls.update();
}


/* =========================================================
   MOUSE PARALLAX
========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX /
                window.innerWidth -
            0.5;

        mouseY =
            event.clientY /
                window.innerHeight -
            0.5;
    }
);


/* =========================================================
   TOUCH PARALLAX
========================================================= */

window.addEventListener(
    "touchmove",
    (event) => {

        if (
            !event.touches ||
            !event.touches[0]
        )
            return;

        mouseX =
            event.touches[0].clientX /
                window.innerWidth -
            0.5;

        mouseY =
            event.touches[0].clientY /
                window.innerHeight -
            0.5;
    },
    {
        passive: true
    }
);


/* =========================================================
   CLOCK
========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        clock.getElapsedTime();


    /* -----------------------------------------------------
       STARS
    ----------------------------------------------------- */

    stars.rotation.y =
        elapsed * 0.003;

    stars.rotation.x =
        Math.sin(
            elapsed * 0.05
        ) * 0.02;


    /* -----------------------------------------------------
       FLOWERS
    ----------------------------------------------------- */

    flowers.forEach(
        (flower) => {

            const data =
                flower.userData;

            flower.rotation.z =
                Math.sin(
                    elapsed * 0.7 +
                    data.offset
                ) * 0.025;
        }
    );


    /* -----------------------------------------------------
       TREES
    ----------------------------------------------------- */

    trees.forEach(
        (tree) => {

            const data =
                tree.userData;

            tree.rotation.z =
                Math.sin(
                    elapsed * 0.25 +
                    data.offset
                ) * 0.012;
        }
    );


    /* -----------------------------------------------------
       FIREFLIES
    ----------------------------------------------------- */

    fireflies.forEach(
        (fly) => {

            const data =
                fly.userData;

            fly.position.x =
                data.baseX +
                Math.sin(
                    elapsed *
                        data.speed +
                    data.offset
                ) * 1.2;

            fly.position.y =
                data.baseY +
                Math.sin(
                    elapsed *
                        0.7 +
                    data.offset
                ) * 0.7;

            fly.position.z =
                data.baseZ +
                Math.cos(
                    elapsed *
                        0.5 +
                    data.offset
                ) * 0.8;

            fly.material.opacity =
                0.35 +
                Math.sin(
                    elapsed * 2 +
                    data.offset
                ) * 0.3;
        }
    );


    /* -----------------------------------------------------
       FLOATING HEARTS
    ----------------------------------------------------- */

    hearts.forEach(
        (heart) => {

            const data =
                heart.userData;

            heart.position.x =
                data.baseX +
                Math.sin(
                    elapsed * 0.4 +
                    data.offset
                ) * 1.2;

            heart.position.y =
                data.baseY +
                Math.sin(
                    elapsed * 0.3 +
                    data.offset
                ) * 1.5;

            heart.position.z =
                data.baseZ +
                Math.cos(
                    elapsed * 0.25 +
                    data.offset
                ) * 0.8;

            heart.material.opacity =
                0.25 +
                Math.sin(
                    elapsed * 1.3 +
                    data.offset
                ) * 0.15;

            /*
               IMPORTANT:
               Sprite.rotation is read-only in recent Three.js.
               Therefore use material.rotation.
            */

            heart.material.rotation +=
                data.rotation;
        }
    );


    /* -----------------------------------------------------
       GLOWING ORBS
    ----------------------------------------------------- */

    orbs.forEach(
        (orb) => {

            const data =
                orb.userData;

            orb.material.opacity =
                0.08 +
                Math.sin(
                    elapsed * 0.6 +
                    data.offset
                ) * 0.08;
        }
    );


    /* -----------------------------------------------------
       MOON
    ----------------------------------------------------- */

    moon.rotation.y =
        elapsed * 0.02;


    /* -----------------------------------------------------
       BENCH HEART
    ----------------------------------------------------- */

    coupleHeart.position.y =
        3.8 +
        Math.sin(
            elapsed * 1.5
        ) * 0.12;

    coupleHeart.material.opacity =
        0.7 +
        Math.sin(
            elapsed * 2
        ) * 0.2;

    coupleHeart.material.rotation =
        Math.sin(
            elapsed * 0.5
        ) * 0.08;


    /* -----------------------------------------------------
       LANTERNS
    ----------------------------------------------------- */

    lanternLights.forEach(
        (light, index) => {

            light.intensity =
                1.3 +
                Math.sin(
                    elapsed * 1.5 +
                    index
                ) * 0.35;
        }
    );


    /* -----------------------------------------------------
       GROUND GLOW
    ----------------------------------------------------- */

    groundGlow.material.opacity =
        0.14 +
        Math.sin(
            elapsed * 0.7
        ) * 0.05;


    /* -----------------------------------------------------
       LIGHT BREATHING
    ----------------------------------------------------- */

    pinkLight.intensity =
        2.7 +
        Math.sin(
            elapsed * 0.8
        ) * 0.5;

    purpleLight.intensity =
        2.3 +
        Math.sin(
            elapsed * 0.6
        ) * 0.4;


    /* =====================================================
       SCENE 3 ANIMATION
    ===================================================== */

    if (scene3Started) {

        /* Galaxy rotation */

        if (scene3Objects[0]) {

            scene3Objects[0].rotation.y =
                elapsed * 0.025;
        }


        /* Central glow */

        if (scene3Objects[1]) {

            const pulse =
                1 +
                Math.sin(
                    elapsed * 1.2
                ) * 0.08;

            scene3Objects[1].scale.set(
                15 * pulse,
                15 * pulse,
                1
            );
        }


        /* Central heart */

        if (scene3Objects[2]) {

            const heart =
                scene3Objects[2];

            heart.position.y =
                1 +
                Math.sin(
                    elapsed * 1.4
                ) * 0.25;

            const pulse =
                2.2 +
                Math.sin(
                    elapsed * 2
                ) * 0.15;

            heart.scale.set(
                pulse,
                pulse,
                1
            );

            heart.material.opacity =
                0.75 +
                Math.sin(
                    elapsed * 2
                ) * 0.2;

            heart.material.rotation =
                Math.sin(
                    elapsed * 0.5
                ) * 0.08;
        }


        /* =================================================
           MEMORY HEARTS
        ================================================= */

        if (!scene3Merging) {

            scene3Hearts.forEach(
                (heart) => {

                    const data =
                        heart.userData;


                    /* Don't move after merging */

                    if (
                        data.mergeStart
                    )
                        return;


                    /* Floating movement */

                    heart.position.x =
                        data.baseX +
                        Math.sin(
                            elapsed * 0.45 +
                            data.offset
                        ) * 0.7;

                    heart.position.y =
                        data.baseY +
                        Math.sin(
                            elapsed * 0.8 +
                            data.offset
                        ) * 0.5;

                    heart.position.z =
                        data.baseZ +
                        Math.cos(
                            elapsed * 0.35 +
                            data.offset
                        ) * 0.5;


                    /* Hover */

                    let targetScale =
                        data.clicked
                            ? 1.45
                            : 1.35;


                    if (
                        data.hovered &&
                        !data.clicked
                    ) {

                        targetScale =
                            1.65;
                    }


                    data.targetScale =
                        targetScale;


                    const currentScale =
                        heart.scale.x;


                    const nextScale =
                        THREE.MathUtils.lerp(
                            currentScale,
                            data.targetScale,
                            0.12
                        );


                    heart.scale.set(
                        nextScale,
                        nextScale,
                        1
                    );


                    /* Glow */

                    if (
                        data.hovered
                    ) {

                        heart.material.opacity =
                            1;

                    } else if (
                        data.clicked
                    ) {

                        heart.material.opacity =
                            1;

                    } else {

                        heart.material.opacity =
                            0.65 +
                            Math.sin(
                                elapsed * 1.5 +
                                data.offset
                            ) * 0.15;
                    }


                    /*
                       Tiny rotation gives the heart
                       a floating magical feeling.
                    */

                    heart.material.rotation =
                        Math.sin(
                            elapsed * 0.5 +
                            data.offset
                        ) * 0.06;
                }
            );
        }


        /* =================================================
           FLOATING PLANETS
        ================================================= */

        scene3Orbs.forEach(
            (orb) => {

                const data =
                    orb.userData;

                data.angle +=
                    data.speed *
                    0.01;

                orb.position.x =
                    Math.cos(
                        data.angle
                    ) *
                    data.radius;

                orb.position.z =
                    Math.sin(
                        data.angle
                    ) *
                    data.radius;

                orb.position.y =
                    data.height +
                    Math.sin(
                        elapsed * 0.5 +
                        data.angle
                    ) * 0.5;
            }
        );
    }

/* =====================================================
   SCENE 4 ANIMATION
===================================================== */

if (scene4Started) {

    /* ---------------------------------------------
       Gift breathing
    --------------------------------------------- */

    if (scene4Gift && !scene4Opening) {

        scene4Gift.rotation.y =
            Math.sin(
                elapsed * 0.25
            ) * 0.025;

        scene4Gift.position.y =
            -1.1 +
            Math.sin(
                elapsed * 0.9
            ) * 0.08;
    }


    /* ---------------------------------------------
       Gift glow breathing
    --------------------------------------------- */

    if (scene4GiftGlow) {

        const glowPulse =
            1 +
            Math.sin(
                elapsed * 1.3
            ) * 0.08;

        scene4GiftGlow.scale.set(
            10 * glowPulse,
            10 * glowPulse,
            1
        );
    }


    /* ---------------------------------------------
       Sparkles
    --------------------------------------------- */

    scene4Sparkles.forEach(
        (sparkle) => {

            const data =
                sparkle.userData;

            sparkle.position.y =
                data.baseY +
                Math.sin(
                    elapsed *
                    data.speed +
                    data.offset
                ) * 0.7;

            sparkle.material.opacity =
                0.25 +
                Math.sin(
                    elapsed * 2 +
                    data.offset
                ) * 0.3;
        }
    );


    /* ---------------------------------------------
       Floating hearts
    --------------------------------------------- */

    scene4Hearts.forEach(
        (heart) => {

            const data =
                heart.userData;

            if (data.scene4Final) {

                heart.position.y =
                    4.5 +
                    Math.sin(
                        elapsed * 1.2
                    ) * 0.3;

                const scale =
                    1.5 +
                    Math.sin(
                        elapsed * 2
                    ) * 0.12;

                heart.scale.set(
                    scale,
                    scale,
                    1
                );

                heart.material.opacity =
                    0.7 +
                    Math.sin(
                        elapsed * 1.8
                    ) * 0.2;

                return;
            }


            heart.position.y =
                data.baseY +
                Math.sin(
                    elapsed *
                    data.speed +
                    data.offset
                ) * 0.7;

            heart.material.rotation =
                Math.sin(
                    elapsed * 0.5 +
                    data.offset
                ) * 0.08;

            heart.material.opacity =
                0.15 +
                Math.sin(
                    elapsed * 1.4 +
                    data.offset
                ) * 0.15;
        }
    );


    /* ---------------------------------------------
       Scene 4 lights
    --------------------------------------------- */

    if (!scene4Opening) {

        pinkLight.intensity =
            3 +
            Math.sin(
                elapsed * 0.8
            ) * 0.5;

        purpleLight.intensity =
            2.8 +
            Math.sin(
                elapsed * 0.6
            ) * 0.4;
    }
}

/* =====================================================
   SCENE 5 ANIMATION
===================================================== */

if (scene5Started) {

    /* ---------------------------------------------
       Envelope breathing
    --------------------------------------------- */

    if (
        scene5Envelope &&
        !scene5Opening
    ) {

        scene5Envelope.rotation.y =
            Math.sin(
                elapsed * 0.25
            ) * 0.025;

        scene5Envelope.position.y =
            -0.8 +
            Math.sin(
                elapsed * 0.9
            ) * 0.08;
    }


    /* ---------------------------------------------
       Envelope glow
    --------------------------------------------- */

    if (scene5LetterGlow) {

        const pulse =
            1 +
            Math.sin(
                elapsed * 1.2
            ) * 0.08;

        scene5LetterGlow.scale.set(
            14 * pulse,
            7 * pulse,
            1
        );

        scene5LetterGlow.material.opacity =
            0.1 +
            Math.sin(
                elapsed * 1.1
            ) * 0.035;
    }


    /* ---------------------------------------------
       Sparkles
    --------------------------------------------- */

    scene5Sparkles.forEach(
        (sparkle) => {

            const data =
                sparkle.userData;


            sparkle.position.x =
                data.baseX +
                Math.sin(
                    elapsed *
                        data.speed +
                    data.offset
                ) * 0.8;


            sparkle.position.y =
                data.baseY +
                Math.sin(
                    elapsed *
                        0.6 +
                    data.offset
                ) * 0.7;


            sparkle.position.z =
                data.baseZ +
                Math.cos(
                    elapsed *
                        0.5 +
                    data.offset
                ) * 0.6;


            sparkle.material.opacity =
                0.2 +
                Math.sin(
                    elapsed * 2 +
                    data.offset
                ) * 0.25;
        }
    );


    /* ---------------------------------------------
       Floating hearts
    --------------------------------------------- */

    scene5Hearts.forEach(
        (heart) => {

            const data =
                heart.userData;


            heart.position.x =
                data.baseX +
                Math.sin(
                    elapsed *
                        0.4 +
                    data.offset
                ) * 1.0;


            heart.position.y =
                data.baseY +
                Math.sin(
                    elapsed *
                        data.speed +
                    data.offset
                ) * 0.8;


            heart.position.z =
                data.baseZ +
                Math.cos(
                    elapsed *
                        0.3 +
                    data.offset
                ) * 0.7;


            heart.material.rotation =
                Math.sin(
                    elapsed * 0.5 +
                    data.offset
                ) * 0.08;


            heart.material.opacity =
                0.15 +
                Math.sin(
                    elapsed * 1.4 +
                    data.offset
                ) * 0.15;
        }
    );


    /* ---------------------------------------------
       Scene 5 lights
    --------------------------------------------- */

    if (!scene5Opening) {

        pinkLight.intensity =
            2.8 +
            Math.sin(
                elapsed * 0.8
            ) * 0.45;


        purpleLight.intensity =
            3.1 +
            Math.sin(
                elapsed * 0.6
            ) * 0.4;
    }
}



    /* =====================================================
       CAMERA PARALLAX
    ===================================================== */

    if (
        scene2Started &&
        !scene3Started
    ) {

        camera.position.x +=
            (
                mouseX * 2 -
                camera.position.x
            ) * 0.002;

        camera.position.y +=
            (
                4 -
                mouseY * 1.5 -
                camera.position.y
            ) * 0.002;
    }


    /* Scene 3 subtle parallax */

    if (
        scene3Started &&
        !scene3Merging
    ) {

        /*
           Keep the parallax subtle so it doesn't
           fight against OrbitControls.
        */

        camera.position.x +=
            (
                mouseX * 1.5 -
                camera.position.x
            ) * 0.001;

        camera.position.y +=
            (
                3 -
                mouseY * 1 -
                camera.position.y
            ) * 0.001;
    }


    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        const overlay =
            document.getElementById(
                "dark-overlay"
            );

        if (overlay) {

            setTimeout(
                () => {

                    overlay.style.opacity =
                        "0";

                    overlay.style.pointerEvents =
                        "none";

                },
                500
            );
        }
    }
);
