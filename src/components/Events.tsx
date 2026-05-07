import { useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api("/events");
        setEvents(data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="inline-block bg-accent px-4 py-2 text-3xl font-black uppercase tracking-wider brutal-card">
        Events
      </h2>
      {!loading && !error && (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((e) => (
            <div key={e._id} className="brutal-card bg-background p-5">
              <h3 className="text-2xl font-black uppercase">{e.name}</h3>
              <p className="mt-2 bg-secondary px-2 py-1 font-bold inline-block">
                {new Date(e.dateTime).toLocaleString()}
              </p>
              <div className="mt-5">
                <Link
                  to={`/event/${e._id}`}
                  className="brutal-btn inline-block bg-primary px-4 py-2 text-xs text-background transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <p className="brutal-card inline-block bg-secondary px-4 py-2 font-bold">Loading events...</p>
      )}
      {error && (
        <p className="brutal-card inline-block bg-primary px-4 py-2 font-bold text-background">{error}</p>
      )}
      {!loading && !error && events.length === 0 && (
        <p className="brutal-card inline-block bg-secondary px-4 py-2 font-bold">
          No events available.
        </p>
      )}
    </div>
  );
}