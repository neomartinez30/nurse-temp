import { useState, useEffect } from 'react';
// import { findCallerByPhone, updateCallerName as updateCallerNameInDB } from '../data/mockDatabase';
import axios from 'axios';
import { updateCallerDataTable } from '../store/slices/databaseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';


export const useCallerData = (callerId: string | null) => {
    const [callerData, setCallerData] = useState<{ name: string } | null>(null);
    const [callerDataa, setCallerDataa] = useState<{
        PhoneNumber?: string,
        Name: string,
        AccountNumber?: string,
        DOD_ID?: string,
        FamilyMembers?: any[],
        TicketNumber?: string,
        TicketStatus?: string,
        TicketOwner?: string,
    } | null>(null);
    const CallerDataTable = useSelector((state: RootState) => state.database);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const CS = useSelector((state: RootState) => state.call);
    const interactionId = CS.interactionID;
    const ticketNumber = CallerDataTable.TicketNumber;


    useEffect(() => {
        if (callerDataa) {
            dispatch(updateCallerDataTable(callerDataa));
        }
    }, [callerDataa]);


    console.log('000-callerData:', callerDataa);
    useEffect(() => {
        console.log('000-useEffect triggered with callerId:', callerId);
        const fetchCallerData = async () => {
            setIsLoading(true);
            let temp;
            const softphoneIframe = document.getElementById("softphone") as HTMLIFrameElement;
            const isWebMessaging = window.sessionStorage.getItem('isWebMessaging') === 'true';
            const messageType = window.sessionStorage.getItem('messageType');

            console.log("00-callerId:", callerId, ' isWebMessaging:', isWebMessaging, ' messageType:', messageType);
            if (callerId === 'Chat' && isWebMessaging && messageType === 'webmessaging') {
                // Hardcode temp value for web messaging conversations
                temp = '16259825479'; // Replace with your desired hardcoded value
                console.log('00-Using hardcoded number for web messaging:', temp);
            } else if (callerId) {
                temp = callerId.slice(1);
                console.log('00-Using callerId for temp:', temp);
            }

            console.log('temp:', temp);
            try {
                // Call the backend API to get caller data
                //const response = await axios.get(`http://localhost:3001/api/caller/${temp}`)

                const response = await axios.post(`https://sxxn35nhn7.execute-api.us-east-1.amazonaws.com/dev/endpoint`, {
                    phoneNumber: temp,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log('000-response:', response);
                // Extract caller information from response
                if (response.data) {
                    const dataa = response.data;
                    const familyMembers = dataa.FamilyMembers
                        ? parseFamilyMembers(dataa.FamilyMembers)
                        : [];



                    console.log('PremName:', dataa.Name);
                    if (softphoneIframe && softphoneIframe.contentWindow) {
                        softphoneIframe.contentWindow.postMessage(JSON.stringify({
                            type: 'addAttribute',
                            data: {
                                "interactionId": interactionId,
                                "attributes": {
                                    "TicketNumber": ticketNumber,
                                    "CustomerName": dataa.Name
                                }
                            }
                        }), "*");
                        console.log('PremName:', dataa.Name);
                        console.log("121212-Ticket number and customer name sent to Genesys:", ticketNumber, dataa.Name);
                    }



                    setCallerData({
                        name: dataa.Name || 'Unknown',
                    })
                    setCallerDataa({
                        Name: dataa.Name || 'Unknown',
                        FamilyMembers: familyMembers,
                        AccountNumber: dataa.AccountNumber,
                        // TicketStatus: dataa.TicketStatus,
                        // TicketOwner: dataa.TicketOwner,
                        DOD_ID: dataa.DOD_ID,
                        PhoneNumber: dataa.key,
                    });
                    console.log('000-Caller data found:', response.data);
                    //return response.data
                    // setCallerData({ name: response.data.Name || 'Unknown' });


                } else {
                    setCallerDataa(null);
                    console.log('000-No data found for caller:', callerId);
                }
                setError(null);



            } catch (err) {
                setError('000-Failed to fetch caller data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (callerId) {

            console.log('000-Calling fetchCallerData with callerId:', callerId);
            fetchCallerData();
        } else {
            console.log('000-callerId is falsy, not fetching data');
        }
    }, [callerId]);


    return { CallerDataTable, callerData, isLoading, error };
};




function parseFamilyMembers(familyMembersString: string) {
    try {
        // Replace single quotes with double quotes
        let jsonString = familyMembersString.replace(/'/g, '"');

        // Add quotes around property names (including those with spaces)
        // This regex handles both regular property names and those with spaces
        jsonString = jsonString.replace(/(\w+\s*\w*):/g, '"$1":');

        // Handle "DOD ID" specifically since it has a space and appears in your data
        jsonString = jsonString.replace(/"DOD ID":/g, '"DOD_ID":');

        // Parse the string as JSON
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing family members:", error);

        // Fallback manual parsing for very problematic strings
        try {
            // Use a more aggressive approach for malformed JSON
            const sanitized = familyMembersString
                .replace(/'/g, '"')
                .replace(/(\w+\s*[\w\s]*?):/g, '"$1":');

            return JSON.parse(sanitized);
        } catch (fallbackError) {
            console.error("Fallback parsing also failed:", fallbackError);
            return [];
        }
    }
}



// Helper function to parse the FamilyMembers string
// function parseFamilyMembers(familyMembersString: string) {
//     try {
//         // Replace single quotes with double quotes
//         let jsonString = familyMembersString.replace(/'/g, '"');
//         // Add quotes around property names
//         jsonString = jsonString.replace(/(\w+):/g, '"$1":');
//         // Parse the string as JSON
//         return JSON.parse(jsonString);
//     } catch (error) {
//         console.error("Error parsing family members:", error);
//         return [];
//     }
// }



