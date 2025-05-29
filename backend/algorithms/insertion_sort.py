# backend/algorithms/insertion_sort.py

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
        steps = []
        comparisons = 0
        swaps = 0
        start_time = time.time()

        # We’ll work on a copy so we don’t mutate the caller’s list
        a = arr.copy()

        for i in range(1, len(a)):
            key = a[i]
            j = i - 1

            # Compare key backwards through the sorted prefix
            while j >= 0:
                comparisons += 1
                steps.append({
                    'type': 'compare',
                    'indices': [j, i],
                    'array': a.copy(),
                    'explanation': f'Compare index {j} ({a[j]}) with key {key}'
                })
                if a[j] > key:
                    # Shift element right
                    a[j + 1] = a[j]
                    swaps += 1
                    steps.append({
                        'type': 'swap',
                        'indices': [j + 1, j],
                        'array': a.copy(),
                        'explanation': f'Move {a[j + 1]} from index {j} to {j + 1}'
                    })
                    j -= 1
                else:
                    break

            # Insert the key into its correct spot
            a[j + 1] = key
            swaps += 1
            steps.append({
                'type': 'insert',
                'indices': [j + 1],
                'array': a.copy(),
                'explanation': f'Insert key {key} at index {j + 1}'
            })

        end_time = time.time()
        return {
            'steps': steps,
            'sorted': a,
            'metrics': {
                'comparisons': comparisons,
                'swaps': swaps,
                'time': round((end_time - start_time) * 1000, 2)
            }
        }
