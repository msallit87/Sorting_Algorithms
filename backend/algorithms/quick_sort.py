from typing import List, Dict
from .base import SortingAlgorithm
import time

class QuickSort(SortingAlgorithm):
    # This class defines the structure and logic for QuickSort
    """
    Quick Sort: Divide-and-conquer algorithm that picks an element as pivot and partitions the array.
    """
    def sort(self, arr: List[int]) -> Dict:
        # Executes the sorting algorithm and tracks steps for visualization.
        steps = []
        comparisons = 0
        swaps = 0

        def quicksort(low, high):
        # Executes the sorting algorithm and tracks steps for visualization.
            nonlocal comparisons, swaps
            if low < high:
                pi = partition(low, high)
                quicksort(low, pi - 1)
                quicksort(pi + 1, high)

        def partition(low, high):
        # Partitions the list around a pivot for quicksort.
            nonlocal comparisons, swaps
            pivot = arr[high]
            i = low - 1
            for j in range(low, high):
                comparisons += 1
                steps.append({'type': 'compare', 'indices': [j, high], 'explanation': f'Compare {arr[j]} with pivot {pivot}'})
                if arr[j] <= pivot:
                    i += 1
                    arr[i], arr[j] = arr[j], arr[i]
                    swaps += 1
                    steps.append({'type': 'swap', 'indices': [i, j], 'array': arr.copy(), 'explanation': f'Swap {arr[i]} with {arr[j]}'})
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            swaps += 1
            steps.append({'type': 'swap', 'indices': [i + 1, high], 'array': arr.copy(), 'explanation': f'Swap pivot {pivot} to position {i + 1}'})
            return i + 1

        start_time = time.time()
        quicksort(0, len(arr) - 1)
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