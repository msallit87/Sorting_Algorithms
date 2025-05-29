The **Sorting_Algorithms** project is a full-stack application that visualizes common sorting algorithms and provides AI-driven suggestions for the next steps. It consists of:

- **Backend**: A FastAPI service exposing endpoints to perform algorithmic sorts and AI suggestions via server-sent events.
- **Frontend**: A React application that lets users input datasets, choose an algorithm, and watch interactive visualizations, with optional challenge and narrative modes.

## Technologies Used

### Backend
- **Python 3.8+**: Core language used for API and algorithm implementations.
- **FastAPI**: Web framework for building REST and streaming endpoints.
- **Pydantic**: Data validation and settings management.
- **HTTPX**: Asynchronous HTTP client for AI suggestion streaming.
- **python-dotenv**: Loading environment variables from `.env` files.
- **Uvicorn**: ASGI server for running FastAPI.
- **CORS Middleware**: Allow cross-origin requests from the frontend.

### Frontend
- **React** (Hooks): Building interactive UI components.
- **Axios**: HTTP client for REST and streaming requests.
- **JavaScript (ES6+) & JSX**: Language and templating.
- **Web Speech API**: `SpeechSynthesisUtterance` for text-to-speech explanations.
- **CSS-in-JS**: Inline styling for simplicity.

## Project Structure
```
Sorting_Algorithms/
├─ backend/
│  ├─ algorithms/
│  │  ├─ base.py              # Abstract SortingAlgorithm class
│  │  ├─ bubble_sort.py       # BubbleSort implementation
│  │  ├─ insertion_sort.py    # InsertionSort implementation
│  │  ├─ merge_sort.py        # MergeSort implementation
│  │  ├─ quick_sort.py        # QuickSort implementation
│  │  ├─ sort_manager.py      # SortManager orchestrator
│  │  └─ sorting.py           # Legacy functional implementations
│  ├─ ai_routes.py            # AI Suggestion SSE endpoint
│  ├─ main.py                 # FastAPI app & REST endpoints
│  ├─ requirements.txt        # Python dependencies
│  └─ .env                    # Environment variables (excluded from repo)
└─ frontend/
   ├─ src/
   │  ├─ App.jsx              # Main React component
   │  ├─ index.js             # ReactDOM bootstrap
   │  └─ components/
   │     ├─ VisualBars.jsx    # Visualization of array as bars
   │     ├─ TTS.jsx           # Text-to-speech component
   │     └─ Challenge.jsx     # Challenge-mode input form
   ├─ public/
   │  └─ index.html           # HTML template
   └─ package.json            # JavaScript dependencies
```

---

## Backend Documentation

### main.py

#### `FastAPI` App Initialization
- **`app = FastAPI()`**: Creates the main application instance.
- **CORS Configuration**: Allows all origins, credentials, methods, and headers for local development or open access.
- **Environment Loading**: Uses `python-dotenv` to load `.env` when not running on Render.
- **Router Registration**: Includes AI suggestion router from `ai_routes`.

#### `SortRequest` (Pydantic Model)
```python
class SortRequest(BaseModel):
    array: List[int]
```
- Validates incoming JSON bodies for `/sort/{algorithm}`.

#### `POST /sort/{algorithm}`
```python
@app.post("/sort/{algorithm}")
def sort_array(algorithm: str, request: SortRequest):
    return sort_manager.sort(algorithm, request.array)
```
- **Parameters**:
  - `algorithm` (str): One of `bubble`, `merge`, `insertion`, `quick`.
  - `request.array` (List[int]): The list of integers to sort.
- **Returns**: A JSON object with:
  - `steps`: Array of step objects for visualization.
  - `sorted`: The fully sorted array.
  - `metrics`: Comparisons, swaps (if applicable), and execution time.

### ai_routes.py

#### `APIRouter` Initialization
- **`router = APIRouter()`**: Creates a sub-router for AI endpoints.

#### `POST /ai-suggest`
```python
@router.post("/ai-suggest")
async def ai_suggest(request: Request): ...
```
- **Purpose**: Streams AI-generated suggestions for the next sorting step.
- **Process**:
  1. Parses JSON body and extracts `array`.
  2. Calls an external AI API (e.g., OpenRouter) via `httpx` in streaming mode.
  3. Yields incremental text chunks back to the client as a `text/event-stream`.
- **Error Handling**:
  - Returns `400` on JSON decode errors.
  - Returns `500` on unexpected server errors.

### algorithms/base.py

#### `class SortingAlgorithm(ABC)`
- **Abstract Base Class** for all sorting algorithms.
- **Method**: `sort(self, arr: List[int]) -> Dict` (abstract)
  - Must be implemented by subclasses.
  - Should return a dict containing `steps`, `sorted`, and `metrics`.

### algorithms/bubble_sort.py

#### `class BubbleSort(SortingAlgorithm)`
- **Bubble Sort Algorithm**:
  - Iterates through the array multiple times.
  - Swaps adjacent out-of-order elements.
