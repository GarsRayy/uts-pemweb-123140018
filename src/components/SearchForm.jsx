import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Search } from 'lucide-react'; // Import ikon search

// Departments sekarang di-pass dari App.jsx
function SearchForm({ onSearch, initialQuery, departments, isLoading }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [departmentId, setDepartmentId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi dasar
    if (!searchTerm.trim()) {
      // Bisa tambahkan alert/feedback di sini
      return;
    }
    onSearch(searchTerm, departmentId);
  };

  return (
    // Container ini akan otomatis ganti tema (dark/light)
    // berkat `data-bs-theme` di <html>
    <Container as="section" className="my-4 p-4 bg-body-tertiary rounded shadow-sm">
      <Form onSubmit={handleSubmit}>
        <Row className="g-3 align-items-end">
          <Col md={6}>
            <Form.Group controlId="searchTerm">
              <Form.Label>Search Keyword</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Monet, sunflowers, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required // Validasi HTML5
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="departmentId">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={isLoading} // disable saat departments di-load
              >
                <option value="">{isLoading ? "Loading..." : "All Departments"}</option>
                {departments.map(dep => (
                  <option key={dep.departmentId} value={dep.departmentId}>
                    {dep.displayName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            {/* Menggunakan style tombol dari snippet baru */}
            <Button variant="primary" type="submit" className="w-100 d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
              <Search size={18} />
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SearchForm;
