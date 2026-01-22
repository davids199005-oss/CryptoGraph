import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: "search-query",
    initialState: "",
    reducers: {
        setSearchQuery: (_state: string, action: PayloadAction<string>): string => action.payload,
        clearSearchQuery: (): string => "",
    },
});

export const searchSliceActions = searchSlice.actions;