- **`sort(self, arr: List[int]) -> Dict`**:
  - **Parameters**: `arr` – list of integers (in-place modified).
  - **Returns**:
    - `steps`: List of step objects `{ type, indices, array, explanation }`.
    - `sorted`: The sorted array.
    - `metrics`: `{comparisons, swaps, time}`.

### algorithms/insertion_sort.py

#### `class InsertionSort(SortingAlgorithm)`
- **Insertion Sort Algorithm**:
  - Builds the sorted list one element at a time.
  - Inserts each element into its correct position in the sorted prefix.
- **`sort(self, arr: List[int]) -> Dict`**:
  - Tracks comparisons and shifts.
  - Emits a step when inserting an element.
  - Returns the same structure as other algorithms.

### algorithms/merge_sort.py

#### `class MergeSort(SortingAlgorithm)`
- **Merge Sort Algorithm** (divide & conquer):
  1. Recursively split array into halves.
  2. Merge sorted halves.
- **`sort(self, arr: List[int]) -> Dict`**:
  - Internal helper `divide()` does recursion and merge logic.
  - Tracks comparisons during merge.
  - Since swaps are not discrete, `swaps` is typically `N/A`.

### algorithms/quick_sort.py

#### `class QuickSort(SortingAlgorithm)`
- **Quick Sort Algorithm** (divide & conquer):
  1. Choose a pivot element.
  2. Partition array into elements `< pivot` and `>= pivot`.
  3. Recursively sort partitions.
- **`sort(self, arr: List[int]) -> Dict`**:
  - Uses `partition()` helper.
  - Tracks comparisons and swaps.

### algorithms/sort_manager.py

#### `class SortManager`
- Holds instances of each algorithm:
  ```python
  self.algorithms = {
    "bubble": BubbleSort(),
    "merge": MergeSort(),
    "insertion": InsertionSort(),
    "quick": QuickSort()
  }
  ```
- **`sort(self, algo: str, array: List[int]) -> Dict`**:
  - Dispatches to the chosen algorithm’s `sort()`.
  - Raises `ValueError` on unrecognized algorithm names.

### algorithms/sorting.py (Legacy Functional API)

Provides standalone functions:
- **`bubble_sort(arr)`**
- **`insertion_sort(arr)`**
- **`merge_sort(arr)`**
- **`quick_sort(arr)`**

They mirror the class-based implementations, returning the same dict structure.

---

## Frontend Documentation

### src/index.js

- **Entry Point**: Renders `<App />` into `<div id="root">` via `ReactDOM.createRoot`.

### src/App.jsx

#### `function App()`
- **State Hooks**:
  - `array` (string): Comma-separated user input.
  - `algorithm` (string): One of `bubble`, `merge`, `insertion`, `quick`.
  - `steps` (array): Sequence of step objects returned by backend.
  - `metrics` (object): Performance data.
  - `currentStep` (number): Index into `steps`.
  - `currentArray` (array): The array state at each step.
  - `highlight` (array): Indices to highlight.
  - `explanation` (string): Text explanation for the current step.
  - `ttsEnabled`, `challengeMode`, `narrativeMode` (booleans): UI modes.
  - `userGuess`, `feedback`, `stepHistory`, `aiSuggestion`, `isLoadingAI` (misc. controls).

- **Key Functions**:
  - `handleSort()`:
    - Parses `array` into `number[]`.
    - Calls `axios.post(<BACKEND_URL>/sort/${algorithm}, { array })`.
    - Populates `steps` and `metrics` on success.
  - `handleAISuggestion()`:
    - Streams AI hints via SSE from `/ai-suggest`.
    - Appends chunks to `aiSuggestion` state.
  - `animateSteps()`:
    - Iterates through `steps` with `setTimeout` to drive animation.
    - Updates `currentArray`, `highlight`, and `explanation`.
  - `handleNextStep()`:
    - Advances `currentStep` by one in narrative mode.
  - `handleGuess(guess)`:
    - Compares user input against expected step `"type"` and `"indices"`.
    - Adds feedback and records history.

- **JSX Layout**:
  1. Text input for the array.
  2. Dropdown select for algorithm.
  3. Buttons: “Sort”, “AI-Suggest Best Sorting Algorithm”.
  4. Mode toggles: Challenge, Narrative.
  5. Metrics display.
  6. `<VisualBars>` for graphical array.
  7. `<TTS>` for spoken explanations.
  8. `<Challenge>` form in challenge mode.
  9. AI suggestion viewer.

### src/components/VisualBars.jsx
```jsx
const VisualBars = ({ array, highlight }) => { ... }
```
- Renders each array element as a vertical bar.
- Highlights indices in `highlight` with a different color.

### src/components/TTS.jsx
```jsx
const TTS = ({ text }) => { ... }
```
- Uses Web Speech API to speak `text` when it changes.

### src/components/Challenge.jsx
```jsx
const Challenge = ({ currentStep, onGuess }) => { ... }
```
- Presents a text input and submit button.
- Calls `onGuess(guess)` when the user submits.

