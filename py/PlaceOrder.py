import sys
import threading
from ib_insync import *
from utils.tools import copy, Struct
import json
import asyncio

class PlaceOrder:
    def __init__(self, ib):
        self.ib = ib
        self.ib.connectEvent += self.onConnect
        self.ib.contractEvent += self.onContractError        
        self.status_cb = None   # js callback for order status
        self.error_cb = None
        self.orders = {} 

    def __checkIBReady(self):
        ib = None
        if (self.ib.getPIB() == None):
            print('PIB is not initialized -- Order.__checkIBReady')
            return None
        else:
            ib = self.ib.getPIB()            
        return ib

    def __json_object_hook(self, d): return namedtuple('X', d.keys())(*d.values())

    def json2obj(self, data): return json.loads(data, object_hook=self.__json_object_hook)

    def copyTrade(self, src, dest):
        tmp = Struct(*'contract order orderStatus fills log'.split())()
        copy(src, dest)

    def onContractError(self, contract):
        tmp = Struct(*'conId secType symbol contractMonth lastTradeDateOrContractMonth \
                localSymbol exchange primaryExchange currency multiplier longName tradingClass'.split())()
        copy(contract['contract'], tmp)
        contract['contract'] = tmp
        self.__errorCB(contract)

    def onModifyOrder(self, trade):
        self.__statusCB({'status': 'modifying', 'trade': trade})

    def onCancelOrder(self, trade):
        self.__statusCB({'status': 'cancelling', 'trade': trade})

    def onCancelledOrder(self, trade):
        self.__statusCB({'status': 'cancelled', 'trade': trade})

    def onFill(self, trade):
        self.__statusCB({'status': 'filling', 'trade': trade})

    def onFilled(self, trade):
        self.__statusCB({'status': 'filled', 'trade': trade})
    
    def onCommissionReport(self, trade, fill):
        self.__statusCB({'status': 'commission', 'fill': fill})

    def onStatusChanged(self, trade):
        self.__statusCB({'status': trade.OrderorderStatus.status, 'trade': trade})

    def onError(self, reqId, errorCode, errorString, contract):
        if (contract.conId in self.orders):
            err = {'conId': contract.conId, 'code': errorCode, 'msg': errorString}
            self.__errorCB(err)

    def setErrorCallback(self, val, js_cb):
        if hasattr(js_cb, 'Call'):
            self.error_cb = js_cb

    def setStatusCallback(self, val, js_cb):
        if hasattr(js_cb, 'Call'):
            self.status_cb = js_cb

    def __statusCB(self, msg):
        if hasattr(self.status_cb, 'Call'):
            self.status_cb.Call(json.dumps(msg, default=lambda o:o.__dict__ ))

    def __errorCB(self, msg):
        if hasattr(self.error_cb, 'Call'):
            self.error_cb.Call(json.dumps(msg, default=lambda o:o.__dict__ ))

    def onConnect(self, msg):
        print('on connect')
    
    def placeOrder(self, orders):
        """orders has the following struct:
            order: {'contract': conId, 'order': 'MarketOrder('BUY', 100)}
        """
        ib = self.__checkIBReady()
        if ib == None: 
            self.__errorCB("Disconnected")
            return

        orders = json.load(orders)

        for o in orders:
            o['order'] = eval(o['order'])
            o['contract'] = Contract(conId=o['contract'])
            ib.qualifyContracts(o['contract'])

        for o in orders:
            if o['contract'].conId not in self.orders:
                asyncio.run_coroutine_threadsafe(self.__placeOrder(ib.IB, o), ib.loop) 

    def __placeOrder(self, ib, order):
        t = ib.placeOrder(order['contract'], order['order'])
        self.orders[order['contract'].conId] = t
        t.modifyEvent += self.onModifyOrder
        t.cancelOrderEvent += self.onCancelOrder
        t.cancelledOrderEvent += self.onCancelledOrder
        t.commissionReportEvent += self.onCommissionReport
        t.fillEvent += self.onFill
        t.filledEvent += self.onFilled
        t.statusEvent += self.onStatusChanged

    def cancelOrder(self, contracts):
        ib = self.__checkIBReady()
        if ib == None: 
            self.__errorCB("Disconnected")
            return
        
        contracts = json.load(contracts)
        for c in contracts:
            if c.conId in self.orders:
                if self.orders[c.conId].orderStatus.status in ['Submitted', 'PreSubmitted']:
                    asyncio.run_coroutine_threadsafe(self.__cancelOrder(ib.IB, self.orders[c.conId].order), ib.loop)

    def __cancelOrder(self, ib, order):
        ib.cancelOrder(order)

    def getPositions(self):
        ib = self.__checkIBReady()
        if ib == None: 
            self.__errorCB("Disconnected")
            return

        future = asyncio.run_coroutine_threadsafe(self.__getPositions(ib.IB), ib.loop) 
        return future.result()

    def __getPositions(self, ib):
        ps = ib.positions()
        return ps