import { useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import SeatGrid from "./SeatGrid";
import type { Seat } from "./SeatGrid";

interface EventData {
  _id: string;
  name: string;
  venue: string;
  dateTime: string;
  totalSeats: number;
  seats?: Seat[];
}

export default function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [reservationExpiresAt, setReservationExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const derivedSeats: Seat[] =
    event?.seats && event.seats.length > 0
      ? event.seats
      : Array.from({ length: Math.max(0, event?.totalSeats ?? 0) }, (_, i) => ({
          seatNumber: i + 1,
          status: "available",
        }));

  const loadEvent = async () => {
    if (!id) return;
    try {
      const data = await api(`/events/${id}`);
      const normalized: EventData = {
        ...data,
        totalSeats: typeof data?.totalSeats === "number" ? data.totalSeats : 0,
        seats: Array.isArray(data?.seats) ? data.seats : [],
      };
      setEvent(normalized);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to load event details");
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (!reservationExpiresAt) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.floor((new Date(reservationExpiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(seconds);
      if (seconds === 0) {
        setReservedSeats([]);
        setReservationExpiresAt(null);
        setMessage("Reservation timer expired. Please reserve seats again.");
        loadEvent();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationExpiresAt]);

  const clearNotices = () => {
    setMessage("");
    setError("");
  };

  const toggleSeat = (seatNumber: number) => {
    clearNotices();
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber].sort((a, b) => a - b)
    );
  };

  const reserveSeats = async () => {
    if (!token) {
      setError("Please login to reserve seats.");
      return;
    }
    if (!id || selectedSeats.length === 0) {
      setError("Select at least one available seat.");
      return;
    }

    try {
      setLoading(true);
      clearNotices();
      const res = await api("/reserve", "POST", { eventId: id, seatNumbers: selectedSeats }, token);
      setReservedSeats(selectedSeats);
      setReservationExpiresAt(res.expiresAt);
      const initialSeconds = Math.max(
        0,
        Math.floor((new Date(res.expiresAt).getTime() - Date.now()) / 1000)
      );
      setTimeLeft(initialSeconds);
      setMessage("Seats reserved. Confirm booking before the timer ends.");
      await loadEvent();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Reservation failed");
      await loadEvent();
    } finally {
      setLoading(false);
    }
  };

  const bookSeats = async () => {
    if (!token) {
      setError("Please login to confirm booking.");
      return;
    }
    if (!id) return;
    try {
      setLoading(true);
      clearNotices();
      const res = await api("/bookings", "POST", { eventId: id }, token);
      setMessage(res.message || "Booking successful");
      setSelectedSeats([]);
      setReservedSeats([]);
      setReservationExpiresAt(null);
      await loadEvent();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Booking failed");
      await loadEvent();
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="brutal-card inline-block bg-secondary px-4 py-2 text-lg font-black uppercase">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 brutal-card bg-background p-6">
      <h2 className="inline-block bg-accent px-4 py-2 text-3xl font-black uppercase brutal-card">
        {event.name}
      </h2>
      <p className="inline-block bg-secondary px-3 py-2 font-black brutal-card">
        {event.venue}
      </p>
      <p className="inline-block bg-background px-3 py-2 font-black brutal-card">
        {new Date(event.dateTime).toLocaleString()}
      </p>

      <SeatGrid seats={derivedSeats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
      {(event.seats?.length ?? 0) === 0 && event.totalSeats > 0 && (
        <p className="brutal-card inline-block bg-secondary px-3 py-2 font-black uppercase">
          Showing generated seat grid from totalSeats. Reserve will sync real seat status from server.
        </p>
      )}
      {!token && (
        <p className="brutal-card inline-block bg-secondary px-3 py-2 font-black uppercase">
          Login required to reserve and book seats.
        </p>
      )}
      {selectedSeats.length === 0 && (
        <p className="brutal-card inline-block bg-background px-3 py-2 font-black uppercase">
          Select seats from the grid to enable reserve.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={reserveSeats}
          disabled={loading || selectedSeats.length === 0}
          className="brutal-btn bg-primary px-4 py-3 text-xs text-background transition hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
        >
          {loading ? "Reserving..." : "Reserve Seats"}
        </button>
        <button
          onClick={bookSeats}
          disabled={loading || reservedSeats.length === 0 || timeLeft <= 0}
          className="brutal-btn bg-text px-4 py-3 text-xs text-background transition hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
      {(reservedSeats.length === 0 || timeLeft <= 0) && (
        <p className="brutal-card inline-block bg-background px-3 py-2 font-black uppercase">
          Confirm booking becomes active after successful reservation.
        </p>
      )}

      {reservationExpiresAt && timeLeft > 0 && (
        <p className="brutal-card inline-block bg-secondary px-3 py-2 font-black uppercase">
          Reservation time left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
        </p>
      )}

      {reservedSeats.length > 0 && (
        <p className="brutal-card inline-block bg-background px-3 py-2 font-black uppercase">
          Reserved seats: {reservedSeats.join(", ")}
        </p>
      )}

      {message && (
        <p className="brutal-card inline-block bg-accent px-3 py-2 font-black uppercase">
          {message}
        </p>
      )}
      {error && (
        <p className="brutal-card inline-block bg-primary px-3 py-2 font-black uppercase text-background">
          {error}
        </p>
      )}
    </div>
  );
}