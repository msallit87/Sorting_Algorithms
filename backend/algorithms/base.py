from typing import List, Dict
from abc import ABC, abstractmethod

class SortingAlgorithm(ABC):
    # This class defines the structure and logic for SortingAlgorithm
    @abstractmethod
    def sort(self, arr: List[int]) -> Dict:
        # Executes the sorting algorithm and tracks steps for visualization.
        pass