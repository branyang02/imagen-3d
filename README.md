# IMAGEN 3D Library

### Pre-requisites

1. `emcc` is installed and available in the PATH. Instructions to install `emcc` can be found [here](https://emscripten.org/docs/getting_started/downloads.html).
2. `npm` is installed. Instructions to install `npm` can be found [here](https://www.npmjs.com/get-npm).

### Setup

1. Clone the repository

```
git clone https://github.com/branyang02/imagen-3d.git
```

2. Install dependencies

```
cd imagen-3d
npm install
```

### Usage

1. Navigate to `gsplat` and run `npm run watch`. This builds the `dist` library in `gsplat` which is used by `3dgs-app`

```
cd gsplat
npm run watch
```

Note, if `rollup` is not installed, run `npm install rollup` to install it.

2. Open a new terminal window and navigate to `3dgs-app` and run `npm run dev` to start developing

```
cd 3dgs-app
npm run dev
```

Note: `npm run watch` automatically watches for changes in `gsplat` and will auto rebuild `dist`.
