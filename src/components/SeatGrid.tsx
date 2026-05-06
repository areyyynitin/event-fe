export type SeatStatus = "available" | "reserved" | "booked";

export interface Seat {
  seatNumber: number;
  status: SeatStatus;
}

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: number[];
  onToggleSeat: (seatNumber: number) => void;
}

export default function SeatGrid({ seats, selectedSeats, onToggleSeat }: SeatGridProps) {
  const getSeatClass = (status: SeatStatus, selected: boolean) => {
    if (selected) return "bg-accent";
    if (status === "booked") return "bg-text text-background cursor-not-allowed opacity-90";
    if (status === "reserved") return "bg-secondary text-text cursor-not-allowed opacity-90";
    return "bg-background text-text hover:-translate-x-0.5 hover:-translate-y-0.5";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-xs font-black uppercase">
        <span className="brutal-card bg-background px-2 py-1">Available</span>
        <span className="brutal-card bg-accent px-2 py-1">Selected</span>
        <span className="brutal-card bg-secondary px-2 py-1">Reserved</span>
        <span className="brutal-card bg-text px-2 py-1 text-background">Booked</span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {seats.map((seat) => {
          const selected = selectedSeats.includes(seat.seatNumber);
          const disabled = seat.status !== "available";
          return (
            <button
              key={seat.seatNumber}
              type="button"
              disabled={disabled}
              onClick={() => onToggleSeat(seat.seatNumber)}
              className={`brutal-btn px-2 py-3 text-xs transition ${getSeatClass(seat.status, selected)}`}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>
      {seats.length === 0 && (
        <p className="brutal-card inline-block bg-primary px-3 py-2 font-black uppercase text-background">
          No seat data found for this event. Refresh once, or recreate the event with totalSeats.
        </p>
      )}
    </div>
  );
}
