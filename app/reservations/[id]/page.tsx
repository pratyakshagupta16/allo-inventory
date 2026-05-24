"use client";

import { useEffect, useState } from "react";

export default function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [reservationId, setReservationId] =
    useState("");

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    async function loadParams() {
      const resolvedParams =
        await params;

      setReservationId(
        resolvedParams.id
      );
    }

    loadParams();
  }, [params]);

  useEffect(() => {
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  async function fetchReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${reservationId}`
      );

      const data = await res.json();

      setReservation(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!reservation) return;

    const interval = setInterval(() => {
      const expiry = new Date(
        reservation.expiresAt
      ).getTime();

      const now = new Date().getTime();

      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes = Math.floor(
        diff / 1000 / 60
      );

      const seconds = Math.floor(
        (diff / 1000) % 60
      );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [reservation]);

  async function confirmReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${reservationId}/confirm`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);

        return;
      }

      alert("Purchase Confirmed");

      fetchReservation();
    } catch (error) {
      console.log(error);
    }
  }

  async function releaseReservation() {
    try {
      const res = await fetch(
        `/api/reservations/${reservationId}/release`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);

        return;
      }

      alert("Reservation Cancelled");

      fetchReservation();
    } catch (error) {
      console.log(error);
    }
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-5xl font-bold text-black mb-8">
          Reservation
        </h1>

        <div className="space-y-4">

          {/* STATUS */}
          <div className="bg-gray-100 p-5 rounded-xl border">
            <p className="text-black text-2xl font-semibold">
              Status: {reservation.status}
            </p>
          </div>

          {/* TIMER */}
          <div className="bg-gray-100 p-5 rounded-xl border">
            <p className="text-black text-2xl font-semibold">
              Expires In: {timeLeft}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={
              confirmReservation
            }
            disabled={
              reservation.status !==
              "PENDING"
            }
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-xl disabled:bg-gray-400"
          >
            Confirm Purchase
          </button>

          <button
            onClick={
              releaseReservation
            }
            disabled={
              reservation.status !==
              "PENDING"
            }
            className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-6 py-3 rounded-xl disabled:bg-gray-400"
          >
            Cancel
          </button>
        </div>

        {(reservation.status ===
          "CONFIRMED" ||
          reservation.status ===
            "RELEASED") && (
          <div className="mt-6 p-4 rounded-xl bg-blue-100 text-blue-800 text-lg font-semibold">
            Reservation is already{" "}
            {reservation.status}.
          </div>
        )}
      </div>
    </div>
  );
}