import yfinance as yf

mlgo = yf.Ticker("MLGO")

mlgo_info=mlgo.info
print(mlgo_info)