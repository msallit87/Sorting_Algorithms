# Sorting_Algorithms Setup Guide (Local Install)

This one-page guide walks you through setting up and running Sorting_Algorithms locally with a React frontend and a FastAPI backend.

---

## Prerequisites

Make sure you have these installed:

- **Node.js** (v16 or later) – https://nodejs.org/
- **Python 3.8+**
- **Git** (optional, for cloning from repo)

---

##  1. Clone or Download the Repo

If using Git:

```bash
git clone https://github.com/msallit/Sorting_Algorithms.git
cd sorting_algorithms
```

Or extract the zip if you downloaded it.

You should see:

```
sorting_algorithms/
├── frontend/   (React app)
└── backend/    (FastAPI app)
```

---

##  2. Run the Backend (FastAPI)

### a. Navigate to the backend folder

```bash
cd backend
```

### b. Create a virtual environment

```bash
python -m venv venv
```

### c. Activate the virtual environment

- **Windows**
```bash
venv\Scripts\activate
```

- **Mac/Linux**
```bash
source venv/bin/activate
```

### d. Install dependencies

```bash
pip install -r requirements.txt
```

### e. Start the FastAPI server

```bash
python -m uvicorn main:app --reload
```

Test the API at: http://localhost:8000/docs

---

## 3. Run the Frontend (React)

### a. Open a new terminal and go to the frontend folder
```bash
cd frontend
```

### b. Install dependencies

```bash
npm install
```

### c. Start the React app

```bash
npm start
```

Visit: http://localhost:3000


You can now interact with the Sorting_Algorithms sorting visualizer. Happy sorting!