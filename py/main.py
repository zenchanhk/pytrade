from cefpython3 import cefpython as cef
import platform
import sys
import os
import threading
from IBConnector import IBConnector
from ib_insync import *
from Symbol import Symbol
from PlaceOrder import PlaceOrder
from configobj import ConfigObj
from collections import namedtuple
from utils.tools import copyall
import json

WINDOWS = (platform.system() == "Windows")

class configHandler(object):
    def __init__(self):
        self.cfgfile = os.path.join(os.path.dirname(sys.argv[0]), 'config.ini') 
        self.orderfile = 'order'
        self.config = ConfigObj(self.cfgfile, encoding='UTF8')        
        self.orders = ConfigObj(self.orderfile, encoding='UTF8')

    def getCfg(self):
        return self.config

    def readAppCfg(self, sections, js_cb):
        result = []
        for sec in sections:
            result.append(self.config[sec])
        if hasattr(js_cb, "Call"):
            js_cb.Call(json.dumps(result, default=lambda o:o.__dict__ ))

    def saveAppCfg(self, cfg, js_cb):
        c = json.loads(cfg)
        for k in c.keys():
            self.config[k] = c[k]
        self.config.write()
        if hasattr(js_cb, "Call"):
            js_cb.Call('OK')

    def readOrders(self, order_no, js_cb):
        if hasattr(js_cb, "Call"):
            js_cb.Call(self.config[order_no])

    def saveOrders(self, cfg):
        copyall(self.json2obj(cfg), self.orders)
        self.orders.write()

    '''
    def __read(self, path):
        result = []
        self.config.read(self.cfgfile)
        for sec in self.config.sections():
            result.append(dict(self.config.items(sec)))
        return result

    def __write(self, cfg, path):
        with open(path, 'w') as configfile:
            self.config.write(configfile)'''

    def __json_object_hook(self, d): return namedtuple('X', d.keys())(*d.values())

    def json2obj(self, data): return json.loads(data, object_hook=self.__json_object_hook)

cfgHandler = configHandler()
ibcon = IBConnector(cfgHandler.getCfg()) 

def main():        
    check_versions()
    #sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
    # To change user agent use either "product_version"
    # or "user_agent" options. Explained in Tutorial in
    # "Change user agent string" section.
    settings = {
        # "product_version": "MyProduct/10.00",
        # "user_agent": "MyAgent/20.00 MyProduct/10.00",
        "auto_zooming": "0.0"
    }
    if WINDOWS:
        # noinspection PyUnresolvedReferences, PyArgumentList
        #cef.DpiAware.EnableHighDpiSupport()
        cef.DpiAware.SetProcessDpiAware()  # Alternative is to embed manifest
    cef.Initialize(settings=settings)
    set_global_handler()
    #path = os.path.normpath(os.path.join(os.path.dirname(sys.argv[0]), os.pardir, os.pardir))
    #htmlfile = os.path.join(path, 'html', 'index.html')
    #browser = cef.CreateBrowserSync(url=htmlfile,
    #browser = cef.CreateBrowserSync(url="file:///d:/ib/t1/dist/index.html",
    browser = cef.CreateBrowserSync(url="http://localhost:8080/#/",
                                    window_title="IB Trader")
    set_client_handlers(browser)
    set_javascript_bindings(browser)
    cef.MessageLoop()
    cef.Shutdown()


def check_versions():
    ver = cef.GetVersion()
    print("[tutorial.py] CEF Python {ver}".format(ver=ver["version"]))
    print("[tutorial.py] Chromium {ver}".format(ver=ver["chrome_version"]))
    print("[tutorial.py] CEF {ver}".format(ver=ver["cef_version"]))
    print("[tutorial.py] Python {ver} {arch}".format(
           ver=platform.python_version(),
           arch=platform.architecture()[0]))
    assert cef.__version__ >= "57.0", "CEF Python v57.0+ required to run this"


def html_to_data_uri(html, js_callback=None):
    # This function is called in two ways:
    # 1. From Python: in this case value is returned
    # 2. From Javascript: in this case value cannot be returned because
    #    inter-process messaging is asynchronous, so must return value
    #    by calling js_callback.
    html = html.encode("utf-8", "replace")   


def set_global_handler():
    # A global handler is a special handler for callbacks that
    # must be set before Browser is created using
    # SetGlobalClientCallback() method.
    global_handler = GlobalHandler()
    cef.SetGlobalClientCallback("OnAfterCreated",
                                global_handler.OnAfterCreated)


def set_client_handlers(browser):
    client_handlers = [LoadHandler(), DisplayHandler()]
    for handler in client_handlers:
        browser.SetClientHandler(handler)


def set_javascript_bindings(browser):
    
    symbol = Symbol(browser, ibcon)
    #symbol.getContractDetails('hsi',1)
    #symbol.t()
    #c1 = Contract(conId=305074193, exchange='HKFE')
    #c = Forex("USDJPY") #12087792
    #symbol.subMktData(12087792) 
    #time.sleep(5)
    #symbol.unsubMktData(12087792)
    order = PlaceOrder(ibcon)
    

    bindings = cef.JavascriptBindings(
            bindToFrames=False, bindToPopups=False)
    bindings.SetProperty("python_property", "This property was set in Python")
    bindings.SetProperty("cefpython_version", cef.GetVersion())
    bindings.SetFunction("html_to_data_uri", html_to_data_uri)
    bindings.SetObject("symbol", symbol)
    bindings.SetObject("ibcon", ibcon)
    bindings.SetObject("order", order)
    bindings.SetObject("config", cfgHandler)
    browser.SetJavascriptBindings(bindings)


def js_print(browser, lang, event, msg):
    # Execute Javascript function "js_print"
    # browser.ExecuteFunction("App.js_print", lang, event, msg)
    print('js_print called')


class GlobalHandler(object):
    def OnAfterCreated(self, browser, **_):
        """Called after a new browser is created."""
        # DOM is not yet loaded. Using js_print at this moment will
        # throw an error: "Uncaught ReferenceError: js_print is not defined".
        # We make this error on purpose. This error will be intercepted
        # in DisplayHandler.OnConsoleMessage.  
        # ibcon.connectIB()      
        print('')


class LoadHandler(object):
    def OnLoadingStateChange(self, browser, is_loading, **_):
        """Called when the loading state has changed."""
        if not is_loading:
            # Loading is complete. DOM is ready.
            js_print(browser, "Python", "OnLoadingStateChange",
                     "Loading is complete")
            #ibcon.connectIB()    
            ibcon.connect()    

class DisplayHandler(object):
    def OnConsoleMessage(self, browser, message, **_):
        """Called to display a console message."""
        # This will intercept js errors, see comments in OnAfterCreated
        if "error" in message.lower() or "uncaught" in message.lower():
            # Prevent infinite recurrence in case something went wrong
            if "js_print is not defined" in message.lower():
                if hasattr(self, "js_print_is_not_defined"):
                    print("Python: OnConsoleMessage: "
                          "Intercepted Javascript error: "+message)
                    return
                else:
                    self.js_print_is_not_defined = True
            # Delay print by 0.5 sec, because js_print may not be
            # available yet due to DOM not ready.
            args = [browser, "Python", "OnConsoleMessage",
                    "(Delayed) Intercepted Javascript error: <i>{error}</i>"
                    .format(error=message)]
            threading.Timer(0.5, js_print, args).start()

if __name__ == '__main__':    
    main()