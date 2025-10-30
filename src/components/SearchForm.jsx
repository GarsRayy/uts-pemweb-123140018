import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

const DEPARTMENTS_URL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";

function SearchForm({ onSearch, initialQuery }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(DEPARTMENTS_URL);
        if (!response.ok) throw new Error("Gagal mengambil data departemen");
        const data = await response.json();
        setDepartments(data.departments || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      onSearch(searchTerm, departmentId);
    }
  };

  return (
    <Container as="section" className="my-4 p-4 bg-light rounded shadow-sm">
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
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="departmentId">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Departments</option>
                {departments.map(dep => (
                  <option key={dep.departmentId} value={dep.departmentId}>
                    {dep.displayName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" type="submit" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SearchForm;