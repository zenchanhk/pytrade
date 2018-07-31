from ib_insync import *
import datetime
import math

def to_json(obj):
    result = []
    if hasattr(obj, '__dict__'):
        return obj.__dict__
    else:
        for attr in dir(obj):
            if not attr.startswith('_'):
                result.append(attr)
        return result

def copyall(src, dest):
    """simple copy"""
    for attr in src.__dict__:
        #if type(getattr(src, attr)) in [int, bool, str, float]
        setattr(dest, attr, getattr(src, attr))

def copy(src, dest):
    """copy with the same attributes between src and dest"""
    
    #copy  
    try:
        for attr in dir(dest):
            if not attr.startswith('_') and attr in dir(src):
                #check if Contract or its subclass
                if not isinstance(getattr(src, attr), Contract):
                    val = getattr(src, attr)
                    if type(val) is float and math.isnan(val):
                        val = '--'
                    else:
                        setattr(dest, attr, getattr(src, attr))
                else:
                    tmp = Struct(*'conId secType symbol contractMonth lastTradeDateOrContractMonth \
                        localSymbol exchange primaryExchange currency multiplier longName tradingClass'.split())()
                    setattr(dest, attr, tmp)
                    copy(getattr(src, attr), getattr(dest, attr))
    except Exception as e:
        print(e)
    


def Struct(*args, **kwargs):
    def init(self, *iargs, **ikwargs):
        for k,v in kwargs.items():
            setattr(self, k, v)
        for i in range(len(iargs)):
            setattr(self, args[i], iargs[i])
        for k,v in ikwargs.items():
            setattr(self, k, v)

    name = kwargs.pop("name", "MyStruct")
    kwargs.update(dict((k, None) for k in args))
    return type(name, (object,), {'__init__': init}) #, '__slots__': kwargs.keys() used to prevent from creating more attributes


