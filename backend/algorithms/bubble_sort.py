from typing import List, Dict
from .base import SortingAlgorithm
import time

class BubbleSort(SortingAlgorithm):
    # This class defines the structure and logic for BubbleSort
    """
    Bubble Sort: Repeatedly steps through the list, compares adjacent elements and swaps them
    if they are in the wrong order. This is repeated until the list is sorted.
    """
    def sort(self, arr: List[int]) -> Dict:
        # Executes the sorting algorithm and tracks steps for visualization.
        steps = []
        n = len(arr)
        comparisons = 0
        swaps = 0
        start_time = time.time()

        for i in range(n):
            for j in range(0, n-i-1):
                comparisons += 1
                steps.append({
                    'type': 'compare',
                    'indices': [j, j+1],
                    'explanation': f'Compare element at index {j} ({arr[j]}) with element at index {j+1} ({arr[j+1]})'
                })
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]
                    swaps += 1
                    steps.append({
                        'type': 'swap',
                        'indices': [j, j+1],
                        'array': arr.copy(),
                        'explanation': f'Swap element {arr[j+1]} with {arr[j]}'
                    })

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