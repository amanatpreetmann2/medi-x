import React, { useState } from "react";

import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search
} from "lucide-react";

function Reports() {

  const [category, setCategory] =
    useState("All Categories");

  // Current page
  const [currentPage, setCurrentPage] =
    useState(1);


  // All demo reports
  const reports = [

    // PAGE 1
    {
      category: "Blood Work",
      title: "Comprehensive Metabolic Panel",
      date: "Oct 12, 2023",
      doctor: "Dr. Emily Smith",
      initials: "ES",
      status: "NORMAL",
      type: "normal-report"
    },

    {
      category: "Imaging",
      title: "Chest X-Ray (PA & LAT)",
      date: "Sep 28, 2023",
      doctor: "Dr. Michael Jones",
      initials: "MJ",
      status: "NEEDS REVIEW",
      type: "review-report"
    },

    {
      category: "Blood Work",
      title: "Lipid Panel",
      date: "Oct 25, 2023",
      doctor: "Dr. Emily Smith",
      initials: "ES",
      status: "PENDING",
      type: "pending-report"
    },


    // PAGE 2
    {
      category: "Blood Work",
      title: "Complete Blood Count",
      date: "Aug 18, 2023",
      doctor: "Dr. Sarah Jenkins",
      initials: "SJ",
      status: "NORMAL",
      type: "normal-report"
    },

    {
      category: "Imaging",
      title: "Abdominal Ultrasound",
      date: "Jul 30, 2023",
      doctor: "Dr. Michael Jones",
      initials: "MJ",
      status: "NORMAL",
      type: "normal-report"
    },

    {
      category: "Blood Work",
      title: "Thyroid Function Test",
      date: "Jul 15, 2023",
      doctor: "Dr. Emily Smith",
      initials: "ES",
      status: "NEEDS REVIEW",
      type: "review-report"
    },


    // PAGE 3
    {
      category: "Imaging",
      title: "MRI Brain Scan",
      date: "Jun 22, 2023",
      doctor: "Dr. Michael Jones",
      initials: "MJ",
      status: "NORMAL",
      type: "normal-report"
    },

    {
      category: "Blood Work",
      title: "Kidney Function Test",
      date: "May 14, 2023",
      doctor: "Dr. Sarah Jenkins",
      initials: "SJ",
      status: "NORMAL",
      type: "normal-report"
    },

    {
      category: "Imaging",
      title: "Chest CT Scan",
      date: "Apr 08, 2023",
      doctor: "Dr. Michael Jones",
      initials: "MJ",
      status: "PENDING",
      type: "pending-report"
    }
  ];


  // Filter by category
  const filteredReports =
    category === "All Categories"
      ? reports
      : reports.filter(
          (report) =>
            report.category === category
        );


  // Number of reports shown on one page
  const reportsPerPage = 3;


  // Calculate starting and ending index
  const startIndex =
    (currentPage - 1) * reportsPerPage;

  const endIndex =
    startIndex + reportsPerPage;


  // Reports for current page
  const currentReports =
    filteredReports.slice(
      startIndex,
      endIndex
    );


  // Total number of pages
  const totalPages =
    Math.ceil(
      filteredReports.length /
      reportsPerPage
    );


  // Change page
  const changePage = (page) => {

    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }

  };


  return (

    <main className="content">

      <h1 className="page-title">
        Health Reports
      </h1>

      <p className="page-subtitle">
        Access your laboratory results, diagnostic reports
        and medical records securely.
      </p>


      {/* FILTER SECTION */}

      <div className="report-filter">

        <div>

          <label>
            Search Reports
          </label>

          <div className="report-input">

            <Search size={17} />

            <input
              placeholder="e.g. Blood work, X-Ray..."
            />

          </div>

        </div>


        <div>

          <label>
            Category
          </label>

          <div className="report-select">

            <select
              value={category}
              onChange={(e) => {

                setCategory(e.target.value);

                // Go back to page 1
                // when category changes
                setCurrentPage(1);

              }}
            >

              <option>
                All Categories
              </option>

              <option>
                Blood Work
              </option>

              <option>
                Imaging
              </option>

            </select>

            <ChevronDown size={16} />

          </div>

        </div>


        <div>

          <label>
            Date Range
          </label>

          <div className="report-select">

            <select>

              <option>
                Last 6 Months
              </option>

              <option>
                Last Year
              </option>

              <option>
                All Time
              </option>

            </select>

            <ChevronDown size={16} />

          </div>

        </div>


        <button className="filter-btn">

          <Filter size={16} />

          Filter

        </button>

      </div>


      {/* REPORT CARDS */}

      <div className="reports">

        {currentReports.map(
          (report) => (

            <div
              className={`report-card ${report.type}`}
              key={report.title}
            >

              <div className="report-top">

                <span className="report-category">

                  <Activity size={14} />

                  {report.category}

                </span>

                <span
                  className={`report-status ${report.type}`}
                >
                  {report.status}
                </span>

              </div>


              <h3>
                {report.title}
              </h3>


              <span className="report-date">

                <Calendar size={14} />

                {report.date}

              </span>


              <div className="report-doctor">

                <small>
                  ORDERING PHYSICIAN
                </small>

                <div>

                  <div className="small-avatar">
                    {report.initials}
                  </div>

                  {report.doctor}

                </div>

              </div>


              <div className="report-actions">

                <button
                  className={
                    report.status === "PENDING"
                      ? "processing-btn"
                      : "view-report-btn"
                  }
                  onClick={() => {
                    if (report.status !== "PENDING") {
                      window.print();
                    }
                  }}
                  title={report.status !== "PENDING" ? "Print or Export Diagnostic Report to PDF" : "Report is currently processing"}
                >

                  {report.status === "PENDING"
                    ? "Processing"
                    : "View / Print Report"}

                </button>


                <button 
                  className="download-btn"
                  onClick={() => window.print()}
                  title="Download / Print PDF Report"
                >

                  <Download size={17} />

                </button>

              </div>

            </div>

          )
        )}

      </div>


      {/* PAGINATION */}

      <div className="pagination">

        {/* PREVIOUS */}

        <button
          onClick={() =>
            changePage(currentPage - 1)
          }
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>


        {/* PAGE 1 */}

        <button
          className={
            currentPage === 1
              ? "current-page"
              : ""
          }
          onClick={() =>
            changePage(1)
          }
        >
          1
        </button>


        {/* PAGE 2 */}

        <button
          className={
            currentPage === 2
              ? "current-page"
              : ""
          }
          onClick={() =>
            changePage(2)
          }
        >
          2
        </button>


        {/* PAGE 3 */}

        <button
          className={
            currentPage === 3
              ? "current-page"
              : ""
          }
          onClick={() =>
            changePage(3)
          }
        >
          3
        </button>


        <span>...</span>


        {/* NEXT */}

        <button
          onClick={() =>
            changePage(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
        >
          <ChevronRight size={16} />
        </button>

      </div>

    </main>

  );

}

export default Reports;