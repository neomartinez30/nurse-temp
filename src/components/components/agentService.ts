import axios from 'axios';

// Define the base URL for the AI agent service
const API_BASE_URL = 'https://your-backend-url.com/api'; // Replace with your actual backend URL

// Define the types for agent responses
export interface AgentResponse {
  content: string;
  type: 'text' | 'sql' | 'error';
  sqlQuery?: string;
  data?: any;
}

export const agentService = {
  /**
   * Send a message to the SURSE assistant agent
   * @param message The user message
   * @returns A promise that resolves to the agent's response
   */
  async sendMessage(message: string): Promise<AgentResponse> {
    try {
      // Mock implementation - in a real app, this would call your LangChain backend
      // This is a placeholder that mimics the behavior described in the paste.txt file
      
      // For demo purposes, we'll simulate different responses based on the input
      const lowerMessage = message.toLowerCase();
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate SQL query for database-related questions
      if (lowerMessage.includes('database') || 
          lowerMessage.includes('sql') || 
          lowerMessage.includes('query') ||
          lowerMessage.includes('health') ||
          lowerMessage.includes('patient')) {
        
        return {
          content: 'I can help you query the health database. Here\'s a SQL query I would use:',
          type: 'sql',
          sqlQuery: `SELECT patient_id, diagnosis, treatment_date 
FROM patients 
WHERE diagnosis LIKE '%${message.replace(/database|sql|query/gi, '')}%' 
LIMIT 10;`
        };
      }
      
      // Simulate drug lookup
      if (lowerMessage.includes('drug') || 
          lowerMessage.includes('medication') || 
          lowerMessage.includes('medicine') ||
          lowerMessage.includes('prescription')) {
        
        const drugName = extractDrugName(lowerMessage);
        
        if (drugName) {
          return {
            content: `Here's information about ${drugName}:\n\nIndications: Used to treat symptoms of anxiety, tension, and insomnia.\n\nWarnings: May cause drowsiness. Alcohol may intensify this effect.`,
            type: 'text'
          };
        } else {
          return {
            content: 'I can help you look up drug information. What specific medication are you interested in?',
            type: 'text'
          };
        }
      }
      
      // Default response
      return {
        content: 'I\'m your SURSE assistant. I can help with healthcare database queries and drug information lookups. How can I assist you today?',
        type: 'text'
      };
      
    } catch (error) {
      console.error('Error calling agent service:', error);
      return {
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        type: 'error'
      };
    }
  },
  
  /**
   * Execute an approved SQL query through the agent
   * @param sqlQuery The SQL query to execute
   * @returns A promise that resolves to the query results
   */
  async executeSqlQuery(sqlQuery: string): Promise<AgentResponse> {
    try {
      // Mock implementation - in a real app, this would send the query to your backend
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockData = [
        { patient_id: 'P1001', diagnosis: 'Hypertension', treatment_date: '2024-02-15' },
        { patient_id: 'P1042', diagnosis: 'Type 2 Diabetes', treatment_date: '2024-03-01' },
        { patient_id: 'P1104', diagnosis: 'Asthma', treatment_date: '2024-02-28' }
      ];
      
      return {
        content: 'Query executed successfully. Here are the results:',
        type: 'sql',
        sqlQuery,
        data: mockData
      };
      
    } catch (error) {
      console.error('Error executing SQL query:', error);
      return {
        content: 'Sorry, I encountered an error executing your SQL query. Please try again later.',
        type: 'error'
      };
    }
  }
};

// Helper function to extract potential drug names from user messages
function extractDrugName(message: string): string | null {
  // Common drug names for demonstration
  const commonDrugs = ['aspirin', 'ibuprofen', 'acetaminophen', 'lisinopril', 'metformin', 'lipitor'];
  
  const words = message.toLowerCase().split(/\s+/);
  
  for (const drug of commonDrugs) {
    if (words.includes(drug)) {
      return drug;
    }
  }
  
  return null;
}
