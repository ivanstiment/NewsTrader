import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStock } from "@/api/stock.api";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Stock.module.scss";
import { AddressLink } from "@/shared/components/AddressLink/index";

export function Stock() {
  const { loading: authLoading } = useAuth();
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStock() {
      setError("");
      try {
        const { data } = await getStock(symbol);
        setStock(data);
      } catch {
        setError("No se pudo cargar la información del stock.");
      }
    }
    if (symbol) fetchStock();
  }, [symbol]);

  if (authLoading || (!stock && !error)) {
    return (
      <div className={styles["stock-page__container"]}>
        <p className={styles["stock-page__loading"]}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["stock-page__container"]}>
        <p className={styles["stock-page__error"]}>{error}</p>
      </div>
    );
  }

  // Desestructuramos solo los campos que usamos
  const {
    symbol: sym,
    longName,
    fullTimeEmployees,
    address1,
    city,
    country,
    previousClose,
    open,
    bid,
    ask,
    dayLow,
    dayHigh,
    volume,
    averageVolume,
    marketCap,
    website,
    sector,
    industry,
    currentPrice,
    // Financial Highlights
    lastFiscalYearEnd,
    mostRecentQuarter,
    profitMargins,
    operatingMargins,
    returnOnAssets,
    returnOnEquity,
    totalRevenue,
    revenuePerShare,
    quarterlyRevenueGrowth,
    grossProfits,
    ebitda,
    netIncomeToCommon,
    trailingEps,
    totalCash,
    totalCashPerShare,
    totalDebt,
    debtToEquity,
    currentRatio,
    bookValue,
    operatingCashflow,
    freeCashflow,
    // Trading Information
    beta,
    SandP52WeekChange,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    fiftyDayAverage,
    twoHundredDayAverage,
    averageDailyVolume3Month,
    averageVolume10days,
    sharesOutstanding,
    impliedSharesOutstanding,
    floatShares,
    heldPercentInsiders,
    heldPercentInstitutions,
    sharesShort,
    shortRatio,
    shortPercentOfFloat,
    sharesShortPriorMonth,
  } = stock;

  const fmtNum = (v, opts = {}) => {
    if (v == null || isNaN(v)) {
      return "N/D";
    }
    const abs = Math.abs(Math.trunc(v));
    const s = abs.toString();
    const sign = v < 0 ? "-" : "";

    if (s.length === 6) {
      // 100000–999999 → mostrar 5 dígitos + "k"
      return `${sign}${Number(s)
        .toLocaleString(undefined, opts)
        .slice(0, 6)} k`;
    } else if (s.length >= 7) {
      // 1 000 000 en adelante → mostrar 3 dígitos + "M"
      return `${sign}${Number(s)
        .toLocaleString(undefined, opts)
        .slice(0, 4)} M`;
    } else {
      return v.toLocaleString(undefined, opts);
    }
  };

  const setColorClass = (value) => {
    let valueClass = "";
    
    if (value > 0) {
      valueClass = styles["stock-page__panel-value--positive"];
    } else if (value < 0) {
      valueClass = styles["stock-page__panel-value--negative"];
    }
    return valueClass;
  };

  const formatDate = (epoch) =>
    epoch ? new Date(epoch * 1000).toLocaleDateString() : "N/D";
  const pct = (v) => (v != null ? (v * 100).toFixed(2) + "%" : "N/D");
  const toM = (v) => (v != null ? (v / 1e6).toFixed(2) + " M" : "N/D");

  return (
    <div className={styles["stock-page__container"]}>
      <header className={styles["stock-page__general"]}>
        <h1 className={styles["stock-page__title"]}>
          <span className={styles["stock-page__symbol"]}>{sym}</span>
          <Link
            to={website}
            className={`${styles["stock-page__link"]} ${styles["stock-page__link--small"]}`}
          >
            {longName}
          </Link>
        </h1>
        <div className={styles["stock-page__header-infos"]}>
          <div className={styles["stock-page__header-pair"]}>
            <p className={styles["stock-page__header-info"]}>Sector</p>
            <p className={styles["stock-page__badge"]}>{sector}</p>
          </div>
          <div className={styles["stock-page__header-pair"]}>
            <p className={styles["stock-page__header-info"]}>Industria</p>
            <p className={styles["stock-page__badge"]}>{industry}</p>
          </div>
          <div className={styles["stock-page__header-pair"]}>
            <p className={styles["stock-page__header-info"]}>Empleados</p>
            <p className={styles["stock-page__badge"]}>
              {fullTimeEmployees ?? "N/D"}
            </p>
          </div>
          <div>
            <p className={styles["stock-page__header-info"]}>Ubicación</p>
            <AddressLink
              address1={address1}
              city={city}
              country={country}
              size="normal"
            />
          </div>
        </div>
      </header>
      <section className={styles["stock-page__stats"]}>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>
            Precio Actual
          </span>
          <span className={styles["stock-page__stat-value"]}>
            {currentPrice != null ? currentPrice.toFixed(2) : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>Market Cap</span>
          <span className={styles["stock-page__stat-value"]}>
            {marketCap != null ? (marketCap / 1e6).toFixed(2) + " M" : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>Float</span>
          <span className={styles["stock-page__stat-value"]}>
            {floatShares != null
              ? (floatShares / 1e6).toFixed(2) + " M"
              : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>Volumen Hoy</span>
          <span className={styles["stock-page__stat-value"]}>
            {volume != null ? volume.toLocaleString() : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>
            Volumen Promedio
          </span>
          <span className={styles["stock-page__stat-value"]}>
            {averageVolume != null ? averageVolume.toLocaleString() : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>
            52W Low / High
          </span>
          <span className={styles["stock-page__stat-value"]}>
            {fiftyTwoWeekLow != null && fiftyTwoWeekHigh != null
              ? `${fiftyTwoWeekLow.toFixed(2)} / ${fiftyTwoWeekHigh.toFixed(2)}`
              : "N/D"}
          </span>
        </div>
      </section>

      {/* === SECCIÓN DE DATOS CLAVE === */}
      <section className={styles["stock-page__summary"]}>
        {[
          { label: "Cierre", value: previousClose },
          { label: "Apertura", value: open },
          { label: "Bid/Ask", value: `${bid}/${ask}` },
          { label: "Rango diario", value: `${dayLow} - ${dayHigh}` },
          {
            label: "52W Low/High",
            value: `${fiftyTwoWeekLow?.toFixed(
              2
            )} / ${fiftyTwoWeekHigh?.toFixed(2)}`,
          },
          {
            label: "Volumen",
            value: `${volume?.toLocaleString()} (Avg. ${averageVolume?.toLocaleString()})`,
          },
        ].map(({ label, value }) => (
          <div key={label} className={styles["stock-page__summary-item"]}>
            <span className={styles["stock-page__summary-label"]}>{label}</span>
            <span className={styles["stock-page__summary-value"]}>
              {value ?? "N/D"}
            </span>
          </div>
        ))}
      </section>

      {/* === PANELES FINANCIAL HIGHLIGHTS & TRADING INFO === */}
      <section className={styles["stock-page__panels"]}>
        {/* Financial Highlights */}
        <div className={styles["stock-page__panel"]}>
          <h2 className={styles["stock-page__panel-title"]}>
            Financial Highlights
          </h2>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Fiscal Year
            </h3>
            <div className={styles["stock-page__panel-row"]}>
              <span>Fiscal Year Ends</span>
              <span className={styles["stock-page__panel-value"]}>
                {formatDate(lastFiscalYearEnd)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Most Recent Quarter (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {formatDate(mostRecentQuarter)}
              </span>
            </div>
          </div>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Profitability
            </h3>
            <div className={styles["stock-page__panel-row"]}>
              <span>Profit Margin</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(profitMargins)}`}
              >
                {pct(profitMargins)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Operating Margin (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(operatingMargins)}`}
              >
                {pct(operatingMargins)}
              </span>
            </div>
          </div>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Management Effectiveness
            </h3>
            <div className={styles["stock-page__panel-row"]}>
              <span>Return on Assets (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(returnOnAssets)}`}
              >
                {pct(returnOnAssets)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Return on Equity (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(returnOnEquity)}`}
              >
                {pct(returnOnEquity)}
              </span>
            </div>
          </div>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Income Statement
            </h3>
            <div className={styles["stock-page__panel-row"]}>
              <span>Revenue (ttm)</span>
              <span className={styles["stock-page__panel-value"]}>
                {fmtNum(totalRevenue)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Revenue Per Share (ttm)</span>
              <span className={styles["stock-page__panel-value"]}>
                {fmtNum(revenuePerShare)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Quarterly Revenue Growth (yoy)</span>
              <span className={styles["stock-page__panel-value"]}>
                {pct(quarterlyRevenueGrowth)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Gross Profit (ttm)</span>
              <span className={styles["stock-page__panel-value"]}>
                {toM(grossProfits)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>EBITDA</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(returnOnEquity)}`}
              >
                {toM(ebitda)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Net Income Avi to Common (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(netIncomeToCommon)}`}
              >
                {toM(netIncomeToCommon)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Diluted EPS (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(trailingEps)}`}
              >
                {fmtNum(trailingEps, { maximumFractionDigits: 4 })}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Quarterly Earnings Growth (yoy)</span>
              <span className={styles["stock-page__panel-value"]}>
                {pct(stock.quarterlyEarningsGrowth)}
              </span>
            </div>
          </div>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Balance Sheet
            </h3>
            <div className={styles["stock-page__panel-row"]}>
              <span>Total Cash (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {toM(totalCash)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Total Cash Per Share (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {fmtNum(totalCashPerShare)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Total Debt (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {toM(totalDebt)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Total Debt/Equity (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {debtToEquity != null ? `${debtToEquity.toFixed(2)}%` : "N/D"}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Current Ratio (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {fmtNum(currentRatio)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Book Value Per Share (mrq)</span>
              <span className={styles["stock-page__panel-value"]}>
                {fmtNum(bookValue)}
              </span>
            </div>
          </div>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Cash Flow Statement
            </h3>
            <div className={styles["stock-page__panel-row"]}>
              <span>Operating Cash Flow (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(operatingCashflow)}`}
              >
                {toM(operatingCashflow)}
              </span>
            </div>
            <div className={styles["stock-page__panel-row"]}>
              <span>Levered Free Cash Flow (ttm)</span>
              <span
                className={`
                  ${styles["stock-page__panel-value"]}
                  ${setColorClass(freeCashflow)}`}
              >
                {toM(freeCashflow)}
              </span>
            </div>
          </div>
        </div>

        {/* Trading Information */}
        <div className={styles["stock-page__panel"]}>
          <h2 className={styles["stock-page__panel-title"]}>
            Trading Information
          </h2>

          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Stock Price History
            </h3>
            {[
              ["Beta (5Y Monthly)", fmtNum(beta, { maximumFractionDigits: 2 })],
              ["52 Week Change", pct(stock.fiftyTwoWeekRangeChange)],
              ["S&P 500 52-Week Change", pct(SandP52WeekChange)],
              ["52 Week High", fmtNum(fiftyTwoWeekHigh)],
              ["52 Week Low", fmtNum(fiftyTwoWeekLow)],
              ["50-Day Moving Average", fmtNum(fiftyDayAverage)],
              ["200-Day Moving Average", fmtNum(twoHundredDayAverage)],
            ].map(([label, value]) => (
              <div key={label} className={styles["stock-page__panel-row"]}>
                <span className={styles["stock-page__panel-label"]}>
                  {label}
                </span>
                <span className={styles["stock-page__panel-value"]}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className={styles["stock-page__subpanel"]}>
            <h3 className={styles["stock-page__subpanel-title"]}>
              Share Statistics
            </h3>
            {[
              ["Avg Vol (3 month)", fmtNum(averageDailyVolume3Month)],
              ["Avg Vol (10 day)", fmtNum(averageVolume10days)],
              ["Shares Outstanding", toM(sharesOutstanding)],
              ["Implied Shares Outstanding", toM(impliedSharesOutstanding)],
              ["Float⁸", toM(floatShares)],
              ["% Held by Insiders", pct(heldPercentInsiders)],
              ["% Held by Institutions", pct(heldPercentInstitutions)],
              ["Shares Short (4/30/2025)", toM(sharesShort)],
              ["Short Ratio (4/30/2025)", fmtNum(shortRatio)],
              ["Short % of Float (4/30/2025)", pct(shortPercentOfFloat)],
              [
                "Short % of Shares Outstanding (4/30/2025)",
                pct(stock.shortPercentSharesOut),
              ],
              [
                "Shares Short (prior month 3/31/2025)",
                toM(sharesShortPriorMonth),
              ],
            ].map(([label, val]) => (
              <div key={label} className={styles["stock-page__panel-row"]}>
                <span className={styles["stock-page__panel-label"]}>
                  {label}
                </span>
                <span className={styles["stock-page__panel-value"]}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
