import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet default icon fix (இல்லையென்றால் மார்க்கர் தெரியாது)
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 1. Mock Data generation (5000+ rows)
const mockData = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  projectName: `Project ${i + 1}`,
  lat: 13.0827 + Math.random() * 0.5,
  lng: 80.2707 + Math.random() * 0.5,
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Completed",
  lastUpdated: new Date().toLocaleDateString(),
}));

// MapView helper to move camera
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 12);
  }, [center, map]);
  return null;
}

function App() {
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // 2. Client-side Filtering Logic
  const filteredData = useMemo(() => {
    return mockData.filter(
      (item) =>
        item.projectName.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  // 3. Pagination Logic (to handle performance)
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [filteredData, page, rowsPerPage]);

  const selectedLocation = useMemo(() => {
    const found = mockData.find((d) => d.id === selectedRowId);
    return found ? [found.lat, found.lng] : null;
  }, [selectedRowId]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 2, m: 2, bgcolor: "#1976d2", color: "white" }}
      >
        <Typography variant="h5">Geo-Spatial Data Dashboard</Typography>
      </Paper>

      <Box sx={{ display: "flex", flex: 1, gap: 2, p: 2, minHeight: 0 }}>
        {/* Table Section */}
        <Paper
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            p: 1,
          }}
        >
          <TextField
            label="Filter by Project Name or Status..."
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Project Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Last Updated
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selectedRowId === row.id}
                    onClick={() => setSelectedRowId(row.id)}
                    sx={{
                      cursor: "pointer",
                      "&.Mui-selected": { bgcolor: "#e3f2fd !important" },
                    }}
                  >
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
          />
        </Paper>

        {/* Map Section */}
        <Box
          sx={{
            flex: 1.2,
            borderRadius: 2,
            overflow: "hidden",
            border: "2px solid #ddd",
            boxShadow: 3,
          }}
        >
          <MapContainer
            center={[13.0827, 80.2707]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={selectedLocation} />

            {/* Displaying markers only for current page to keep it lag-free */}
            {paginatedData.map((row) => (
              <Marker
                key={row.id}
                position={[row.lat, row.lng]}
                eventHandlers={{ click: () => setSelectedRowId(row.id) }}
              >
                <Popup>
                  <strong>{row.projectName}</strong> <br />
                  Status: {row.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
