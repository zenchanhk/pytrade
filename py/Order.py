import base64
import platform
import sys
import threading
from ib_insync import *
import pandas as pd

class Order:
    def __init__(self, ib):
        self.ib = ib