import sys
import threading
from ib_insync import *

class Order:
    def __init__(self, ib):
        self.ib = ib