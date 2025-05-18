import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getHistoricalPrice } from "@/api/historical-price.api";

export function HistoricalPrice() {
  const { symbol } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const resp = await getHistoricalPrice(symbol);
        const formatted = resp.data.map((item) => ({
          date: item.date, // ISO string YYYY‑MM‑DD
          close: Number(item.close), // Convertir a número
        }));
        setData(formatted);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [symbol]);

  if (loading) return <p>Cargando datos…</p>;
  if (error) return <p>{error}</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" name="Cierre" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
