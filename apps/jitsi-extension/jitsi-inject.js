setInterval(() => {
    try {
        if (window.APP && window.APP.store) {
            let state = window.APP.store.getState();
            let participantsState = state['features/base/participants'];
            
            let extracted = [];
            
            // Helper to extract relevant fields
            function addParticipant(p) {
                if (p && p.name) {
                    extracted.push({
                        name: (p.name || "UNKNOWN").trim().toUpperCase(),
                        avatarUrl: p.avatarURL || ""
                    });
                }
            }

            if (participantsState) {
                // local participant
                if (participantsState.local) {
                    addParticipant(participantsState.local);
                }
                
                // remote participants
                if (participantsState.remote) {
                    if (participantsState.remote instanceof Map) {
                        for (let p of participantsState.remote.values()) {
                            addParticipant(p);
                        }
                    } else {
                        // dictionary object
                        for (let key in participantsState.remote) {
                            addParticipant(participantsState.remote[key]);
                        }
                    }
                }
            }
            
            document.dispatchEvent(new CustomEvent('TrackitJitsiParticipantsUpdate', {
                detail: JSON.stringify(extracted)
            }));
        }
    } catch (e) {
        // fail silently in injected script
    }
}, 1000);
