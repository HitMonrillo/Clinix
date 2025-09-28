import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitAppointment } from '../../services/api';

export const Appointments = () => {
  const [startDate, setStartDate] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    reason: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const buildBookingDetails = (res) => {
    if (!res) return null;

    const bookingString = typeof res === 'string' ? res : res?.booking;
    const plan = typeof res === 'object' ? res?.plan : null;

    let patient = formData.fullName || '';
    let doctor = plan?.doctor || '';
    let date = plan?.date || plan?.appointment_date || '';
    let startTime = plan?.start_time || plan?.start || '';
    let endTime = plan?.end_time || plan?.end || '';

    if (typeof bookingString === 'string' && bookingString.includes('reserved for')) {
      const match = bookingString.match(/reserved for (.*?) with (.*?) at (.*)/i);
      if (match) {
        if (!patient) patient = match[1]?.trim();
        if (!doctor) doctor = match[2]?.trim();

        const timeRange = match[3] || '';
        const [startPart, endPart] = timeRange.split(' - ').map((part) => part?.trim());

        if (startPart) {
          const [maybeDate, maybeTime] = startPart.split(' ');
          if (!date && maybeDate) date = maybeDate.trim();
          if (maybeTime) startTime = maybeTime.trim();
          else if (!startTime) startTime = startPart;
        }

        if (endPart) {
          const pieces = endPart.split(' ');
          endTime = pieces[pieces.length - 1].trim();
        }
      }
    }

    const normalizeTime = (timeValue) => {
      if (!timeValue) return '';
      if (timeValue.includes('T')) return timeValue;
      if (timeValue.includes(' ')) return timeValue.replace(' ', 'T');
      return date ? `${date}T${timeValue}` : timeValue;
    };

    const formatDate = (value) => {
      if (!value) return '—';
      try {
        const dateObj = new Date(value);
        if (Number.isNaN(dateObj.valueOf())) return value;
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(dateObj);
      } catch {
        return value;
      }
    };

    const formatTime = (value) => {
      if (!value) return '—';
      const normalized = normalizeTime(value);
      try {
        const dateObj = new Date(normalized);
        if (Number.isNaN(dateObj.valueOf())) return value;
        return new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(dateObj);
      } catch {
        return value;
      }
    };

    return {
      patient: patient || '—',
      doctor: doctor || 'Primary Care',
      date: formatDate(date),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      raw: bookingString,
    };
  };

  const bookingDetails = useMemo(() => buildBookingDetails(result), [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setError(null);
    try {
      const payload = { patientName: formData.fullName, patientEmail: formData.email };
      const res = await submitAppointment(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Appointment scheduling failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 mt-30 z-50">
      <form className="w-full max-w-lg p-6 flex flex-col gap-6 font-inter"
            onSubmit={handleSubmit}>
        <h2 className="text-xl font-medium font-roboto text-gray-900">Book Appointment</h2>

       
        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className=" rounded-lg w-full py-1 px-2  text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50  transition-all duration-50"
            required
          />
        </div>

     
        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg py-1 px-2  text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 s transition-all duration-50"
            required
          />
        </div>

        
        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium">Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="MM/DD/YYYY"
            className="w-full rounded-lg py-1 px-2  text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-50"
            calendarClassName="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-lg shadow-white/10"
          />
        </div>

       

       
        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium">Reason for Visit</label>
          <textarea
            name="reason"
            placeholder="Describe your reason for the appointment"
            value={formData.reason}
            onChange={handleChange}
            className="w-full rounded-lg py-1 px-2  text-gray-900 bg-white/30 border border-gray-300 hover:border-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-50"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 rounded-full bg-black hover:bg-gray-900 disabled:opacity-60 cursor-pointer text-white font-inter font-medium transition-all duration-50"
        >
          {submitting ? 'Scheduling...' : 'Submit'}
        </button>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        {result && bookingDetails && (
          <div className="mt-4 p-5 rounded-2xl border border-gray-200 bg-white/80 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Confirmed</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Patient</span>
                <span>{bookingDetails.patient}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Doctor</span>
                <span>{bookingDetails.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date</span>
                <span>{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time</span>
                <span>{bookingDetails.startTime} – {bookingDetails.endTime}</span>
              </div>
            </div>
            {bookingDetails.raw && (
              <p className="mt-3 text-xs text-gray-500 italic">{bookingDetails.raw}</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
