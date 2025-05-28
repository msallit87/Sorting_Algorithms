from typing import List, Dict
from .bubble_sort import BubbleSort
from .merge_sort import MergeSort
from .insertion_sort import InsertionSort
from .quick_sort import QuickSort

class SortManager:
    # This class defines the structure and logic for SortManager:
    def __init__(self):
        # Initializes the class instance with necessary attributes.
        self.algorithms = {
            "bubble": BubbleSort(),
            "merge": MergeSort(),
            "insertion": InsertionSort(),
            "quick": QuickSort()
}

    def sort(self, algo: str, array: List[int]) -> Dict:
        # Executes the sorting algorithms and tracks steps for visualization.
        if algo in self.algorithms:
            return self.algorithms[algo].sort(array)
        raise ValueError(f"Unknown algorithm: {algo}")