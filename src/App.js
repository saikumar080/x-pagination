import { useEffect, useState, useMemo } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch data! status: ${res.status}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / rowsPerPage));
  }, [data]);

  // Slice current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage]);

  // Safety fix (important when data changes)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="App">
      <h1>Employee Data Table</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan="4">No Data Found</td>
            </tr>
          ) : (
            currentData.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span style={{ margin: "0 15px" }}>
         {currentPage} 
        </span>

        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
