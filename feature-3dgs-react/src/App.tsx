import { useState, useEffect, useRef, SetStateAction, ChangeEvent } from "react";
import { Button, Pane, SearchInput } from "evergreen-ui";
import * as SPLAT from "gsplat";

function App() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [splat, setSplat] = useState<SPLAT.Splat | null>(null);
    const [query, setQuery] = useState(""); // State to hold the search query
    const [scene, setScene] = useState<SPLAT.Scene | null>(null);

    useEffect(() => {
        if (!file) return;

        async function setupRenderer() {
            const renderer = new SPLAT.WebGLRenderer(null);
            if (!canvasRef.current) return;
            canvasRef.current.appendChild(renderer.canvas);

            renderer.canvas.style.width = "80%";
            renderer.canvas.style.height = "80%";
            renderer.canvas.style.marginTop = "50px";
            renderer.canvas.style.margin = "auto";

            const scene = new SPLAT.Scene();
            setScene(scene);
            const camera = new SPLAT.Camera();
            const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

            const plyLoader = new SPLAT.PLYLoader(scene);

            // Load the .ply file
            if (!file) return; //
            const splat = await plyLoader.LoadFromFileAsync(file, (progress: number) => {
                console.log("Loading PLY file: " + progress);
            });
            setSplat(splat);

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

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const uploadedFile = event.target.files[0];
            if (uploadedFile.name.endsWith(".ply")) {
                setFile(uploadedFile);
                setLoading(true);
            } else {
                alert("Please upload a valid .ply file.");
            }
        }
    };

    function highlightQuery(query: string) {
        if (!splat || !scene) return;
        console.log("Highlighting query: " + query);

        const newSplatData = splat.highlightFromTextQuery(query);
        const newSplat = new SPLAT.Splat(newSplatData);
        scene.reset();
        scene.addObject(newSplat);
    }

    function resetScene() {
        if (!splat || !scene) return;
        scene.reset();
        scene.addObject(splat);
    }

    return (
        <div>
            {!loading && (
                <div style={{ padding: "20px" }}>
                    <input type="file" onChange={handleFileChange} accept=".ply" />
                </div>
            )}
            {loading && (
                <Pane>
                    <Pane marginBottom="40px">
                        <SearchInput
                            placeholder="Find Objects"
                            margin="auto"
                            onChange={(e: { target: { value: SetStateAction<string> } }) => setQuery(e.target.value)}
                            value={query}
                        />
                        <Button
                            appearance="primary"
                            intent="success"
                            marginRight={16}
                            onClick={() => highlightQuery(query)}
                        >
                            Submit
                        </Button>

                        <Button appearance="primary" intent="danger" marginRight={16} onClick={() => resetScene()}>
                            Reset Scene
                        </Button>
                    </Pane>
                    <div ref={canvasRef}>{}</div>
                </Pane>
            )}
        </div>
    );
}

export default App;
