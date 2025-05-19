import yfinance as yf

mlgo = yf.Ticker("MLGO")
historicalPriceshPr = mlgo.history(period="1mo", interval="1d")
print(historicalPriceshPr)