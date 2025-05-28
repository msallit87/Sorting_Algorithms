from typing import List, Dict
import time

def bubble_sort(arr: List[int]) -> Dict:
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
            'time': end_time - start_time
        }
    }

def merge_sort(arr: List[int]) -> Dict:
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
            'time': end_time - start_time
        }
    }