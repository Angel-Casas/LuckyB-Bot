<template>
    <div class="BJWrapper">
        <div class="formWrapper">
            <div class="BJConnectForm form">
                <h3>User Input</h3>
                <div class="userInput">
                    <label for="uuid">UUID:</label>
                    <input type="text" v-model="uuid" id="uuid" maxlength="100" minlength="1" placeholder="UUID" required>
                </div>
                <div class="userInput">
                    <label for="token">TOKEN:</label>
                    <input type="text" v-model="token" id="token" maxlength="100" minlength="1" placeholder="Token" required>
                </div>
                <div class="inputButtons">
                    <button @click="createConnection" :disabled="!uuid || !token" v-if="!liveSignal">Connect</button>
                    <button @click="disconnect" v-else>Disconnect</button>
                    <button @click="subscribe" v-if="liveSignal && room_id === 0">Subscribe</button>
                    <button @click="unsubscribe" v-if="liveSignal && room_id !== 0">Unsubscribe</button>
                    <button @click="setLocalStorageContent">Save Settings</button>
                </div>
                <div class="info">
                    <h4>- HOW TO -</h4>
                    <p>1. Select currency and bet Size before connecting.</p>
                    <p>2. Go to luckybird.io and once logged in open Developer tools and inside "Application" look for Local Storage.<br/>
                    Inside Local Storage find and copy your uid and token into the inputs above.</p>
                    <p>3. Hit CONNECT and wait a few seconds to get a live signal. (You should see Room id from Statistics table below change value from 0 to another number)</p>
                    <p>4. Hit START.</p>
                    <p>If at any point it randomly stops try using the "STAND" button to see if that can force it to continue.</p>
                </div>
            </div>
            <div class="BJActionsForm form">
                <h3>Parameters</h3>
                <div class="userInput">
                    <label for="currency">CURRENCY:</label>
                    <select name="currency" id="currency" v-model="currency">
                        <option value="gold">Gold Coins</option>
                        <option value="usd" selected>USD</option>
                    </select>
                </div>
                <div class="userInput">
                    <label for="nextbet">BET SIZE:</label>
                    <input type="text" v-model="nextbet" id="nextbet">
                </div>
                <div class="actionButtons">
                    <button @click="start" v-if="!starting">Start</button>
                    <button @click="stop" v-else>Stop</button>
                    <button @click="stopOnWin = !stopOnWin">Stop on next win ({{ stopOnWin }})</button>
                </div>
                <h4>Player Actions</h4>
                <div class="playerButtons">
                    <button @click="handleSendHit">Hit</button>
                    <button @click="handleSendStand">Stand</button>
                    <button @click="handleSendDouble">Double</button>
                    <button @click="handleSendSplit">Split</button>
                </div>
                <span class="liveSignal bold" v-if='liveSignal'>Live</span>
                    <span class="reconnectingSignal bold" v-else-if='reconnectingSignal'>Reconnecting</span>
                    <span class="offlineSignal bold" v-else>Offline</span>
            </div>
        </div>
        <div class="stats">
            <h3 class="subtitle">Statsistics</h3>
            <div class="itemBox">
                <div class="statItem">
                    <p>Balance: {{ Number(balance).toFixed(4) }}</p>
                </div>
                <div class="statItem">
                    <p>Initial balance: {{ Number(initialBalance).toFixed(4) }}</p>
                </div>
                <div class="statItem">
                    <p>Bet Amount: {{ Number(nextbet).toFixed(4) }}</p>
                </div>
                <div class="statItem">
                    <p>Room id: {{ room_id }}</p>
                </div>
                <div class="statItem">
                    <p>Wins: {{ wins }}</p>
                </div>
                <div class="statItem">
                    <p>Highest win streak: {{ highestWinStreak }}</p>
                </div>
                <div class="statItem">
                    <p>Losses: {{ losses }}</p>
                </div>
                <div class="statItem">
                    <p>Highest loosing streak: {{ highestLoosingStreak }}</p>
                </div>
                <div class="statItem">
                    <p>Bets: {{ bets }}</p>
                </div>
                <div class="statItem">
                    <p>Current profit: {{ Number(profit).toFixed(4) }}</p>
                </div>
                <div class="statItem">
                    <p>Highest profit: {{ Number(highestProfit).toFixed(4) }}</p>
                </div>
                <div class="statItem">
                    <p>Lowest profit: {{ Number(lowestProfit).toFixed(4) }}</p>
                </div>
                <div class="statItem">
                    <p>Wager: {{ Number(wager).toFixed(4) }} ({{ Number((wager / initialBalance) * 100).toFixed(8) }}x)</p>
                </div>
            </div>
        </div>
        <p class="version">v0.0.3</p>
    </div>
