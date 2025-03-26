import React, { useState } from "react";
import {
  Eye,
  X,
  CheckCircle,
  ArrowRight,
  Footprints,
  VolumeX,
  Volume2,
  FileSpreadsheet,
} from "lucide-react";
import systems from "../dataset.json";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const exportToPowerBI = (comparedSystems: any[]) => {
  // Prepare data for Power BI export
  const powerBIData = comparedSystems.map((system) => ({
    Reference: system.reference,
    Family: system.family,
    Description: system.description,

    // Performance Metrics
    "Airborne Rw": system.performance.sound_insulation.airborne_rw,
    "Airborne Rw + Ctr": system.performance.sound_insulation.airborne_rw_ctr,
    "Impact Lnw": system.performance.sound_insulation.impact_lnw,

    // Detailed System Information
    "Max Ceiling Load": system.details.max_ceiling_load,
    "Is Loadbearing": system.details.loadbearing ? "Yes" : "No",
    "Structural Background": system.details.structural_background,

    // Framework Details
    "Framework Spacing Primary": system.details.framework_spacing.primary,
    "Framework Spacing Secondary": system.details.framework_spacing.secondary,

    // Suspension Details
    "Suspension Type": system.details.suspension.type.preferred,
    "Suspension Centres": system.details.suspension.centres,

    // Cavity Details
    "Cavity Min Dimension": system.details.cavity_dimensions.minimum,
    "Cavity Max Dimension": system.details.cavity_dimensions.maximum,

    // Additional Details
    "Approximate Weight": system.details.approx_weight,
    "Last Reviewed": system.dates.last_reviewed,
    "Last Updated": system.dates.last_updated,
  }));

  // Export to CSV for Power BI
  const csvContent = convertToCSV(powerBIData);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  FileSaver.saveAs(blob, "British_Gypsum_Ceiling_Systems_PowerBI.csv");

  // Optional: Also export as JSON
  const jsonBlob = new Blob([JSON.stringify(powerBIData, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  FileSaver.saveAs(jsonBlob, "British_Gypsum_Ceiling_Systems_PowerBI.json");
};

// Helper function to convert array of objects to CSV
const convertToCSV = (arr: any[]) => {
  const headers = Object.keys(arr[0]);
  const csvRows = [
    headers.join(","), // CSV header row
    ...arr.map((row) =>
      headers
        .map(
          (header) =>
            // Escape quotes and handle potential commas in values
            `"${
              row[header] !== null && row[header] !== undefined
                ? row[header].toString().replace(/"/g, '""')
                : ""
            }"`
        )
        .join(",")
    ),
  ];

  return csvRows.join("\n");
};

const CeilingSolutionsList = ({ systems }: any) => {
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  const [comparedSystems, setComparedSystems] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const openSystemDetails = (system: React.SetStateAction<null>) => {
    setSelectedSystem(system);
  };

  const closeSystemDetails = () => {
    setSelectedSystem(null);
  };

  const toggleSystemComparison = (system: any) => {
    setComparedSystems((prev) => {
      // If system is already in compared systems, remove it
      if (prev.some((s) => s.reference === system.reference)) {
        return prev.filter((s) => s.reference !== system.reference);
      }
      // If less than 3 systems are selected, add the system
      return prev.length < 3 ? [...prev, system] : prev;
    });
  };

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = comparedSystems.map((system) => ({
      Reference: system.reference,
      Family: system.family,
      Description: system.description,
      "Airborne Rw": system.performance.sound_insulation.airborne_rw,
      "Airborne Rw + Ctr": system.performance.sound_insulation.airborne_rw_ctr,
      "Impact Lnw": system.performance.sound_insulation.impact_lnw,
      "Max Ceiling Load": system.details.max_ceiling_load,
      Loadbearing: system.details.loadbearing ? "Yes" : "No",
      "Structural Background": system.details.structural_background,
      "Framework Spacing (Primary)": `${system.details.framework_spacing.primary}mm`,
      "Framework Spacing (Secondary)": `${system.details.framework_spacing.secondary}mm`,
      "Suspension Type": system.details.suspension.type.preferred,
      "Suspension Centres": `${system.details.suspension.centres}mm`,
      "Cavity Min Dimension": `${system.details.cavity_dimensions.minimum}mm`,
      "Cavity Max Dimension": `${system.details.cavity_dimensions.maximum}mm`,
      "Approximate Weight": `${system.details.approx_weight} kg/m²`,
      "Last Reviewed": system.dates.last_reviewed,
      "Last Updated": system.dates.last_updated,
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Ceiling Systems Comparison"
    );

    // Export to Excel
    XLSX.writeFile(workbook, "British_Gypsum_Ceiling_Systems_Comparison.xlsx");
  };

  const openCompareModal = () => {
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  const exportToPowerBIHandler = () => {
    if (comparedSystems.length > 1) {
      exportToPowerBI(comparedSystems);
    }
  };

  return (
    <div className="bg-white ">
      {/* ... (previous render code remains the same) */}
      <div className="text-center mt-24">
        <h1 className=" font-bold text-gray-900 mb-4 bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
          Ceiling Solutions
        </h1>
        <div className="flex justify-center mb-6 space-x-4">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="w-5 h-5" />
                Export Comparison
              </button>
          {comparedSystems.length > 0 && (
            <>
              <button
                onClick={openCompareModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Compare {comparedSystems.length} Systems
              </button>
            </>
          )}
              <button
                onClick={exportToPowerBIHandler}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileSpreadsheet className="w-5 h-5" />
                Export for Power BI
              </button>
        </div>

        {/* Compare Modal */}
        {isCompareModalOpen && comparedSystems.length > 1 && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={closeCompareModal}
          >
            <div
              className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden relative animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeCompareModal}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full bg-white shadow-lg z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  System Comparison
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {comparedSystems.map((system, index) => (
                    <div
                      key={system.reference}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                    >
                      <div className="mb-4">
                        <img
                          src={system.image}
                          alt={system.description}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {system.reference}
                      </h3>
                      <p className="text-gray-600 mb-4">{system.description}</p>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            label: "Airborne Rw",
                            value:
                              system.performance.sound_insulation.airborne_rw,
                          },
                          {
                            label: "Rw + Ctr",
                            value:
                              system.performance.sound_insulation
                                .airborne_rw_ctr,
                          },
                          {
                            label: "Impact Lnw",
                            value:
                              system.performance.sound_insulation.impact_lnw,
                          },
                          {
                            label: "Max Ceiling Load",
                            value: system.details.max_ceiling_load,
                          },
                        ].map((metric) => (
                          <div
                            key={metric.label}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <p className="text-xs text-gray-500 uppercase">
                              {metric.label}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {metric.value}
                              {metric.label !== "Max Ceiling Load" && " dB"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={exportToExcel}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    Export Detailed Comparison
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-4 m-8 p-16">
        {systems.map((system: any) => (
          <div
            key={system.reference}
            className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border ${
              comparedSystems.some((s) => s.reference === system.reference)
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-gray-200 hover:border-blue-100"
            }`}
          >
            {/* Image with Overlay */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={system.image}
                alt={system.description}
                className="w-full h-full object-fit transform group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm bg-blue-600/90 px-3 py-1 rounded-full backdrop-blur-sm">
                    {system.family}
                  </span>
                  <span className="text-white/90 text-xs bg-black/30 px-2 py-1 rounded-full">
                    {system.reference}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {system.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Airborne Rw",
                    value: system.performance.sound_insulation.airborne_rw,
                    icon: <Volume2 className="w-4 h-4" />,
                  },
                  {
                    label: "Rw + Ctr",
                    value: system.performance.sound_insulation.airborne_rw_ctr,
                    icon: <VolumeX className="w-4 h-4" />,
                  },
                  {
                    label: "Impact Lnw",
                    value: system.performance.sound_insulation.impact_lnw,
                    icon: <Footprints className="w-4 h-4" />,
                  },
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50/50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      {metric.icon}
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {metric.label}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {metric.value}
                      <span className="ml-1 text-xs font-normal text-gray-500">
                        dB
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => openSystemDetails(system)}
                  className="flex-grow bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => toggleSystemComparison(system)}
                  className={`px-3 py-3 rounded-lg transition-all ${
                    comparedSystems.some(
                      (s) => s.reference === system.reference
                    )
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedSystem && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 animate-fade-in overflow-y-auto"
          onClick={closeSystemDetails}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative animate-slide-up my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeSystemDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="grid md:grid-cols-2 gap-4 p-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedSystem.image}
                    alt={selectedSystem.description}
                    className="w-full h-64 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                    <p className="text-xs font-semibold">
                      Max Load: {selectedSystem.details.max_ceiling_load}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    System Overview
                  </h3>
                  <p className="text-sm text-gray-700">
                    {selectedSystem.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Reference",
                      value: selectedSystem.reference,
                    },
                    {
                      label: "Family",
                      value: selectedSystem.family,
                    },
                  ].map((detail, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 p-3 rounded-xl"
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {detail.label}
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Performance Metrics */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Airborne Rw",
                        value:
                          selectedSystem.performance.sound_insulation
                            .airborne_rw,
                        unit: "dB",
                      },
                      {
                        label: "Airborne Rw + Ctr",
                        value:
                          selectedSystem.performance.sound_insulation
                            .airborne_rw_ctr,
                        unit: "dB",
                      },
                      {
                        label: "Impact Lnw",
                        value:
                          selectedSystem.performance.sound_insulation
                            .impact_lnw,
                        unit: "dB",
                      },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 p-3 rounded-xl"
                      >
                        <p className="text-xs text-gray-500 mb-1">
                          {metric.label}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {metric.value}{" "}
                          <span className="text-xs text-gray-500">
                            {metric.unit}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Specifications */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    System Specifications
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Loadbearing",
                        value: selectedSystem.details.loadbearing
                          ? "Yes"
                          : "No",
                        icon: (
                          <CheckCircle className="text-emerald-600 w-5 h-5" />
                        ),
                      },
                      {
                        label: "Structural Background",
                        value: selectedSystem.details.structural_background,
                        icon: (
                          <CheckCircle className="text-emerald-600 w-5 h-5" />
                        ),
                      },
                      {
                        label: "Framework Spacing",
                        value: `Primary: ${selectedSystem.details.framework_spacing.primary}mm, Secondary: ${selectedSystem.details.framework_spacing.secondary}mm`,
                        icon: (
                          <CheckCircle className="text-emerald-600 w-5 h-5" />
                        ),
                      },
                    ].map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"
                      >
                        {spec.icon}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {spec.label}
                          </p>
                          <p className="text-xs text-gray-600">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suspension and Cavity Details */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Suspension and Cavity Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Suspension Type",
                        value: `Preferred: ${selectedSystem.details.suspension.type.preferred}`,
                        details: `Max Length: ${selectedSystem.details.suspension.type.max_lengths.steel_angle}mm`,
                      },
                      {
                        label: "Suspension Centres",
                        value: `${selectedSystem.details.suspension.centres}mm`,
                      },
                      {
                        label: "Cavity Dimensions",
                        value: `Min: ${selectedSystem.details.cavity_dimensions.minimum}mm`,
                        details: `Max: ${selectedSystem.details.cavity_dimensions.maximum}mm`,
                      },
                      {
                        label: "Approximate Weight",
                        value: `${selectedSystem.details.approx_weight} kg/m²`,
                      },
                    ].map((detail, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 p-3 rounded-xl"
                      >
                        <p className="text-xs text-gray-500 mb-1">
                          {detail.label}
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          {detail.value}
                        </p>
                        {detail.details && (
                          <p className="text-xs text-gray-500 mt-1">
                            {detail.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function BritishGypsumSolutions() {
  return <CeilingSolutionsList systems={systems.map((item) => item.system)} />;
}
