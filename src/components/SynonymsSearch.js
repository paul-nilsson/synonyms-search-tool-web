import React from 'react';
import axios from 'axios';
import SynonymsAdd from './SynonymsAdd.js'; // Import the SynonymsAdd component for adding synonyms

export default class SynonymsSearch extends React.Component {
    // Initial state to manage word, synonyms, feedback, and active panel
    state = {
        synonyms: [], // Holds the synonyms fetched from the API
        word: '', // The word being searched for synonyms
        feedback: '', // Holds the feedback message to inform the user
        activePanel: 'search', // Controls which panel is active: 'search' or 'add'
    };

    // Function to handle synonym search
    handleSearch = (wordToSearch) => {
        const word = wordToSearch || this.state.word; // Use the provided word or the current word from state

        // Check if a word is provided for search
        if (word) {
            const apiUrl = process.env.REACT_APP_API_URL; // Get the API URL from environment variables

            // Make GET request to fetch synonyms for the word
            axios
                .get(`${apiUrl}${word}`)
                .then((res) => {
                    const synonyms = res.data.synonyms; // Get synonyms from the API response
                    if (synonyms && synonyms.length > 0) {
                        this.setState({ synonyms, feedback: '', word }); // Set synonyms if available
                    } else {
                        this.setState({ synonyms: [], feedback: `No synonyms found for "${word}"` }); // No synonyms found
                    }
                })
                .catch(() => {
                    // Handle error if API request fails
                    this.setState({ synonyms: [], feedback: `No synonyms found for "${word}"` });
                });
        } else {
            // Handle case when no word is provided
            this.setState({ feedback: 'Please enter a word to search for synonyms', synonyms: [] });
        }
    };

    // Function to clear the feedback message
    clearFeedback = () => {
        this.setState({ feedback: '' });
    };

    // Function to toggle between the 'search' and 'add' panels
    togglePanel = (panel) => {
        if (panel === 'add') {
            // Clear search-related state when switching to Add Synonyms panel
            this.setState({
                word: '',
                synonyms: [],
                feedback: '',
            });
        }
        this.setState({ activePanel: panel }); // Set the active panel to the desired one
    };

    render() {
        const { synonyms, word, feedback, activePanel } = this.state; // Destructure state for convenience

        return (
            <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                {/* Panel for Search Input and Button */}
                {activePanel === 'search' && (
                    <div className="mx-auto max-w-md sm:w-96">
                        <h4 className="text-2xl pb-2">Search for Synonyms</h4>
                        {/* Display feedback message if any */}
                        {feedback && (
                            <div
                                className={`p-3 mb-3 rounded-lg text-white ${feedback.includes('No synonyms') || feedback.includes('error') ? 'bg-red-600' : 'bg-yellow-500'}`}
                            >
                                {feedback}
                            </div>
                        )}
                        <div className="mt-4 space-y-4">
                            <label htmlFor="word" className="block text-sm font-medium text-gray-700">Word</label>
                            {/* Search input field for the word */}
                            <input
                                type="text"
                                className="mt-2 w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-base placeholder-gray-400 pl-4"
                                id="search-word"
                                placeholder="Search word..."
                                value={word} // Bind value to state
                                onChange={(e) => this.setState({ word: e.target.value })} // Update word on change
                                onFocus={this.clearFeedback} // Clear feedback when focusing on input
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            {/* Button to trigger the synonym search */}
                            <button
                                className="inline-flex items-center rounded-md bg-sky-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none"
                                onClick={() => this.handleSearch()} // Call the handleSearch function
                            >
                                Search
                            </button>
                        </div>

                        {/* Button to toggle to Add Synonyms panel */}
                        <button
                            className="pt-8 text-base font-semibold leading-7 text-sky-500 hover:text-sky-600"
                            onClick={() => this.togglePanel('add')}
                        >
                            + Add Synonyms
                        </button>
                    </div>
                )}

                {/* Panel for Synonyms Result */}
                {activePanel === 'search' && synonyms && synonyms.length > 0 && (
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg pt-6 mt-6">
                        <h4 className="font-semibold text-xl text-gray-800 mb-4">Results for "<span className="text-blue-600">{word}</span>"</h4>

                        <div className="flex flex-wrap gap-2">
                            {/* Display the list of synonyms */}
                            {synonyms.map((synonym, index) => (
                                <div key={index} className="flex items-center">
                                    {/* Link to search for each synonym */}
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-lg font-medium bg-transparent border-none cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.handleSearch(synonym); 
                                        }}
                                    >
                                        {synonym}
                                    </button>
                                    {/* Add a separator if not the last synonym */}
                                    {index < synonyms.length - 1 && (
                                        <span className="text-gray-500">, </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Panel for Adding Synonyms */}
                {activePanel === 'add' && (
                    <div>
                        {/* Render the SynonymsAdd component for adding synonyms */}
                        <SynonymsAdd onSuccess={() => this.togglePanel('search')} />
                        {/* Button to switch back to the Search panel */}
                        <button
                            className="pt-8 text-base font-semibold leading-7 text-sky-500 hover:text-sky-600"
                            onClick={() => this.togglePanel('search')}
                        >
                            &larr; Back to Search
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
