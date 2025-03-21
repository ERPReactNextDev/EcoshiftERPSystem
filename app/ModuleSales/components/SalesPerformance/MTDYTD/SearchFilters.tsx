"use client";

import React, { useState } from "react";

// SearchFilters Component
interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const handleDateChange = (month: string, year: string) => {
        if (!month || !year) return;
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const firstDay = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
        const lastDay = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${new Date(parseInt(year), monthIndex + 1, 0).getDate()}`;
        setStartDate(firstDay);
        setEndDate(lastDay);
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
            <select
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
                value={selectedMonth}
                onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    handleDateChange(e.target.value, selectedYear);
                }}
            >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>
            <select
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
                value={selectedYear}
                onChange={(e) => {
                    setSelectedYear(e.target.value);
                    handleDateChange(selectedMonth, e.target.value);
                }}
            >
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
            </select>
            <div className="flex gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded text-xs" disabled
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded text-xs" disabled
                />
            </div>
        </div>
    );
};

export default SearchFilters;