import * as SPLAT from "gsplat";

const renderer = new SPLAT.WebGLRenderer();
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

let loading = false;

// Creating a PLYLoader instance
const plyLoader = new SPLAT.PLYLoader(scene);

async function selectFile(file: File) {
    if (loading) return;
    loading = true;

    if (file.name.endsWith(".ply")) {
        const format = ""; // specify the format if needed, e.g., "polycam"
        try {
            const splat = await plyLoader.LoadFromFileAsync(
                file,
                (progress: number) => {
                    console.log("Loading PLY file: " + progress + "% complete");
                },
                format
            );
        } catch (error) {
            console.error("Failed to load the PLY file:", error);
        }

        // TODO: now you can do things with splat object.
    }
    loading = false;
}

async function main() {
    const frame = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);

    document.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer) {
            scene.reset(); // Clear the existing scene before loading new content
            selectFile(e.dataTransfer.files[0]);
        }
    });

    document.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
}

main();
