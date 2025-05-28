from typing import List, Dict
from .base import SortingAlgorithm
import time

class MergeSort(SortingAlgorithm):
    # This class defines the structure and logic for MergeSort
    """
    Merge Sort: A divide-and-conquer algorithm that splits the list into halves,
    recursively sorts them and then merges the sorted halves.
    """
    def sort(self, arr: List[int]) -> Dict:
        # Executes the sorting algorithm and tracks steps for visualization.
        steps = []
        comparisons = 0

        def merge(left, right):
        # Merges two sorted lists during merge sort.
            nonlocal comparisons
            result = []
            while left and right:
                comparisons += 1
                l_val, r_val = left[0], right[0]
                steps.append({
                    'type': 'compare',
                    'values': [l_val, r_val],
                    'explanation': f'Compare left value {l_val} with right value {r_val}'
                })
                if l_val <= r_val:
                    result.append(left.pop(0))
                else:
                    result.append(right.pop(0))
            result += left or right
            return result

        def divide(lst):
        # Recursively divides the list for merge sort.
            if len(lst) <= 1:
                return lst
            mid = len(lst) // 2
            left = divide(lst[:mid])
            right = divide(lst[mid:])
            merged = merge(left, right)
            steps.append({
                'type': 'merge',
                'explanation': f'Merge step result: {merged}'
            })
            return merged

        start_time = time.time()
        sorted_arr = divide(arr.copy())
        end_time = time.time()

        return {
            'steps': steps,
            'sorted': sorted_arr,
            'metrics': {
                'comparisons': comparisons,
                'swaps': 'N/A',
                'time': round(end_time - start_time, 6)
            }
        }