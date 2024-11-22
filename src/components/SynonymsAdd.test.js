import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SynonymsAdd from './SynonymsAdd';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('SynonymsAdd', () => {

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    test('does the form render correctly', () => {
        render(<SynonymsAdd />);

        // Check if the component renders the fields for 'Word' and 'Synonyms"
        expect(screen.getByLabelText(/Word/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Synonyms/i)).toBeInTheDocument();
    });

    test('visar ett varningsmeddelande om f�lten inte �r ifyllda och skickar formul�ret', async () => {
        render(<SynonymsAdd />);

        // Hitta och klicka p� submit-knappen utan att fylla i f�lten
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        // V�nta p� att varningsmeddelandet ska visas
        await waitFor(() => {
            expect(screen.getByText(/Please enter both a word and its synonyms./i)).toBeInTheDocument();
        });
    });

    test('displays a warning message if the fields are not filled in and submits the form', async () => {
        // Mock a successful response from the API call
        axios.post.mockResolvedValueOnce({
            data: { message: 'Synonyms added successfully!' }
        });

        // Render the component
        render(<SynonymsAdd />);

        // Find the input fields and the button
        const wordInput = screen.getByLabelText(/word/i); 
        const synonymsInput = screen.getByLabelText(/synonyms/i); 
        const addButton = screen.getByRole('button', { name: /add/i }); 

        // Simulate the user's input
        fireEvent.change(wordInput, { target: { value: 'happy' } });
        fireEvent.change(synonymsInput, { target: { value: 'joyful, content' } });

        // Simulate the user submitting the form
        fireEvent.click(addButton);

        // Wait for the message to render on the screen
        await waitFor(() => {
            expect(screen.getByText(/Synonyms added successfully!/i)).toBeInTheDocument();
        });
    });

    test('displays an error message if the API call fails', async () => {
        // Mock a failed response from the API call
        axios.post.mockRejectedValueOnce(new Error('Error adding synonyms'));

        // Render the component
        render(<SynonymsAdd />);

        // Find the input fields and the button
        const wordInput = screen.getByLabelText(/word/i);
        const synonymsInput = screen.getByLabelText(/synonyms/i);
        const addButton = screen.getByRole('button', { name: /add/i });

        // Simulate the user's input
        fireEvent.change(wordInput, { target: { value: 'happy' } });
        fireEvent.change(synonymsInput, { target: { value: 'joyful, content' } });

        // Simulera att anv�ndaren skickar formul�ret
        fireEvent.click(addButton);

        // Simulate the user submitting the form
        await waitFor(() => {
            expect(screen.getByText(/There was an error adding the synonyms/i)).toBeInTheDocument();
        });
    });

    test('displays a warning message if the user does not fill in the fields', async () => {
        render(<SynonymsAdd />);

        // Fill in only the 'Word' field without filling in the 'Synonyms' field"
        fireEvent.change(screen.getByLabelText(/word/i), { target: { value: 'happy' } });

        //Click the submit button
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        // Wait for the warning message to appear
        await waitFor(() => {
            const alert = screen.getByRole('alert'); 
            expect(alert).toHaveTextContent(/Please enter both a word and its synonyms./i);
        });
    });
});

