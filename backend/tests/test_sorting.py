
import unittest
from algorithms.sort_manager import SortManager

class TestSortingAlgorithms(unittest.TestCase):
    def setUp(self):
        self.manager = SortManager()

    def test_bubble_sort(self):
        result = self.manager.sort("bubble", [4, 2, 1, 3])
        self.assertEqual(result['sorted'], [1, 2, 3, 4])

    def test_merge_sort(self):
        result = self.manager.sort("merge", [4, 2, 1, 3])
        self.assertEqual(result['sorted'], [1, 2, 3, 4])

    def test_insertion_sort(self):
        result = self.manager.sort("insertion", [4, 2, 1, 3])
        self.assertEqual(result['sorted'], [1, 2, 3, 4])

    def test_quick_sort(self):
        result = self.manager.sort("quick", [4, 2, 1, 3])
        self.assertEqual(result['sorted'], [1, 2, 3, 4])

    def test_sorted_input(self):
        result = self.manager.sort("bubble", [1, 2, 3, 4])
        self.assertEqual(result['sorted'], [1, 2, 3, 4])

    def test_empty_input(self):
        result = self.manager.sort("bubble", [])
        self.assertEqual(result['sorted'], [])

    def test_single_element(self):
        result = self.manager.sort("bubble", [42])
        self.assertEqual(result['sorted'], [42])

    def test_duplicates(self):
        result = self.manager.sort("bubble", [3, 1, 2, 1, 3])
        self.assertEqual(result['sorted'], [1, 1, 2, 3, 3])

    def test_invalid_algorithm(self):
        with self.assertRaises(ValueError):
            self.manager.sort("invalid_algo", [1, 2, 3])
    
    def test_invalid_data(self):
        with self.assertRaises(TypeError):
            self.manager.sort("bubble", ["a", 2, 3])

if __name__ == "__main__":
    unittest.main()
