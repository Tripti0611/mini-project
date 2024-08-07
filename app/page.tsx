
"use client";
import { useState, useRef } from 'react';

type Customer = {
  name: string;
  phone: string;
  count: number;
  checkin: Date;
  checkout: Date | null;
};

const Home = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [seatsLeft, setSeatsLeft] = useState(25);
  const capacity = 25;

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLInputElement>(null);

  const addCustomerDetails = (name: string, phone: string, count: number) => {
    const details = {
      name,
      phone,
      count,
      checkin: new Date(),
      checkout: null,
    };
    setCustomers((prev) => [details, ...prev]);
  };

  const checkIfEntryExists = (phone: string) => {
    return customers.find((c) => c.phone === phone && !c.checkout);
  };

  const handleCheckout = (phone: string, count: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.phone === phone ? { ...c, checkout: new Date() } : c
      )
    );
    setSeatsLeft((prev) => prev + count);
  };

  const handleRemove = (index: number) => {
    setCustomers((prev) => {
      const updated = [...prev];
      const removedEntry = updated.splice(index, 1);
      if (!removedEntry[0].checkout) {
        setSeatsLeft((prev) => prev + removedEntry[0].count);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const phone = phoneRef.current?.value;
    const count = parseInt(countRef.current?.value || '0');

    if (!name || !phone || isNaN(count)) return;

    if (checkIfEntryExists(phone)) {
      alert('User already exists');
      return;
    }

    if (count > seatsLeft) {
      alert('Guest count exceeds capacity');
      return;
    }

    addCustomerDetails(name, phone, count);
    setSeatsLeft((prev) => prev - count);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 text-center">
      <div>
        <h2 className="text-2xl ">Total Capacity: {capacity}</h2>
        <h2 className="text-2xl">Seats Left: {seatsLeft}</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-3/5 ">
        <input
          type="number"
          ref={countRef}
          placeholder="Guests Count"
          min="1"
          required
          className="p-2 text-lg border"
        />
        <input
          type="text"
          ref={nameRef}
          placeholder="Primary Guest Name "
          required
          className="p-2 text-lg border"
        />
        <input
          type="tel"
          ref={phoneRef}
          placeholder="Phone Number"
          required
          className="p-2 text-lg border"
        />
        <button className="w-32 p-2 bg-blue-500 text-white rounded ">
          Add Entry
        </button>
      </form>

      <table className="table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">Count</th>
            <th className="border border-gray-200 p-2">Name</th>
            <th className="border border-gray-200 p-2">Phone</th>
            <th className="border border-gray-200 p-2">Check In</th>
            <th className="border border-gray-200 p-2">Check Out</th>
            <th className="border border-gray-200 p-2">Status</th>
            <th className="border border-gray-200 p-2">Remove Entry</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((val, index) => (
            <tr key={index}>
              <td className="border border-gray-200 p-2">{val.count}</td>
              <td className="border border-gray-200 p-2">{val.name}</td>
              <td className="border border-gray-200 p-2">{val.phone}</td>
              <td className="border border-gray-200 p-2">{val.checkin.toLocaleTimeString()}</td>
              <td className="border border-gray-200 p-2">
                {val.checkout ? val.checkout.toLocaleTimeString() : '-'}
              </td>
              <td
                className={`border border-gray-200 p-2 ${
                  val.checkout ? 'bg-red-500' : 'bg-lime-500 cursor-pointer'
                }`}
                onClick={() =>
                  !val.checkout && handleCheckout(val.phone, val.count)
                }
              >
                {val.checkout ? 'Served' : 'Click to CheckOut'}
              </td>
              <td
                className="border border-gray-200 p-2 cursor-pointer"
                onClick={() => handleRemove(index)}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
