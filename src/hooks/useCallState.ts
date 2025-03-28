import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../store'; // Adjust the path as necessary
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
            const message = JSON.parse(event.data);
            let temp = message.data.interaction?.new?.phone ?? message.data.interaction?.phone;
            let callstat = message.data.interaction?.state ?? message.data.interaction?.new?.state;
            console.log('P-1-CS :== ', 'Message:', message, ' -- ', 'isCallActive:', isCallActive, '--', 'temp:', temp, ' -- ', 'callstat:', callstat);
            if (message) {
                switch (message.type) {
                    case "screenPop":
                        (document.getElementById("screenPopPayload") as HTMLTextAreaElement).value = event.data;
                        break;
                    case "processCallLog":
                        (document.getElementById("processCallLogPayLoad") as HTMLTextAreaElement).value = event.data;
                        break;
                    case "openCallLog":
                        (document.getElementById("openCallLogPayLoad") as HTMLTextAreaElement).value = event.data;
                        break;
                    default:
                        break;
                }
            }




            if (message.data.interaction?.state == "DISCONNECTED" || message.data?.data == "IDLE") {
                console.log('P-1-CS :  Testing', CallerDataTable)
                console.log('P-1-CS : message :== ', message)
                const conversationId = message.data.interaction.new?.id || message.data.interaction?.id;
                const softphoneIframe = document.getElementById("softphone") as HTMLIFrameElement;
                if (softphoneIframe && softphoneIframe.contentWindow) {
                    softphoneIframe.contentWindow.postMessage(JSON.stringify({
                        type: 'addAttribute',
                        data: {
                            "interactionId": conversationId,
                            "attributes": {
                                "TicketNumber": CallerDataTable.TicketNumber,
                                "CustomerName": CallerDataTable.Name,
                                "TicketStatus": CallerDataTable.TicketStatus,
                                "TicketOwner": CallerDataTable.TicketOwner,
                                "TicketCreatedAt": CallerDataTable.TicketCreatedAt,
                            }
                        }
                    }), "*");
                    console.log("P-1-CS :: Ticket Num and Customer Name sent to Genesys :", CallerDataTable.TicketNumber, CallerDataTable.Name);
                }

                if (message.data.category == "acw") {
                    try {

                        console.log('P-2-CS : conversationId :== ', conversationId)
                        if (conversationId) {
                            fetch('https://sqc5jqut58.execute-api.us-east-1.amazonaws.com/dev/caller-attributes', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    conversationID: conversationId
                                })
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('API call failed');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log('P-2-CS : API call successful:', data);
                                    dispatch(updateCallState({ isCallActive: false, callerId: '-', stateOfCall: 'IDLE' }));
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
                                })
                                .catch(error => {
                                    console.error('Error calling API:', error);
                                });
                        }
                    } catch (error) {
                        console.error('Error preparing API call:', error);
                    }
                }

                // dispatch(updateCallState({ isCallActive: false, callerId: '-', stateOfCall: 'IDLE' }));
                // dispatch(updateCallerDataTable({
                //     PhoneNumber: '',
                //     //Name: '-',
                //     AccountNumber: '-',
                //     DOD_ID: '-',
                //     FamilyMembers: [],
                //     TicketNumber: '-',
                //     TicketStatus: '-',
                //     TicketOwner: '-'
                // }));
                console.log('P-2-CS : State:', message.data.interaction?.state || message.data.interaction?.new.state);
                // navigate('/');
            } else if (message.data.interaction?.state == "ALERTING" || message.data.interaction?.new.state == "ALERTING") {
                dispatch(updateCallState({ isCallActive: true, callerId: 'Identifying', stateOfCall: 'ALERTING' }));
                console.log('P-2-CS : state', message.data.interaction?.state || message.data.interaction?.new.state);
            }
            else if (message.data.interaction?.state == "CONNECTED" || message.data.interaction?.new.state == "CONNECTED") {
                console.log('P-2-CS : IsCallActive :', isCallActive, ' -- ', !isCallActive);
                const interactionId = message.data.interaction.new?.id || message.data.interaction?.id;
                const currentState = store.getState();
                const existingTicket = currentState.database?.TicketNumber;
                let ticketNumber = existingTicket;

                if (!existingTicket || existingTicket === '-') {
                    ticketNumber = `TK${Math.floor(Math.random() * 10000000)}`;
                    console.log('P-2-CS : Generated Ticket Number:', ticketNumber);
                    const now = new Date();
                    const options: Intl.DateTimeFormatOptions = {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    };
                    formattedDate = `Created ${now.toLocaleDateString('en-US', options)}`;
                }

                if (message.data.interaction?.new?.isMessage == true) {
                    window.sessionStorage.setItem('isWebMessaging', 'true');
                    window.sessionStorage.setItem('messageType', 'webmessaging');
                    console.log('P-2-CS : Stored Messaging kvps - TRUE');
                    dispatch(updateCallState({ isCallActive: true, callerId: 'Web-Chat', stateOfCall: 'CONNECTED', interactionID: interactionId }));
                } else {
                    window.sessionStorage.setItem('isWebMessaging', 'false');
                    window.sessionStorage.removeItem('messageType');
                    console.log('P-2-CS : Stored Messaging kvps - FALSE');
                    dispatch(updateCallState({ isCallActive: true, callerId: temp, stateOfCall: 'CONNECTED', interactionID: interactionId }));
                }

                if (ticketNumber !== existingTicket) {
                    dispatch(updateCallerDataTable({
                        ...currentState.database,
                        TicketNumber: ticketNumber,
                        TicketStatus: 'Open',
                        TicketOwner: 'Auto-Unassigned',
                        TicketCreatedAt: formattedDate
                    }));
                }


                if (ticketNumber !== existingTicket) {

                    try {
                        const customerName = currentState.database?.Name || 'Unknown';
                        console.log('P-2-CS : TicketNumber :', ticketNumber, '--', 'customerName :', customerName);
                        const softphoneIframe = document.getElementById("softphone") as HTMLIFrameElement;
                        if (softphoneIframe && softphoneIframe.contentWindow && interactionId) {
                            softphoneIframe.contentWindow.postMessage(JSON.stringify({
                                type: 'addAttribute',
                                data: {
                                    "interactionId": interactionId,
                                    "attributes": {
                                        "TicketNumber": ticketNumber,
                                        "CustomerName": customerName
                                    }
                                }
                            }), "*");
                            console.log("P-2-CS : Ticket Num and Customer Name sent to Genesys :", ticketNumber, customerName);
                        }
                    } catch (error) {
                        console.error("P-2-CS : Error sending data to Genesys:", error);
                    }

                }

                navigate('/agent-desktop');
                console.log('P-2-CS : Routed', "/agent-desktop");

            }
            // else if (message.data.interaction?.state == "CONNECTED" || message.data.interaction?.new.state == "CONNECTED") {
            //     console.log('00-ENTERED CONNECTED-1', isCallActive, ' -- ', !isCallActive);
            //     const interactionId = message.data.interaction.new?.id || message.data.interaction?.id;
            //     const currentState = store.getState();
            //     const existingTicket = currentState.database?.TicketNumber;
            //     let ticketNumber = existingTicket;

            //     if (!isCallActive) {
            //         console.log('00-firstTimeOnly')

            //         if (!existingTicket || existingTicket === '-') {
            //             ticketNumber = `TK${Math.floor(Math.random() * 10000000)}`;
            //             console.log('Generated new ticket number:', ticketNumber);
            //         }

            //         if (interactionId) {
            //             window.sessionStorage.setItem('pendingInteractionId', interactionId);
            //             window.sessionStorage.setItem('pendingTicketNumber', ticketNumber);
            //         }

            //         // First update call state and send user to agent desktop
            //         if (message.data.interaction?.new?.isMessage == true) {
            //             window.sessionStorage.setItem('isWebMessaging', 'true');
            //             window.sessionStorage.setItem('messageType', 'webmessaging');
            //             dispatch(updateCallState({ isCallActive: true, callerId: 'Web-Chat', stateOfCall: 'CONNECTED' }));
            //         } else {
            //             window.sessionStorage.setItem('isWebMessaging', 'false');
            //             window.sessionStorage.removeItem('messageType');
            //             dispatch(updateCallState({ isCallActive: true, callerId: temp, stateOfCall: 'CONNECTED' }));
            //         }

            //         // Update ticket info in database
            //         if (ticketNumber !== existingTicket) {
            //             dispatch(updateCallerDataTable({
            //                 ...currentState.database,
            //                 TicketNumber: ticketNumber,
            //                 TicketStatus: 'Open',
            //                 TicketOwner: 'Auto-Unassigned'
            //             }));
            //         }

            //         // Navigate to agent desktop first
            //         navigate('/agent-desktop');

            //         // Set a timeout to allow API to complete before sending attributes
            //         setTimeout(() => {
            //             const updatedState = store.getState();
            //             const customerName = updatedState.database?.Name || 'Unknown';
            //             let tempName;

            //             if(tempName != null){
            //                 tempName = customerName
            //             } 
            //             try {
            //                 const softphoneIframe = document.getElementById("softphone") as HTMLIFrameElement;
            //                 if (softphoneIframe && softphoneIframe.contentWindow && interactionId && message.data?.category !== "disconnect") {
            //                     console.log('55-customerName:', customerName, ' == ', updatedState.database);
            //                     softphoneIframe.contentWindow.postMessage(JSON.stringify({
            //                         type: 'addAttribute',
            //                         data: {
            //                             "interactionId": interactionId,
            //                             "attributes": {
            //                                 "TicketNumber": ticketNumber,
            //                                 "CustomerName": tempName
            //                             }
            //                         }
            //                     }), "*");
            //                     console.log("Delayed - Ticket number and customer name sent to Genesys:", ticketNumber, customerName);
            //                 }
            //             } catch (error) {
            //                 console.error("Error sending data to Genesys:", error);
            //             }
            //         }, 3000); // Wait 3 seconds for API to complete
            //     }
            //   }
            else {
                dispatch(updateCallState({ isCallActive: false, callerId: '-', stateOfCall: 'IDLE' }));
                console.log('P-2-CS : ElseLoop');
            }
            //dispatch(updateCallState({ isCallActive: true, callerId: temp }));
        };
        window.addEventListener("message", messageHandler);

        return () => {
            // document.getElementById("addAssociation")?.removeEventListener("click", addAssociation);
            window.removeEventListener("message", messageHandler);
        };
    }, []);

    return callState;
};

export default useCallState;