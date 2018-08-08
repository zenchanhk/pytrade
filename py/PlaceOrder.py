import sys
import threading
from ib_insync import *
from .utils.tools import copy, Struct, convertDict
import json
import asyncio

class PlaceOrder:
    def __init__(self, ib):
        self.ib = ib
        self.ib.connectEvent += self.onConnect
        self.ib.contractEvent += self.onContractError        
        self.status_cb = None   # js callback for order status
        self.error_cb = None
        self.trades = {} 

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

    def onContractError(self, contract):
        tmp = copy(contract['contract'])
        contract['contract'] = tmp
        self.__errorCB(contract)

    def onModifyOrder(self, trade):
        self.__statusCB({'status': 'modifying', 'trade': trade})

    def onCancelOrder(self, trade):
        self.__statusCB({'status': 'cancelling', 'trade': trade})

    def onCancelledOrder(self, trade):
        self.__statusCB({'status': 'cancelled', 'trade': trade})

    def onFill(self, trade, fill):
        self.__statusCB({'status': 'filling', 'fill': fill})
    
    def onCommissionReport(self, trade, fill, report):
        self.__statusCB({'status': 'commission', 'trade': trade, 'report': report})

    def onStatusChanged(self, trade):
        self.__statusCB({'status': trade.orderStatus.status, 'trade': trade})

    def onError(self, reqId, errorCode, errorString, contract):
        if (contract.conId in self.trades):
            err = {'conId': contract.conId, 'code': errorCode, 'msg': errorString}
            self.__errorCB(err)

    def setErrorCallback(self, val, js_cb):
        if hasattr(js_cb, 'Call'):
            self.error_cb = js_cb

    def setStatusCallback(self, val, js_cb):
        if hasattr(js_cb, 'Call'):
            self.status_cb = js_cb

    def __statusCB(self, msg):
        print(msg)
        if hasattr(self.status_cb, 'Call'):
            tmp = convertDict(msg)
            self.status_cb.Call(json.dumps(tmp, default=lambda o:o.__dict__ ))

    def __errorCB(self, msg):
        if hasattr(self.error_cb, 'Call'):
            self.error_cb.Call(json.dumps(msg, default=lambda o:o.__dict__ ))

    def onConnect(self, msg):
        print('on connect')
    
    def placeOrder(self, orders):
        """orders has the following struct:
            order: {'contract': conId, 'order': 'MarketOrder('BUY', 100)'}
        """
        ib = self.__checkIBReady()
        if ib == None: 
            self.__errorCB("Disconnected")
            return

        orders = json.loads(orders)

        for o in orders:
            o['order'] = eval(o['order'])        

        for o in orders:            
            asyncio.run_coroutine_threadsafe(self.__placeOrder(ib.IB, o), ib.loop) 

    async def __placeOrder(self, ib, order):
        order['contract'] = Contract(conId=order['contract']['conId'])
        await ib.qualifyContractsAsync(order['contract'])
        t = ib.placeOrder(order['contract'], order['order'])
        self.trades[order['contract'].conId] = t
        t.modifyEvent += self.onModifyOrder
        t.cancelEvent += self.onCancelOrder
        t.cancelledEvent += self.onCancelledOrder
        t.commissionReportEvent += self.onCommissionReport
        #t.fillEvent += self.onFill
        t.statusEvent += self.onStatusChanged
        print('log')
        print(t)
        print(t.log)

    def cancelOrder(self, contracts):
        ib = self.__checkIBReady()
        if ib == None: 
            self.__errorCB("Disconnected")
            return
        
        contracts = json.load(contracts)
        for c in contracts:
            if c.conId in self.trades:
                if self.trades[c.conId].orderStatus.status in ['Submitted', 'PreSubmitted', 'PendingCancel']:
                    asyncio.run_coroutine_threadsafe(self.__cancelOrder(ib.IB, self.trades[c.conId].order), ib.loop)

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