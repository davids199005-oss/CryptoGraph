/**
 * Model for ChatGPT prompts
 * Combines system and user content for API calls
 */
export class Prompt {
    /**
     * System prompt that defines the AI behavior and role
     */
    public systemContent!: string;
    
    /**
     * User prompt containing the question or request
     */
    public userContent!: string;
}
