function cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

class SemanticSimilarity {
    private data: Float32Array;
    private vectorSize: number;
    private vertexCount: number;

    constructor(data: Float32Array, vectorSize: number = 512) {
        this.data = data;
        this.vectorSize = vectorSize;
        this.vertexCount = data.length / vectorSize;
    }

    getVector(index: number): Float32Array {
        const start = index * this.vectorSize;
        return this.data.slice(start, start + this.vectorSize);
    }

    findSimilarVectors(baseIndex: number, threshold: number = 0.9): number[] {
        const baseVector = this.getVector(baseIndex);
        let similarIndices: number[] = [];

        for (let i = 0; i < this.vertexCount; i++) {
            console.log(`Comparing ${baseIndex} to ${i}`);
            if (i === baseIndex) continue; // Skip comparing the vector to itself

            const otherVector = this.getVector(i);
            const similarity = cosineSimilarity(baseVector, otherVector);

            if (similarity >= threshold) {
                similarIndices.push(i);
            }
        }

        return similarIndices;
    }
}

export default SemanticSimilarity;
