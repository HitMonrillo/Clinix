import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitInsurance } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const Insurance = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [formData, setFormData] = useState({
    provider: '',
    company: '',
    plan: '',
    service: '',
    policyNumber: '',
    groupNumber: '',
    planType: '',
    insuredName: '',
    insuredDOB: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        provider: formData.provider,
        company: formData.company,
        plan: formData.plan,
        service: formData.service || 'General Consultation',
      };
      const res = await submitInsurance(payload);
      setResult(res);
      setTimeout(() => navigate('/checkin/records'), 600);
    } catch (err) {
      setError(err.message || 'Insurance lookup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start px-4 mt-30">
      <form className="w-full max-w-md md:max-w-lg p-4 md:p-6 flex flex-col gap-4 md:gap-5 font-inter" onSubmit={handleSubmit}>
        <h2 className="text-lg md:text-xl font-medium font-roboto text-gray-900">Insurance Information</h2>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Insurance Provider</label>
          <input
            type="text"
            name="provider"
            placeholder="Blue Cross"
            value={formData.provider}
            onChange={handleChange}
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium">Insurance Company</label>
          <input
            type="text"
            name="company"
            placeholder="Aetna"
            value={formData.company}
            onChange={handleChange}
            className="rounded-lg w-full py-1 px-2 text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-50"
            required
          />
        </div>

        

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium">Plan</label>
          <input
            type="text"
            name="plan"
            placeholder="Aetna Open Choice PPO"
            value={formData.plan}
            onChange={handleChange}
            className="rounded-lg w-full py-1 px-2 text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-50"
            required
          />
        </div>

        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              placeholder="Policy #"
              value={formData.policyNumber}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Group Number</label>
            <input
              type="text"
              name="groupNumber"
              placeholder="Group #"
              value={formData.groupNumber}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Plan Type</label>
          <select
            name="planType"
            value={formData.planType}
            onChange={handleChange}
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
            required
          >
            <option value="">Select plan</option>
            <option value="PPO">PPO</option>
            <option value="HMO">HMO</option>
            <option value="EPO">EPO</option>
            <option value="POS">POS</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Insured Name</label>
            <input
              type="text"
              name="insuredName"
              placeholder="Full Name"
              value={formData.insuredName}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Date of Birth</label>
            <input
              type="date"
              name="insuredDOB"
              value={formData.insuredDOB}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 cursor-pointer text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 rounded-full bg-black hover:bg-gray-900 disabled:opacity-60 cursor-pointer text-white font-inter font-medium transition-all duration-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        {result && (
          <pre className="text-xs bg-white/50 p-3 rounded-lg border border-gray-200 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
        )}
      </form>
    </div>
  );
};
