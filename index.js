
const buttons = document.querySelectorAll("button.btn");
const panels = document.querySelectorAll(".panel");

buttons.forEach((button) =>{
  button.addEventListener("click", () =>{
    panels.forEach((panel) => panel.classList.remove("active"));
    document.getElementById(button.dataset.panel).classList.add("active");
  });
});


const items = document.querySelectorAll("h2,p,cards");
items.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  {threshold: 0.15}
);

items.forEach((el) => observer.observe(el));



const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const c = document.createElement("canvas");
c.width = 512;
c.height = 256;
const g = c.getContext("2d");
const grad = g.createLinearGradient(0, 0, 0, 256);
grad.addColorStop(0, "#ffffff");
grad.addColorStop(0.35, "#8a93a3");
grad.addColorStop(0.5, "#14161c");
grad.addColorStop(0.7, "#c2c9d4");
grad.addColorStop(1, "#2a2e38");
g.fillStyle = grad;
g.fillRect(0, 0, 512, 256);
g.fillStyle = "#ffffff";
for (let i = 0; i < 6; i++) g.fillRect(i * 90 + 20, 50, 28, 80);

const envTex = new THREE.CanvasTexture(c);
envTex.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = new THREE.PMREMGenerator(renderer).fromEquirectangular(envTex).texture;


const camera = new THREE.PerspectiveCamera(40,window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const material = new THREE.MeshStandardMaterial({
  color: 0xd9dde3,
  metalness: 1,
  roughness: 0.05,
  flatShading: true
});

function makePart(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.05
  });
  geo.center();
  return new THREE.Mesh(geo, material);
}

const left = makePart([[1.4, 0], [1, 0], [0, 1], [1, 2], [1.4, 2], [0.4, 1]]);   // <
const slash = makePart([[0, 0], [0.4, 0], [1, 2.6], [0.6, 2.6]]);                // /
const right = makePart([[0, 0], [0.4, 0], [1.4, 1], [0.4, 2], [0, 2], [1, 1]]);  // >

left.position.x = -1.8;
right.position.x = 1.8;

const logo = new THREE.Group();
logo.add(left, slash, right);
logo.position.y = 0.5;
scene.add(logo);


function animate() {
  logo.rotation.y += 0.0007;
  logo.rotation.x = performance.now() * 0.00007 + window.scrollY * 0.002;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});



