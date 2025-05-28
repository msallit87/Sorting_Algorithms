from typing import List, Dict
from .base import SortingAlgorithm
import time

class InsertionSort(SortingAlgorithm):
    # This class defines the structure and logic for InsertionSort
    """
    Insertion Sort: Builds the final sorted array one item at a time.
    It is much less efficient on large lists than more advanced algorithms.
    """
    def sort(self, arr: List[int]) -> Dict:
        # Executes the sorting algorithm and tracks steps for visualization.
        steps = []
        comparisons = 0
        swaps = 0
        start_time = time.time()

        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            steps.append({'type': 'compare', 'indices': [j, i], 'explanation': f'Compare {arr[j]} and {key}'})
            while j >= 0 and arr[j] > key:
                comparisons += 1
                arr[j + 1] = arr[j]
                j -= 1
                swaps += 1
                steps.append({'type': 'swap', 'indices': [j + 1, j + 2], 'array': arr.copy(), 'explanation': f'Move {arr[j + 1]} forward'})
            arr[j + 1] = key
            swaps += 1
            steps.append({'type': 'insert', 'indices': [j + 1], 'array': arr.copy(), 'explanation': f'Insert {key} at position {j + 1}'})

        end_time = time.time()
        return {
            'steps': steps,
            'sorted': arr,
            'metrics': {
                'comparisons': comparisons,
                'swaps': swaps,
                'time': round(end_time - start_time, 6)
            }
        }