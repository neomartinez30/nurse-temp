import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../store';
import { updateCallState } from '../store/slices/callSlice';
import { useNavigate } from 'react-router-dom';
import { updateCallerDataTable } from '../store/slices/databaseSlice';

const useCallState = () => {
    const dispatch = useDispatch();
    const callState = useSelector((state: RootState) => state.call);
    const navigate = useNavigate();
    const isCallActive = callState.isCallActive;
    let formattedDate = '';
    const CallerDataTable = useSelector((state: RootState) => state.database);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            try {
                console.log('Raw message event:', event.data);
                const message = JSON.parse(event.data);
                console.log('Parsed message:', message);

                // Extract phone and state information
                const temp = message.data.interaction?.new?.phone ?? message.data.interaction?.phone;
                const callstat = message.data.interaction?.state ?? message.data.interaction?.new?.state;
                const interactionId = message.data.interaction?.new?.id ?? message.data.interaction?.id;

                console.log('Call state details:', {
                    phone: temp,
                    state: callstat,
                    interactionId,
                    isCallActive
                });

                // Handle different call states
                switch (callstat) {
                    case "ALERTING":
                        console.log('Handling ALERTING state');
                        dispatch(updateCallState({ 
                            isCallActive: true, 
                            callerId: 'Identifying', 
                            stateOfCall: 'ALERTING',
                            interactionID: interactionId 
                        }));
                        break;

                    case "CONNECTED":
                        console.log('Handling CONNECTED state');
                        handleConnectedState(message, temp, interactionId);
                        break;

                    case "DISCONNECTED":
                        console.log('Handling DISCONNECTED state');
                        handleDisconnectedState(message, interactionId);
                        break;

                    default:
                        console.log('Unhandled call state:', callstat);
                        dispatch(updateCallState({ 
                            isCallActive: false, 
                            callerId: '-', 
                            stateOfCall: 'IDLE',
                            interactionID: null 
                        }));
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };

        const handleConnectedState = async (message: any, temp: string, interactionId: string) => {
            const currentState = store.getState();
            const existingTicket = currentState.database?.TicketNumber;
            let ticketNumber = existingTicket;

            if (!existingTicket || existingTicket === '-') {
                ticketNumber = `TK${Math.floor(Math.random() * 10000000)}`;
                const now = new Date();
                formattedDate = `Created ${now.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })}`;
            }

            // Handle web messaging vs voice call
            if (message.data.interaction?.new?.isMessage) {
                window.sessionStorage.setItem('isWebMessaging', 'true');
                window.sessionStorage.setItem('messageType', 'webmessaging');
                dispatch(updateCallState({ 
                    isCallActive: true, 
                    callerId: 'Web-Chat', 
                    stateOfCall: 'CONNECTED',
                    interactionID: interactionId 
                }));
            } else {
                window.sessionStorage.setItem('isWebMessaging', 'false');
                window.sessionStorage.removeItem('messageType');
                dispatch(updateCallState({ 
                    isCallActive: true, 
                    callerId: temp, 
                    stateOfCall: 'CONNECTED',
                    interactionID: interactionId 
                }));
            }

            // Update ticket information
            if (ticketNumber !== existingTicket) {
                dispatch(updateCallerDataTable({
                    ...currentState.database,
                    TicketNumber: ticketNumber,
                    TicketStatus: 'Open',
                    TicketOwner: 'Auto-Unassigned',
                    TicketCreatedAt: formattedDate
                }));

  
        const updateGenesysAttributes = (interactionId: string, ticketNumber: string, customerName: string = 'Unknown') => {
            try {
              const softphoneIframe = document.getElementById("softphone") as HTMLIFrameElement;
              if (softphoneIframe?.contentWindow) {
                console.log('Sending attributes to Genesys:', {
                  interactionId,
                  ticketNumber,
                  customerName
                });
          
                softphoneIframe.contentWindow.postMessage(JSON.stringify({
                  type: 'addAttribute',
                  data: {
                    interactionId,
                    attributes: {
                      TicketNumber: ticketNumber,
                      CustomerName: customerName || 'Unknown' // Ensure customerName is never null
                    }
                  }
                }), "*");
              }
            } catch (error) {
              console.error('Error sending attributes to Genesys:', error);
            }
          };

        const handleDisconnectedState = async (message: any, interactionId: string) => {
            if (message.data.category === "acw") {
                try {
                    const response = await fetch('https://sqc5jqut58.execute-api.us-east-1.amazonaws.com/dev/caller-attributes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ conversationID: interactionId })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update caller attributes');
                    }

                    // Reset state after successful API call
                    dispatch(updateCallState({ 
                        isCallActive: false, 
                        callerId: '-', 
                        stateOfCall: 'IDLE',
                        interactionID: null 
                    }));
                    dispatch(updateCallerDataTable({
                        PhoneNumber: '',
                        Name: '-',
                        AccountNumber: '-',
                        DOD_ID: '-',
                        FamilyMembers: [],
                        TicketNumber: '-',
                        TicketStatus: '-',
                        TicketOwner: '-',
                        TicketCreatedAt: '-'
                    }));
                } catch (error) {
                    console.error('Error updating caller attributes:', error);
                }
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    return callState;
};

export default useCallState;