</template>
<script setup>
/* IMPORTS */
import { v4 as uuidv4 } from 'uuid';
import Paho from "paho-mqtt";
import Fingerprint2 from 'fingerprintjs2';
import { generateFingerprint } from '~/composables/utils';


/* VARIABLES */
const uuid = ref(""),
     token = ref(""),
  currency = ref("usd"),
   nextbet = ref(0.0001),
   balance = ref(0),
   initialBalance = ref(0),
   room_id = ref(0),
   luckyBird = ref(),
   liveSignal = ref(false),
   reconnectingSignal = ref(false),
   starting = ref(false),
   timestamp = ref(Date.now()),
   message = ref(),
   destination = ref("/n"),
   fingerprint = ref(),
   run = ref(false),
   dealerCards = ref(),
   playerCards = ref(),
   playerCardsLeft = ref(),
   playerCardsRight = ref(),
   timeoutBet = ref(5),
   profitTarget = ref(100),
   profit = ref(0),
   wager = ref(0),
   bets = ref(0),
   losses = ref(0),
   wins = ref(0),
   actions = ref(),
   splitted = ref(false),
   action = ref(null),
   betId = ref(0),
   stopOnWin = ref(false),
   currentHand = ref(0),
   highestWinStreak = ref(0),
   highestLoosingStreak = ref(0),
   currentWinStreak = ref(0),
   currentLoosingStreak = ref(0),
   highestProfit = ref(0),
   lowestProfit = ref(0);

/* ACTIONS */

const initConnect = () => {
    try {
        timestamp.value = Date.now();
        let key = token.value + "luckybird" + timestamp.value;
        key = generateKey(key).substring(0, 8);
        const data = {
            code: 3012,
            data: {
                is_room: false,
                fingerprint: fingerprint.value,
                domain: "luckybird.io",
                device: "pc",
                timestamp: timestamp.value,
                key,
            },
            uid: uuid.value,
            token: token.value,
        };
        message.value = new Paho.Message(JSON.stringify(data));
        message.value.destinationName = destination.value;
        luckyBird.value.send(message.value);
    } catch (error) {
        console.log(error);
    }
};

const createConnection = async () => {
    console.log("Starting connection to WebSocket Server");
    try {
        reconnectingSignal.value = true;

        let uid4 = uuidv4();
        // let iddleTimeout;
        // let iddleValue = 15000; // Call if 15 seconds without response

        luckyBird.value = new Paho.Client("wss://luckybird.io/mqtt", uid4);

        const options = {
            useSSL: true,
            onSuccess: () => {
                console.log("Connected!");
                liveSignal.value = true;
                reconnectingSignal.value = false;
                subscribe();
            },
            onFailure: () => {
                console.log("Failed to connect.");
                liveSignal.value = false;
            }
        }

        
        luckyBird.value.onConnectionLost = (error) => {
            liveSignal.value = false;
            if (error.errorCode === 0) {
                console.log("Successfully disconnected.");
            } else {
                console.log("Connection lost with error:");
                console.log(error);
                console.log("Attempting to reconnect...");
                reconnectingSignal.value = true;
                // CHANGE THIS TO ADD CONTINUE BETTING IF RUNNING.
                createConnection();
            }
        };
        
        luckyBird.value.onMessageArrived = (event) => {
            // clearTimeout(iddleTimeout);
            // iddleTimeout = setTimeout(() => {
            //     console.log("15 seconds without actions, attempting to Stand.");
            //     handleSendStand();
            // }, iddleValue);
            handleOnMessageArrived(event);
        };

        // luckyBird.value.onMessageDelivered = (event) => {
        //     console.log("Message delivered.");
        //     console.log(event);
        // };

        luckyBird.value.connect(options);
    } catch (error) {
        reconnectingSignal.value = false;
        console.log("error:", error);
    }
};

