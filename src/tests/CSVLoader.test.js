import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import CSVLoader from '../pages/CSVLoader';

jest.mock('axios');

describe('CSVLoader Component', () => {

  it('should show "No data available" message when no data is loaded', async () => {
    // Set up the mock response for the file upload request
    axios.post.mockResolvedValueOnce({ status: 200 });

    // Set up the mock response for the search request with an empty response
    axios.get.mockResolvedValueOnce({ data: { filteredData: [] } });

    const { getByText, getByPlaceholderText } = render(<CSVLoader />);

    // Use act to simulate the file loading
    await act(async () => {
      const fileInput = getByPlaceholderText('Search here...').previousSibling;
      const csvString = 'name,city,country,favorite_sport\n';
      const file = new File([csvString], 'example.csv', { type: 'text/csv' });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(getByText('No data available at the moment, start uploading your file.')).toBeInTheDocument();
    });
  });

  it('should load CSV data correctly', async () => {});

  it('should filter data based on the search query', async () => {});

  it('should show an error message when file upload fails', async () => {});

});

