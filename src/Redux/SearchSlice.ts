import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Redux slice for managing the global search query used to filter coins
 */
export const searchSlice = createSlice({
    name: "search-query",
    initialState: "",
    reducers: {
        /**
         * Set the global search query
         */
        setSearchQuery: (_state: string, action: PayloadAction<string>): string => action.payload,
        /**
         * Clear the search query
         */
        clearSearchQuery: (): string => "",
    },
});

export const searchSliceActions = searchSlice.actions;