const handleOnMessageArrived = (event) => {
    // console.log(event.payloadString);
    try {
        const decoder = new TextDecoder("utf-8");
        message.value = decoder.decode(event.payloadBytes);
        message.value = message.value
        .replace(/\u0000/, "")
        .replace(/[/]/, "")
        .replace(/'/g, '"');
        
        const index = message.value.indexOf("{");
        message.value = message.value.slice(index, message.value.length);
        message.value = JSON.parse(message.value);

        if (message.value.code === 3012) {
            const wallets = message.value.data.player.balances;
            for (const item in wallets) {
                // console.log(`${item}: ${wallets[item].amount}`);
                if (item === String(currency.value).toLowerCase()) {
                    balance.value = Number(wallets[item].amount);
                    if (initialBalance.value === 0) {
                        console.log("Setting initial balance.");
                        initialBalance.value = balance.value;
                    }
                    console.log("Currency: ", currency.value);
                    console.log("Balance: ", balance.value);

                    const data = {
                        code: 3022,
                        data: {
                            game_name: "blackJack",
                        },
                        uid: uuid.value,
                        token: token.value,
                    };

                    message.value = new Paho.Message(JSON.stringify(data));
                    message.value.destinationName = destination.value;
                    luckyBird.value.send(message.value);
                }
            }
        }

        if (message.value.code === 3022) {
            console.log(message.value);
            if (message.value.data.errcode === -1) {
                console.log("The game is under maintenance.");
            } else {
                room_id.value = message.value.data.room_id;
                console.log("Connected to a BJ room.");
            }
        }

        if (message.value.code === 4701) {
            // INITIAL
            betId.value++;
            console.log("RECEIVED INITIAL", betId.value);
            // console.log(message.value);
            splitted.value = 0;
            if (message.value.data.errcode === 0) return handleResult(message.value);
        }

        if (message.value.code === 4703) {
            // HIT
            console.log("RECEIVED HIT", betId.value);
            console.log(message.value);

            if (splitted.value && message.value.data.errcode === 0 && message.value.data.blackjack.player[currentHand.value]) {
                return handleSplitResult(message.value);
            }
            if (message.value.data.errcode === 0) return handleResult(message.value);
        }
        if (message.value.code === 4704) {
            // STAND
            console.log("RECEIVED STAND", betId.value);
            console.log(message.value);
            if (splitted.value && message.value.data.errcode === 0 && currentHand.value === 0) {
                currentHand.value = 1;
                return handleSplitResult(message.value);
            }
            // if (message.value.data.errcode === 0) return handleResult(message.value);
            }

        if (message.value.code === 4705) {
            // SPLIT
            console.log("RECEIVED SPLIT", betId.value);
            console.log(message.value);
            if (!splitted.value) {
                console.log("Splitting for first time");
                splitted.value = true;
                currentHand.value = 0;
            } else {
                console.log("Attempting to split for second time");
                return;
            }
            if (message.value.data.errcode === 0) return handleSplitResult(message.value);
            // if (message.value.data.errcode === -1) return handleSendStand();
        }

        if (message.value.code === 4706) {
            // DOUBLE
            console.log("RECEIVED DOUBLE", betId.value);
            console.log(message.value);
            if (splitted.value && message.value.data.errcode === 0 && currentHand.value === 0) {
                currentHand.value = 1;
                return handleSplitResult(message.value);
            } else if (splitted.value && message.value.data.errcode === 0 && message.value.data.blackjack.player[currentHand]) {
                return handleSplitResult(message.value);
            }
            // if (message.value.data.errcode === 0) return handleResult(message.value);
        }

        if (message.value.code === 4707) {
            // END
            console.log("RECEIVED END", betId.value);
            currentHand.value = 0;
            // console.log(message.value);
            return handleEndRound(message.value);
        }
    } catch (err) {
        console.log(err);
    }
}

const start = () => {
    console.log("Starting game.");
    run.value = true;
    startBetting();
};

const stop = () => {
    console.log("Stopping game.");
    run.value = false;
};

const startBetting = () => {
    const data = {
        code: 4701,
        data: {
            amount: nextbet.value,
            currency: String(currency.value).toLowerCase(),
            room_id: room_id.value,
        },
        uid: uuid.value,
        token: token.value,
    };
    if (run.value) {
        console.log("SENDING INITIAL");
        handleSendBetting(data);
    }
};

const handleSendBetting = (data) => {
    if (run.value) {
        message.value = new Paho.Message(JSON.stringify(data));
        message.value.destinationName = destination.value;
        luckyBird.value.send(message.value);
    }
};

const handleSendHit = () => {
    const data = {
        code: 4703,
        data: {
            room_id: room_id.value,
        },
        uid: uuid.value,
        token: token.value,
    };
    if (run.value) {
        console.log("SENDING HIT");
        handleSendBetting(data);
    }
};

const handleSendStand = () => {
    const data = {
        code: 4704,
        data: {
            room_id: room_id.value,
        },
        uid: uuid.value,
        token: token.value,
    };
    if (run.value) {
        console.log("SENDING STAND");
        handleSendBetting(data);
    }
};

const handleSendSplit = () => {
    const data = {
        code: 4705,
        data: {
            room_id: room_id.value,
        },
        uid: uuid.value,
        token: token.value,
    };
    if (run.value) {
        console.log("SENDING SPLIT");
        handleSendBetting(data);
    }
};

const handleSendDouble = () => {
    const data = {
        code: 4706,
        data: {
            room_id: room_id.value,
        },
        uid: uuid.value,
        token: token.value,
    };
    if (run.value) {
        console.log("SENDING DOUBLE");
        handleSendBetting(data);
    }
};

const handleResult = (data) => {
    console.log("Handle result:", data);
    if (run.value) {
        dealerCards.value = data.data.blackjack.dealer[0].cards.map((item) => showCard(item));
        console.log("Dealer cards:", dealerCards.value);
        console.log("Dealer point:", data.data.blackjack.dealer[0].value);

        playerCards.value = data.data.blackjack.player[0].cards.map((item) => showCard(item));
        console.log("Player cards:", playerCards.value);
        console.log("Player point:", data.data.blackjack.player[0].value);
    }
    
    if (data.data.blackjack.player[0].value === 21) {
        console.log("Landed blackjack");
        // return;
    }
    if (data.data.blackjack.player[0].value > 21) {
        console.log("Busted");
        return;
    }

    let sameCard = null;


    if (
        data.data.blackjack.player[0].cards[0].number ===
        data.data.blackjack.player[0].cards[1].number
    ) {
        console.log("Same card.");
        sameCard = true;
    }

    let pHaveA = null;
    if (
        data.data.blackjack.player[0].cards[0].number === 1 ||
        data.data.blackjack.player[0].cards[1].number === 1
    ) {
        // console.log("Have Ace.");
        pHaveA = true;
    }

    const many = data.data.blackjack.player[0].cards.length;

    if (sameCard && many < 3) {
        actions.value = ["Hit", "Stand", "Double", "Split"];
    } else if (many > 2) {
        actions.value = ["Hit", "Stand"];
    } else {
        actions.value = ["Hit", "Stand", "Double"];
    }

    return handleNextBetting(
        data.data.blackjack.dealer[0].value,
        data.data.blackjack.player[0].value,
        actions,
        sameCard,
        pHaveA
    );
};


const handleSplitResult = (data) => {
    console.log("Handle Split Result:", data);
    console.log("Hand chosen: ", currentHand.value);
    if (run.value) {
        dealerCards.value = data.data.blackjack.dealer[0].cards.map((item) => showCard(item));
        console.log("Dealer cards:", dealerCards.value);
        console.log("Dealer point:", data.data.blackjack.dealer[0].value);

        playerCardsLeft.value = data.data.blackjack.player[1].cards.map((item) => showCard(item));
        console.log("Player cards LEFT:", playerCardsLeft.value);
        console.log("Player point LEFT:", data.data.blackjack.player[1].value);

        playerCardsRight.value = data.data.blackjack.player[0].cards.map((item) => showCard(item));
        console.log("Player cards RIGHT:", playerCardsRight.value);
        console.log("Player point RIGHT:", data.data.blackjack.player[0].value);

        const many = data.data.blackjack.player[currentHand.value].cards.length;

        if (many > 2) {
            actions.value = ["Hit", "Stand"];
        } else actions.value = ["Hit", "Stand", "Double"];


        handleNextBetting(
            data.data.blackjack.dealer[0].value,
            data.data.blackjack.player[currentHand.value].value,
            actions,
            null,
            null
        );
    }
};

const handleNextBetting = (dPoint, pPoint, actions, sameCard, pHaveA) => {
    console.log(dPoint, pPoint, actions.value, sameCard, pHaveA);
    if (run.value) {
        action.value = null;

        if (sameCard) {
            console.log("Split Script");
            splitScript().map((item) => {
                if (item.point[0] === dPoint && item.point[1] === pPoint) {
                    action.value = item.action;
                    return;
                }
            });
        } else if (pHaveA) {
            console.log("Soft Script");
            softScript().map((item) => {
                if (item.point.join() === `${dPoint},${pPoint}`)
                    return (action.value = item.action);
            });
        } else {
            console.log("Hard Script");
            hardScript().map((item) => {
                if (item.point.join() === `${dPoint},${pPoint}`) {
                    action.value = item.action;
                    return;
                }
            });
        }

        if (!action.value) action.value = "H";

        actions.value = actions.value.map((item) => {
            let a = "";
            if (item === "Hit") a = "H";
            if (item === "Stand") a = "S";
            if (item === "Double") a = "D";
            if (item === "Split") a = "P";
            return a;
        });

        const index = actions.value.find((item) => item === action.value);

        if (!index) action.value = "S";

        console.log("Next action:", action.value);
        // console.log(`Wait ${timeoutBet.value}s to send next bet`);

        switch (action.value) {
            case "D":
                setTimeout(handleSendDouble(), timeoutBet.value * 1e3);
                break;
            case "H":
                setTimeout(handleSendHit(), timeoutBet.value * 1e3);
                break;
            case "P":
                setTimeout(handleSendSplit(), timeoutBet.value * 1e3);
                break;
            case "S":
                setTimeout(handleSendStand(), timeoutBet.value * 1e3);
                break;
        };
    };
};

const handleEndRound = (data) => {
    console.log("Handle End Round:", data);

    if (run.value) {
        dealerCards.value = data.data.blackjack.dealer[0].cards.map((item) => showCard(item));
        console.log("Dealer cards:", dealerCards.value);
        console.log("Dealer point:", data.data.blackjack.dealer[0].value);

        playerCards.value = data.data.blackjack.player[0].cards.map((item) => showCard(item));
        console.log("Player cards:", playerCards.value);
        console.log("Player point:", data.data.blackjack.player[0].value);

        if (data.data.blackjack.player[1]) {
            playerCards.value = data.data.blackjack.player[1].cards.map((item) => showCard(item));
            console.log("Player cards:", playerCards.value);
            console.log("Player point:", data.data.blackjack.player[1].value);
        }

        let result = Number(data.data.payout) > 0 ? "WIN" : "LOOSE";
        console.log("Result:", result);

        if (result === "WIN") {
            currentWinStreak.value++;
            currentLoosingStreak.value = 0;
            if (currentWinStreak.value > highestWinStreak.value) highestWinStreak.value = currentWinStreak.value;
        } else {
            currentLoosingStreak.value++;
            currentWinStreak.value = 0;
            if (currentLoosingStreak.value > highestLoosingStreak.value) highestLoosingStreak.value = currentLoosingStreak.value;
        }

        wager.value += Number(data.data.bet.amount);
        console.log("Wager value:", wager.value);
        profit.value += Number(data.data.bet.win) - Number(data.data.bet.amount);
        balance.value = Number(data.data.bet.cur_balance);
        bets.value++;
        Number(data.data.payout) > 0 ? wins.value++ : losses.value++;

        if (splitted.value) splitted.value = false;

        if (profit.value > highestProfit.value) {
            highestProfit.value = profit.value;
        }
        if (profit.value < lowestProfit.value) {
            lowestProfit.value = profit.value;
        }

        if (profit.value >= profitTarget.value) {
            return stop(), console.log("Target profit has been reached!");
        }

        if (stopOnWin.value) {
            stopOnWin.value = false;
            stop();
        }

        if (run.value) {
            setTimeout(startBetting(), timeoutBet.value * 1e3);
        }
    }
}


const subscribe = () => {
    console.log("Attempting to subscribe.");
    luckyBird.value.subscribe(destination.value, {
        qos: 1,
        onSuccess: () => {
            console.log("Successfully subscribed.");
            Fingerprint2.get({}, (components) => {
                const values = components.map((component) => {
                if (
                    component.key === "canvas" ||
                    component.key === "webgl" ||
                    component.key === "fonts"
                ) {
                    component.value = generateHash(component.value);
                }
                return component.value;
                });
                fingerprint.value = generateFingerprint(values);
                setTimeout(initConnect(), 5000); // 5 seconds delay
            });

            
        },
        onFailure: (error) => {
            console.log("Failed to subscribe.");
            console.log(error);
        }
    });
}

const unsubscribe = () => {
    console.log("Attempting to unsubscribe.");
    const options = {
        onSuccess: () => {
                console.log("Unsubscribed!");
                room_id.value = 0;
            },
        onFailure: () => {
            console.log("Failed to unsubscribe.");
        }
    };
    luckyBird.value.unsubscribe(destination.value, options);
}

const disconnect = () => {
    console.log("Attempting to disconnect.");
    try {
        luckyBird.value.disconnect();
    } catch (error) {
        console.log("Failed to disconnect.");
        console.log(error);
    }
};

const setLocalStorageContent = () => {
    let data = {
        nextbet: nextbet.value,
        currency: currency.value,
        uuid: uuid.value,
        token: token.value,
    };
    localStorage.setItem('userData', JSON.stringify(data));
    console.log("Saved settings to Local Storage.");
}

const loadLocalStorageContent = () => {
    let data = JSON.parse(localStorage.getItem("userData"));
    if (data.nextbet) nextbet.value = data.nextbet;
    if (data.currency) currency.value = data.currency;
    if (data.uuid) uuid.value = data.uuid;
    if (data.token) token.value = data.token;
    console.log("Loaded settings from Local Storage.");
}

onMounted(() => {
    loadLocalStorageContent();
})
</script>