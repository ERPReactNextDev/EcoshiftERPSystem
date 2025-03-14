import React, { useEffect, useState } from "react";

interface Metric {
    userName: string;
    ReferenceID: string;
    Traffic: string;
    Amount: number;
    QtySold: number;
    Status: string;
}

interface AgentSalesConversionProps {
    ReferenceID: string;
    Role: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({ ReferenceID, Role }) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);

    const referenceIdToNameMap: Record<string, string> = {
        "MQ-CSR-170039": "Quinto, Myra",
        "LM-CSR-809795": "Miguel, Lester",
        "RP-CSR-451122": "Paje, Rikki",
        "SA-CSR-517304": "Almoite, Sharmaine",
        "AA-CSR-785895": "Arendain, Armando",
        "GL-CSR-586725": "Lumabao, Grace",
        "MD-CSR-152985": "Dungso, Mary Grace",
        "LR-CSR-849432": "Leroux Y Xchire",
    };

    useEffect(() => {
        let isMounted = true;

        const fetchMetrics = async () => {
            try {
                const response = await fetch(`/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();

                if (isMounted) setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMetrics();

        return () => {
            isMounted = false;
        };
    }, [ReferenceID, Role]);

    // Grouping data by ReferenceID and computing total Amount and QtySold
    const groupedData = metrics.reduce((acc, metric) => {
        if (!acc[metric.ReferenceID]) {
            acc[metric.ReferenceID] = {
                ReferenceID: metric.ReferenceID,
                Traffic: metric.Traffic,
                Amount: 0,
                QtySold: 0,
                ConversionToSale: 0,
                Sales: 0,
                NonSales: 0,
            };
        }
        acc[metric.ReferenceID].Amount += Number(metric.Amount) || 0;
        acc[metric.ReferenceID].QtySold += Number(metric.QtySold) || 0;
        acc[metric.ReferenceID].ConversionToSale += metric.Status === "Converted Into Sales" ? 1 : 0;
        acc[metric.ReferenceID].Sales += metric.Traffic === "Sales" ? 1 : 0;
        acc[metric.ReferenceID].NonSales += metric.Traffic !== "Sales" ? 1 : 0;

        return acc;
    }, {} as Record<string, any>);

    const formattedData = Object.values(groupedData);

    const formatAmountWithPeso = (amount: number) => {
        if (isNaN(amount)) {
            return "₱0.00";
        }
        return `₱${Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {loading ? (
                <p className="text-xs">Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Agent Name</th>
                            <th className="border p-2">Traffic</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Quantity Sold</th>
                            <th className="border p-2">Conversion to Sale</th>
                            <th className="border p-2">Sales</th>
                            <th className="border p-2">Non-Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formattedData.length > 0 ? (
                            formattedData.map((metric, index) => (
                                <tr key={index} className="text-center border-t">
                                    <td className="border p-2">{referenceIdToNameMap[metric.ReferenceID] || "Unknown"}</td>
                                    <td className="border p-2">{metric.Traffic}</td>
                                    <td className="border p-2">{formatAmountWithPeso(metric.Amount)}</td>
                                    <td className="border p-2">{metric.QtySold}</td>
                                    <td className="border p-2">{metric.ConversionToSale}</td>
                                    <td className="border p-2">{metric.Sales}</td>
                                    <td className="border p-2">{metric.NonSales}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="p-2 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AgentSalesConversion;