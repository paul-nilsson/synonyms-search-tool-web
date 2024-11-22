import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import SynonymsSearch from './SynonymsSearch';

jest.mock('axios'); // Mock axios

test('renderar search panel correct', () => {
    render(<SynonymsSearch />);

    // Check that the correct heading and input field are displayed.
    expect(screen.getByText('Search for Synonyms')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search word...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
});

test('fetches and displays synonyms on successful search', async () => {
    // Mock API-response
    axios.get.mockResolvedValueOnce({
        data: { synonyms: ['similar', 'alike', 'akin'] },
    });

    render(<SynonymsSearch />);

    // Simulate input and search
    const input = screen.getByPlaceholderText('Search word...');
    fireEvent.change(input, { target: { value: 'same' } });

    const button = screen.getByText('Search');
    fireEvent.click(button);

    await waitFor(() => {
        expect(screen.getByText('similar')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('alike')).toBeInTheDocument();
    });

    // Check that the API was called correctly.
    expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}same`);
});


test('displays feedback on API error', async () => {
    // Mock API-error
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<SynonymsSearch />);

    // Simulate input and search
    const input = screen.getByPlaceholderText('Search word...');
    fireEvent.change(input, { target: { value: 'error' } });

    const button = screen.getByText('Search');
    fireEvent.click(button);

    // Wait until feedback is displayed
    await waitFor(() => {
        expect(screen.getByText('No synonyms found for "error"')).toBeInTheDocument();
    });
});