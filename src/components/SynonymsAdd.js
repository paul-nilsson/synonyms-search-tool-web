import React from 'react';
import axios from 'axios';

export default class SynonymsAdd extends React.Component {
    // State to store the values for word, synonyms, and message related to the form submission
    state = {
        word: '', // The word for which synonyms will be added
        synonyms: '', // Comma-separated synonyms for the word
        message: '', // A message to show to the user (success, error, or warning)
        messageType: '' // Message type: 'success', 'error', or 'warning'
    };

    // Handles change in the input fields, updating the state dynamically
    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    };

    // Clears the message when the user focuses on the input fields
    clearMessage = () => {
        this.setState({ message: null });
    };

    // Handles form submission
    handleSubmit = (event) => {
        event.preventDefault(); // Prevents page reload on form submission

        // Validation to check if both word and synonyms are provided
        if (!this.state.word || !this.state.synonyms) {
            this.setState({
                message: 'Please enter both a word and its synonyms.', // Display a warning message
                messageType: 'warning' // Set the message type as 'warning'
            });
            return; // Stop the form submission if validation fails
        }

        // Split the comma-separated string of synonyms into an array and trim extra spaces
        const synonymsArray = this.state.synonyms.split(',').map(synonym => synonym.trim());

        // Prepare the data object to send to the API
        const addSynonyms = {
            word: this.state.word, // The word
            synonyms: synonymsArray // The array of synonyms
        };

        // Get the API URL from the environment variables
        const apiUrl = process.env.REACT_APP_API_URL;

        // Send a POST request to the API with the data
        axios.post(`${apiUrl}`, addSynonyms)
            .then(res => {
                console.log(res); // Log the response from the server
                console.log(res.data); // Log the data returned by the server

                // Clear the form fields and show a success message
                this.setState({
                    word: '',
                    synonyms: '',
                    message: 'Synonyms added successfully!', // Success message
                    messageType: 'success' // Set message type as 'success'
                });
            })
            .catch(error => {
                console.error('There was an error adding the synonyms:', error); // Log any error from the API call

                // Set error message if the API request fails
                this.setState({
                    message: 'There was an error adding the synonyms.', // Error message
                    messageType: 'error' // Set message type as 'error'
                });
            });
    };

    render() {
        return (
            <div className="mx-auto max-w-md sm:w-96">
                <h4 className="text-2xl pb-2">Add Synonyms</h4>
                {/* Show the message if there is one (success, error, or warning) */}
                {this.state.message && (
                    <div className={`p-3 mb-3 rounded-lg text-white ${this.state.messageType === "success" ? "bg-green-500" : this.state.messageType === "error" ? "bg-red-500" : "bg-yellow-500"}`} role="alert" >
                        {this.state.message} {/* Display the message */}
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <div className="mt-4 space-y-4">
                        {/* Input field for the word */}
                        <div>
                            <label htmlFor="word" className="block text-sm font-medium text-gray-700">Word</label>
                            <input
                                type="text"
                                id="word" // ID for the word input
                                className="mt-2 w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-base placeholder-gray-400 pl-4"
                                placeholder="Enter a word"
                                value={this.state.word} // Bind the value to state
                                onChange={this.handleChange} // Handle input changes
                                onFocus={this.clearMessage} // Clear the message when the input is focused
                            />
                        </div>
                        {/* Input field for the synonyms */}
                        <div>
                            <label htmlFor="synonyms" className="block text-sm font-medium text-gray-700" >Synonyms (comma-separated)</label>
                            <input
                                type="text"
                                id="synonyms" // ID for the synonyms input
                                className="mt-2 w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-base placeholder-gray-400 pl-4"
                                placeholder="Enter synonyms (e.g., clean, tidy)"
                                value={this.state.synonyms} // Bind the value to state
                                onChange={this.handleChange} // Handle input changes
                                onFocus={this.clearMessage} // Clear the message when the input is focused
                            />
                        </div>
                    </div>
                    {/* Submit button */}
                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="inline-flex items-center rounded-md bg-green-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none" >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}