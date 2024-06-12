import { useState, useEffect, useRef } from "react";
import { SearchInput } from "evergreen-ui";
import * as SPLAT from "gsplat";

function App() {
    const canvasRef = useRef(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!file) return; // Do not proceed if no file is selected

        async function setupRenderer() {
            const renderer = new SPLAT.WebGLRenderer(null);
            canvasRef.current.appendChild(renderer.canvas);

            renderer.canvas.style.width = "80%";
            renderer.canvas.style.height = "80%";
            renderer.canvas.style.margin = "auto";

            const scene = new SPLAT.Scene();
            const camera = new SPLAT.Camera();
            const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

            // Load the .ply file
            await SPLAT.PLYLoader.LoadFromFileAsync(file, scene, (progress: number) => {
                console.log("Loading PLY file: " + progress);
            });

            // Start the rendering loop
            const frame = () => {
                controls.update();
                renderer.render(scene, camera);
                requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);

            // Cleanup function to properly dispose resources when component unmounts
            return () => {
                renderer.dispose();
            };
        }

        setupRenderer();
    }, [file]);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            const uploadedFile = event.target.files[0];
            if (uploadedFile.name.endsWith(".ply")) {
                setFile(uploadedFile);
                setLoading(true);
            } else {
                alert("Please upload a valid .ply file.");
            }
        }
    };

    return (
        <div>
            {!loading && (
                <div style={{ padding: "20px" }}>
                    <input type="file" onChange={handleFileChange} accept=".ply" />
                </div>
            )}
            {loading && (
                <>
                    <SearchInput placeholder="Filter traits..." margin="auto" />
                    <div ref={canvasRef}>{}</div>
                </>
            )}
        </div>
    );
}

export default App;
