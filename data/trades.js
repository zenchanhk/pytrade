Error 383, reqId 61: The following order "ID:61" size exceeds the Size Limit of 5.
Error 354, reqId 32: You are trying to submit an order without having market data for this instrument.
Error 451, reqId 34: The following order "ID:34" value estimate of 1,438,627.34 HKD exceeds \nthe Total Value Limit of 784,799 HKD
Error 201, reqId 35: Order rejected - reason:Passed contract's last trading time

Filled
Inactive











Trade(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), order=MarketOrder(softDollarTier=SoftDollarTier(), orderId=59, clientId=13, permId=198178856, action='BUY', totalQuantity=2.0, lmtPrice=0.0, auxPrice=0.0, tif='DAY', ocaType=3, trailStopPrice=28473.0, openClose='C', eTradeOnly=False, firmQuoteOnly=False, volatilityType=0, deltaNeutralOrderType='None', deltaNeutralOpenClose='?', referencePriceType=0, account='DU1088904', clearingIntent='IB', adjustedOrderType='None', dontUseAutoPriceForHedge=True), orderStatus=OrderStatus(status='PreSubmitted', remaining=2.0, permId=198178856, clientId=13, whyHeld='locate'), fills=[], log=[TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 69934, tzinfo=datetime.timezone.utc), status='PendingSubmit', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 304514, tzinfo=datetime.timezone.utc), status='PreSubmitted', message='')])
on fill:
Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d3.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 46, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28472.0, permId=198178856, clientId=13, orderId=59, cumQty=1.0, avgPrice=28472.0, lastLiquidity=1), commissionReport=CommissionReport(), time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc))
on status:
Trade(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), order=MarketOrder(softDollarTier=SoftDollarTier(), orderId=59, clientId=13, permId=198178856, action='BUY', totalQuantity=2.0, lmtPrice=0.0, auxPrice=0.0, tif='DAY', ocaType=3, trailStopPrice=28473.0, openClose='C', eTradeOnly=False, firmQuoteOnly=False, volatilityType=0, deltaNeutralOrderType='None', deltaNeutralOpenClose='?', referencePriceType=0, account='DU1088904', clearingIntent='IB', adjustedOrderType='None', dontUseAutoPriceForHedge=True), orderStatus=OrderStatus(status='PreSubmitted', filled=1.0, remaining=1.0, avgFillPrice=28472.0, permId=198178856, lastFillPrice=28472.0, clientId=13, whyHeld='locate'), fills=[Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d3.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 46, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28472.0, permId=198178856, clientId=13, orderId=59, cumQty=1.0, avgPrice=28472.0, lastLiquidity=1), commissionReport=CommissionReport(), time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc))], log=[TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 69934, tzinfo=datetime.timezone.utc), status='PendingSubmit', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 304514, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc), status='PreSubmitted', message='Fill 1.0@28472.0'), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 572756, tzinfo=datetime.timezone.utc), status='PreSubmitted', message='')])
on status:
Trade(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), order=MarketOrder(softDollarTier=SoftDollarTier(), orderId=59, clientId=13, permId=198178856, action='BUY', totalQuantity=2.0, lmtPrice=0.0, auxPrice=0.0, tif='DAY', ocaType=3, trailStopPrice=28473.0, openClose='C', eTradeOnly=False, firmQuoteOnly=False, volatilityType=0, deltaNeutralOrderType='None', deltaNeutralOpenClose='?', referencePriceType=0, account='DU1088904', clearingIntent='IB', adjustedOrderType='None', dontUseAutoPriceForHedge=True), orderStatus=OrderStatus(status='Submitted', filled=1.0, remaining=1.0, avgFillPrice=28472.0, permId=198178856, lastFillPrice=28472.0, clientId=13), fills=[Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d3.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 46, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28472.0, permId=198178856, clientId=13, orderId=59, cumQty=1.0, avgPrice=28472.0, lastLiquidity=1), commissionReport=CommissionReport(), time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc))], log=[TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 69934, tzinfo=datetime.timezone.utc), status='PendingSubmit', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 304514, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc), status='PreSubmitted', message='Fill 1.0@28472.0'), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 572756, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 574749, tzinfo=datetime.timezone.utc), status='Submitted', message='')])
on commission:
Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d3.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 46, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28472.0, permId=198178856, clientId=13, orderId=59, cumQty=1.0, avgPrice=28472.0, lastLiquidity=1), commissionReport=CommissionReport(execId='0000f0e4.5b5f98d3.01.01', commission=17.0, currency='HKD'), time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc))
CommissionReport(execId='0000f0e4.5b5f98d3.01.01', commission=17.0, currency='HKD')
on fill:
Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d4.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 48, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28473.0, permId=198178856, clientId=13, orderId=59, cumQty=2.0, avgPrice=28472.5, lastLiquidity=1), commissionReport=CommissionReport(), time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc))
on status:
Trade(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), order=MarketOrder(softDollarTier=SoftDollarTier(), orderId=59, clientId=13, permId=198178856, action='BUY', totalQuantity=2.0, lmtPrice=0.0, auxPrice=0.0, tif='DAY', ocaType=3, trailStopPrice=28473.0, openClose='C', eTradeOnly=False, firmQuoteOnly=False, volatilityType=0, deltaNeutralOrderType='None', deltaNeutralOpenClose='?', referencePriceType=0, account='DU1088904', clearingIntent='IB', adjustedOrderType='None', dontUseAutoPriceForHedge=True), orderStatus=OrderStatus(status='Filled', filled=2.0, avgFillPrice=28472.5, permId=198178856, lastFillPrice=28473.0, clientId=13), fills=[Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d3.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 46, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28472.0, permId=198178856, clientId=13, orderId=59, cumQty=1.0, avgPrice=28472.0, lastLiquidity=1), commissionReport=CommissionReport(execId='0000f0e4.5b5f98d3.01.01', commission=17.0, currency='HKD'), time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc)), Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d4.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 48, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28473.0, permId=198178856, clientId=13, orderId=59, cumQty=2.0, avgPrice=28472.5, lastLiquidity=1), commissionReport=CommissionReport(), time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc))], log=[TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 69934, tzinfo=datetime.timezone.utc), status='PendingSubmit', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 304514, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc), status='PreSubmitted', message='Fill 1.0@28472.0'), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 572756, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 574749, tzinfo=datetime.timezone.utc), status='Submitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc), status='Submitted', message='Fill 1.0@28473.0'), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc), status='Filled', message='')])
on filled:
Trade(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), order=MarketOrder(softDollarTier=SoftDollarTier(), orderId=59, clientId=13, permId=198178856, action='BUY', totalQuantity=2.0, lmtPrice=0.0, auxPrice=0.0, tif='DAY', ocaType=3, trailStopPrice=28473.0, openClose='C', eTradeOnly=False, firmQuoteOnly=False, volatilityType=0, deltaNeutralOrderType='None', deltaNeutralOpenClose='?', referencePriceType=0, account='DU1088904', clearingIntent='IB', adjustedOrderType='None', dontUseAutoPriceForHedge=True), orderStatus=OrderStatus(status='Filled', filled=2.0, avgFillPrice=28472.5, permId=198178856, lastFillPrice=28473.0, clientId=13), fills=[Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d3.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 46, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28472.0, permId=198178856, clientId=13, orderId=59, cumQty=1.0, avgPrice=28472.0, lastLiquidity=1), commissionReport=CommissionReport(execId='0000f0e4.5b5f98d3.01.01', commission=17.0, currency='HKD'), time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc)), Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d4.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 48, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28473.0, permId=198178856, clientId=13, orderId=59, cumQty=2.0, avgPrice=28472.5, lastLiquidity=1), commissionReport=CommissionReport(), time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc))], log=[TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 69934, tzinfo=datetime.timezone.utc), status='PendingSubmit', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 304514, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 571758, tzinfo=datetime.timezone.utc), status='PreSubmitted', message='Fill 1.0@28472.0'), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 572756, tzinfo=datetime.timezone.utc), status='PreSubmitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 47, 574749, tzinfo=datetime.timezone.utc), status='Submitted', message=''), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc), status='Submitted', message='Fill 1.0@28473.0'), TradeLogEntry(time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc), status='Filled', message='')])
on commission:
Fill(contract=Contract(secType='FUT', conId=324310071, symbol='MHI', lastTradeDateOrContractMonth='20180830', multiplier='10', exchange='HKFE', currency='HKD', localSymbol='MHIQ8', tradingClass='MHI'), execution=Execution(execId='0000f0e4.5b5f98d4.01.01', time=datetime.datetime(2018, 7, 31, 10, 15, 48, tzinfo=datetime.timezone.utc), acctNumber='DU1088904', exchange='HKFE', side='BOT', shares=1.0, price=28473.0, permId=198178856, clientId=13, orderId=59, cumQty=2.0, avgPrice=28472.5, lastLiquidity=1), commissionReport=CommissionReport(execId='0000f0e4.5b5f98d4.01.01', commission=17.0, currency='HKD'), time=datetime.datetime(2018, 7, 31, 10, 15, 50, 396338, tzinfo=datetime.timezone.utc))
CommissionReport(execId='0000f0e4.5b5f98d4.01.01', commission=17.0, currency='HKD')
